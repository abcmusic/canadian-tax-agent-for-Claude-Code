/**
 * Tax Expert Orchestrator
 *
 * Main coordinator for Canadian tax preparation.
 * Spawns specialized subagents for parallel execution and aggregates results.
 */

// import { Task } from '@anthropic-ai/claude-agent-sdk';
// import { Memory } from '../memory';
import { calculatePersonalTax, calculateCCPCTax, type TaxResult, type CCPCTaxResult } from '../utils/tax-calculations';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

export interface TaxpayerProfile {
  personal: {
    firstName: string;
    lastName: string;
    sin: string;
    dateOfBirth: Date;
    province: string;
    maritalStatus: 'single' | 'married' | 'common-law' | 'separated' | 'divorced' | 'widowed';
  };
  corporate?: {
    corporationName: string;
    businessNumber: string;
    fiscalYearEnd: string;
    ccpcStatus: boolean;
  };
}

export interface DocumentLocations {
  year: number;
  personal?: {
    'previous-return'?: string;
    'health-expenses'?: string;
    'donation-receipts'?: string;
    't-slips'?: string;
  };
  corporate?: {
    'financial-statements'?: string;
    'payroll-summary'?: string;
    'previous-t2'?: string;
    'bank-statements'?: string;
  };
}

export interface TaxPreparationResult {
  success: boolean;
  year: number;
  type: 'personal' | 'corporate' | 'both';
  forms: string[];
  summary: {
    income: number;
    deductions: number;
    taxable: number;
    federalTax: number;
    provincialTax: number;
    totalTax: number;
    refund?: number;
    balanceOwing?: number;
  };
  packagePath?: string;
  errors?: string[];
  warnings?: string[];
}

export interface UpdateResult {
  success: boolean;
  year: number;
  components: string[];
  changes: Change[];
  timestamp: string;
}

export interface Change {
  category: string;
  field: string;
  old: any;
  new: any;
  impact: string;
}

// =============================================================================
// TAX EXPERT ORCHESTRATOR CLASS
// =============================================================================

export class TaxExpertOrchestrator {
  // private memory: Memory;
  private taxYear: number;
  private taxpayer: TaxpayerProfile | undefined;
  private workingDir: string;

  constructor(options: {
    taxYear?: number;
    taxpayer?: TaxpayerProfile;
    workingDir?: string;
  }) {
    this.taxYear = options.taxYear || new Date().getFullYear();
    this.taxpayer = options.taxpayer;
    this.workingDir = options.workingDir || process.cwd();
    // this.memory = new Memory(`tax-expert/${this.taxYear}`);
  }

  // ===========================================================================
  // DOCUMENT DISCOVERY
  // ===========================================================================

  /**
   * Prompt user for document locations
   * Documents vary by year, so ask each time
   */
  async promptUserForDocuments(
    type: 'personal' | 'corporate',
    needed: string[]
  ): Promise<Record<string, string>> {
    console.log(`\n📄 Document Discovery for ${type} (${this.taxYear})`);
    console.log('─'.repeat(60));

    const locations: Record<string, string> = {};

    for (const docType of needed) {
      const description = this.getDocumentDescription(docType);
      console.log(`\nPlease provide the path for: ${description}`);
      console.log(`Type: ${docType}`);

      // In actual implementation, this would use AskUserQuestion tool
      // For now, simulate with prompt
      const path = await this.askForPath(docType);

      if (path) {
        locations[docType] = path;
        console.log(`✓ ${docType}: ${path}`);
      } else {
        console.log(`⊘ ${docType}: Skipped (optional)`);
      }
    }

    // Save locations for future reference
    await this.saveDocumentLocations(type, locations);

    return locations;
  }

  /**
   * Save document locations to .claude-tax/document-locations.json
   */
  async saveDocumentLocations(
    type: 'personal' | 'corporate',
    locations: Record<string, string>
  ): Promise<void> {
    const existing = await this.loadDocumentLocations();

    if (!existing[this.taxYear]) {
      existing[this.taxYear] = {};
    }

    existing[this.taxYear][type] = locations;

    await this.writeJSON(
      '.claude-tax/document-locations.json',
      existing
    );

    await this.memory.store(
      `document-locations-${type}`,
      JSON.stringify(locations)
    );
  }

  /**
   * Load previously saved document locations
   */
  async loadDocumentLocations(): Promise<Record<number, Record<string, any>>> {
    try {
      return await this.readJSON('.claude-tax/document-locations.json');
    } catch {
      return {};
    }
  }

  private getDocumentDescription(docType: string): string {
    const descriptions: Record<string, string> = {
      'previous-return': 'Previous year tax return (PDF)',
      'health-expenses': 'Medical/dental expense receipts or summary',
      'donation-receipts': 'Charitable donation receipts',
      't-slips': 'T4, T5, or other tax slips',
      'financial-statements': 'Corporate financial statements (balance sheet, income statement)',
      'payroll-summary': 'Payroll summary (for T4/T4A processing)',
      'previous-t2': 'Previous year T2 corporate return',
      'bank-statements': 'Corporate bank statements'
    };
    return descriptions[docType] || docType;
  }

  private async askForPath(docType: string): Promise<string | null> {
    // In actual implementation, use AskUserQuestion tool
    // For now, return null (will be implemented with SDK tools)
    return null;
  }

  // ===========================================================================
  // PERSONAL TAX PREPARATION (T1)
  // ===========================================================================

  /**
   * Orchestrate complete personal tax preparation
   * Uses parallel agents for data gathering, then sequential for calculation
   */
  async preparePersonalTax(): Promise<TaxPreparationResult> {
    console.log(`\n🧾 Preparing Personal Tax Return (T1) for ${this.taxYear}`);
    console.log('═'.repeat(60));

    try {
      // Phase 0: Document discovery
      const needed = ['previous-return', 'health-expenses', 'donation-receipts', 't-slips'];
      const docs = await this.promptUserForDocuments('personal', needed);

      // Phase 1: Parallel data gathering
      console.log('\n📊 Phase 1: Data Gathering (Parallel)');
      const dataResults = await this.parallelDataGathering(docs);

      // Phase 2: Tax calculation (sequential, depends on data)
      console.log('\n🧮 Phase 2: Tax Calculation');
      const taxResult = await this.calculateTaxes(dataResults);

      // Phase 3: Form completion (sequential, depends on calculation)
      console.log('\n📝 Phase 3: Form Completion');
      const forms = await this.completeForms('personal', taxResult);

      // Phase 4: Package generation
      console.log('\n📦 Phase 4: Package Generation');
      const packagePath = await this.generatePackage('personal', forms);

      // Summary
      const summary = this.createSummary('personal', taxResult);

      console.log('\n✅ Personal tax preparation complete!');
      console.log(`Package saved to: ${packagePath}`);

      return {
        success: true,
        year: this.taxYear,
        type: 'personal',
        forms,
        summary,
        packagePath
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('\n❌ Personal tax preparation failed:', errorMessage);
      return {
        success: false,
        year: this.taxYear,
        type: 'personal',
        forms: [],
        summary: {} as any,
        errors: [errorMessage]
      };
    }
  }

  /**
   * Parallel data gathering phase
   */
  private async parallelDataGathering(docs: Record<string, string>): Promise<any> {
    const agents = [];

    // Spawn form reader if previous return available
    if (docs['previous-return']) {
      agents.push(
        this.spawnAgent('form-reader', {
          task: `Extract tax data from ${docs['previous-return']}`,
          file: docs['previous-return']
        })
      );
    }

    // Spawn deduction analyzer if expenses available
    if (docs['health-expenses']) {
      agents.push(
        this.spawnAgent('deduction-analyzer', {
          task: `Analyze medical expenses from ${docs['health-expenses']}`,
          file: docs['health-expenses']
        })
      );
    }

    // Always validate rules current
    agents.push(
      this.spawnAgent('rules-validator', {
        task: `Verify ${this.taxYear} tax rules are current`,
        year: this.taxYear
      })
    );

    // Run all agents in parallel
    const results = await Promise.all(agents);

    return this.aggregateResults(results);
  }

  /**
   * Calculate taxes using tax-calculations utility
   */
  private async calculateTaxes(data: any): Promise<TaxResult> {
    // Use tax-calculations.ts functions
    const result = calculatePersonalTax(
      data.taxableIncome || 0,
      this.taxpayer.personal.province,
      this.taxYear
    );

    // Store in memory for reference
    await this.memory.store('tax-calculation-result', JSON.stringify(result));

    return result;
  }

  /**
   * Complete forms using form-completion skill
   */
  private async completeForms(type: 'personal' | 'corporate', data: any): Promise<string[]> {
    const agent = await this.spawnAgent('form-completer', {
      task: `Complete ${type} tax forms for ${this.taxYear}`,
      data,
      year: this.taxYear
    });

    return agent.forms || [];
  }

  /**
   * Generate filing package
   */
  private async generatePackage(type: 'personal' | 'corporate', forms: string[]): Promise<string> {
    const outputDir = `.claude-tax/completed-returns/${this.taxYear}/${type}`;
    const packageName = `${this.taxYear}-${type}-Tax-Complete.pdf`;

    // Combine all forms into single PDF (using form-completion logic)
    const packagePath = `${outputDir}/${packageName}`;

    await this.memory.store(`package-path-${type}`, packagePath);

    return packagePath;
  }

  // ===========================================================================
  // CORPORATE TAX PREPARATION (T2)
  // ===========================================================================

  /**
   * Orchestrate complete corporate tax preparation
   */
  async prepareCorporateTax(): Promise<TaxPreparationResult> {
    console.log(`\n🏢 Preparing Corporate Tax Return (T2) for ${this.taxYear}`);
    console.log('═'.repeat(60));

    try {
      // Phase 0: Document discovery
      const needed = ['financial-statements', 'payroll-summary', 'previous-t2'];
      const docs = await this.promptUserForDocuments('corporate', needed);

      // Phase 1: Parallel data gathering
      console.log('\n📊 Phase 1: Data Gathering (Parallel)');
      const [financial, payroll, investment] = await Promise.all([
        this.spawnAgent('financial-analyzer', {
          task: `Extract T2 data from ${docs['financial-statements']}`,
          file: docs['financial-statements']
        }),
        this.spawnAgent('payroll-processor', {
          task: 'Process T4/T4A slips',
          file: docs['payroll-summary']
        }),
        this.spawnAgent('investment-processor', {
          task: 'Process T5 investment income',
          year: this.taxYear
        })
      ]);

      // Phase 2: Tax calculation
      console.log('\n🧮 Phase 2: Tax Calculation');
      const taxResult = await this.calculateCorporateTax({
        financial,
        payroll,
        investment
      });

      // Phase 3: Parallel form completion
      console.log('\n📝 Phase 3: Form Completion (Parallel)');
      const [t2, t4Summary, t5Summary] = await Promise.all([
        this.spawnAgent('form-completer', {
          task: 'Complete T2 return',
          data: taxResult,
          formType: 'T2'
        }),
        this.spawnAgent('form-completer', {
          task: 'Complete T4 Summary',
          data: payroll,
          formType: 'T4Summary'
        }),
        this.spawnAgent('form-completer', {
          task: 'Complete T5 Summary',
          data: investment,
          formType: 'T5Summary'
        })
      ]);

      // Phase 4: Package
      console.log('\n📦 Phase 4: Package Generation');
      const forms = [t2.path, t4Summary.path, t5Summary.path];
      const packagePath = await this.generatePackage('corporate', forms);

      const summary = this.createSummary('corporate', taxResult);

      console.log('\n✅ Corporate tax preparation complete!');
      console.log(`Package saved to: ${packagePath}`);

      return {
        success: true,
        year: this.taxYear,
        type: 'corporate',
        forms,
        summary,
        packagePath
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('\n❌ Corporate tax preparation failed:', errorMessage);
      return {
        success: false,
        year: this.taxYear,
        type: 'corporate',
        forms: [],
        summary: {} as any,
        errors: [errorMessage]
      };
    }
  }

  private async calculateCorporateTax(data: any): Promise<CCPCTaxResult> {
    const result = calculateCCPCTax(
      data.financial.activeBusinessIncome || 0,
      data.financial.investmentIncome || 0,
      this.taxpayer.personal.province,
      this.taxYear
    );

    await this.memory.store('corporate-tax-result', JSON.stringify(result));

    return result;
  }

  // ===========================================================================
  // TAX RULES UPDATE
  // ===========================================================================

  /**
   * Update tax rules for specified year
   */
  async updateTaxRules(year?: number): Promise<UpdateResult> {
    const targetYear = year || this.taxYear;

    console.log(`\n🔄 Updating tax rules for ${targetYear}`);
    console.log('═'.repeat(60));

    try {
      const agent = await this.spawnAgent('tax-rules-updater', {
        task: `Fetch and validate ${targetYear} CRA tax rules`,
        year: targetYear
      });

      // Store update timestamp
      await this.memory.store(
        `tax-rules/${targetYear}/last-update`,
        new Date().toISOString()
      );

      console.log(`\n✅ Tax rules updated for ${targetYear}`);

      return {
        success: true,
        year: targetYear,
        components: agent.components || [],
        changes: agent.changes || [],
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`\n❌ Failed to update tax rules for ${targetYear}:`, errorMessage);
      return {
        success: false,
        year: targetYear,
        components: [],
        changes: [],
        timestamp: new Date().toISOString()
      };
    }
  }

  // ===========================================================================
  // TAX OPTIMIZATION
  // ===========================================================================

  /**
   * Analyze tax optimization opportunities
   */
  async optimizeTaxes(): Promise<any> {
    console.log(`\n💡 Analyzing Tax Optimization for ${this.taxYear}`);
    console.log('═'.repeat(60));

    const agent = await this.spawnAgent('tax-optimizer', {
      task: 'Analyze salary vs dividend optimization and other strategies',
      year: this.taxYear,
      taxpayer: this.taxpayer
    });

    return agent.recommendations || [];
  }

  // ===========================================================================
  // STATUS & REPORTING
  // ===========================================================================

  /**
   * Get current filing status
   */
  async getFilingStatus(): Promise<any> {
    const personalStatus = await this.memory.query('personal-status');
    const corporateStatus = await this.memory.query('corporate-status');

    return {
      year: this.taxYear,
      personal: personalStatus ? JSON.parse(personalStatus) : null,
      corporate: corporateStatus ? JSON.parse(corporateStatus) : null
    };
  }

  // ===========================================================================
  // HELPER METHODS
  // ===========================================================================

  /**
   * Spawn a specialized agent
   */
  private async spawnAgent(
    agentType: string,
    params: any
  ): Promise<any> {
    // In actual implementation, use Task tool with appropriate subagent
    // For now, return mock result
    console.log(`  └─ Spawning ${agentType} agent...`);

    // Simulate agent work
    await new Promise(resolve => setTimeout(resolve, 100));

    console.log(`  └─ ✓ ${agentType} complete`);

    return {
      success: true,
      ...params
    };
  }

  /**
   * Aggregate results from multiple agents
   */
  private aggregateResults(results: any[]): any {
    return results.reduce((acc, result) => ({
      ...acc,
      ...result
    }), {});
  }

  /**
   * Create summary for tax return
   */
  private createSummary(type: 'personal' | 'corporate', taxResult: any): any {
    return {
      income: taxResult.activeBusinessIncome || 0,
      deductions: 0,
      taxable: taxResult.activeBusinessIncome || 0,
      federalTax: taxResult.smallBusinessDeduction || 0,
      provincialTax: taxResult.provincialTax || 0,
      totalTax: taxResult.totalTax || 0
    };
  }

  /**
   * Load taxpayer profile from config
   */
  private loadTaxpayer(): TaxpayerProfile {
    // In actual implementation, load from .claude-tax/config.json
    return {
      personal: {
        firstName: '',
        lastName: '',
        sin: '',
        dateOfBirth: new Date(),
        province: 'ON',
        maritalStatus: 'single'
      }
    };
  }

  /**
   * Read JSON file
   */
  private async readJSON(path: string): Promise<any> {
    // Stub for file reading
    return {};
  }

  /**
   * Write JSON file
   */
  private async writeJSON(path: string, data: any): Promise<void> {
    // Stub for file writing
  }

  /**
   * Interactive mode - guide user through process
   */
  async interactiveMode(): Promise<void> {
    console.log('\n🤖 Canadian Tax Expert - Interactive Mode');
    console.log('═'.repeat(60));
    console.log('\nWhat would you like to do?');
    console.log('  1. Prepare personal tax (T1)');
    console.log('  2. Prepare corporate tax (T2)');
    console.log('  3. Update tax rules');
    console.log('  4. Optimize tax strategy');
    console.log('  5. Check filing status');

    // In actual implementation, use AskUserQuestion
    // For now, provide guidance
    console.log('\nUse commands:');
    console.log('  /taxes personal    - Prepare T1');
    console.log('  /taxes corporate   - Prepare T2');
    console.log('  /taxes update-rules - Update CRA rules');
    console.log('  /taxes optimize    - Tax optimization');
    console.log('  /taxes status      - Filing status');
  }
}

export default TaxExpertOrchestrator;
