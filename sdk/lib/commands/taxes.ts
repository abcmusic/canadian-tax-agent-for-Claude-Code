/**
 * /taxes Command - Canadian Tax Expert
 *
 * Entry point for all tax operations.
 * Summons tax expert orchestrator with appropriate subcommand.
 */

import { TaxExpertOrchestrator } from '../agents/tax-expert-orchestrator';

export interface TaxesCommandContext {
  cwd: string;
  taxYear?: number;
  taxpayerProfile?: any;
}

/**
 * Main taxes command handler
 */
export async function taxesCommand(
  args: string[],
  context: TaxesCommandContext
): Promise<void> {
  const subcommand = args[0] || 'interactive';
  const year = args[1] ? parseInt(args[1]) : undefined;

  // Initialize orchestrator
  const orchestrator = new TaxExpertOrchestrator({
    taxYear: year || context.taxYear || new Date().getFullYear(),
    taxpayer: context.taxpayerProfile,
    workingDir: context.cwd
  });

  // Route to appropriate handler
  switch (subcommand) {
    case 'personal':
      await handlePersonal(orchestrator);
      break;

    case 'corporate':
      await handleCorporate(orchestrator);
      break;

    case 'update-rules':
      await handleUpdateRules(orchestrator, year);
      break;

    case 'optimize':
      await handleOptimize(orchestrator);
      break;

    case 'status':
      await handleStatus(orchestrator);
      break;

    case 'help':
      showHelp();
      break;

    case 'interactive':
    default:
      await orchestrator.interactiveMode();
      break;
  }
}

/**
 * Handle personal tax preparation
 */
async function handlePersonal(orchestrator: TaxExpertOrchestrator): Promise<void> {
  const result = await orchestrator.preparePersonalTax();

  if (result.success) {
    console.log('\n' + '═'.repeat(60));
    console.log('PERSONAL TAX SUMMARY');
    console.log('═'.repeat(60));
    console.log(`Total Income:      $${result.summary.income.toLocaleString()}`);
    console.log(`Deductions:        $${result.summary.deductions.toLocaleString()}`);
    console.log(`Taxable Income:    $${result.summary.taxable.toLocaleString()}`);
    console.log(`Federal Tax:       $${result.summary.federalTax.toLocaleString()}`);
    console.log(`Provincial Tax:    $${result.summary.provincialTax.toLocaleString()}`);
    console.log(`Total Tax:         $${result.summary.totalTax.toLocaleString()}`);

    if (result.summary.refund) {
      console.log(`\n✅ Refund:          $${result.summary.refund.toLocaleString()}`);
    } else if (result.summary.balanceOwing) {
      console.log(`\n💰 Balance Owing:   $${result.summary.balanceOwing.toLocaleString()}`);
    }

    console.log('\n📦 Filing Package:');
    console.log(`   ${result.packagePath}`);
    console.log('\n📋 Forms included:');
    result.forms.forEach(form => console.log(`   - ${form}`));
  } else {
    console.error('\n❌ Personal tax preparation failed');
    if (result.errors) {
      result.errors.forEach(err => console.error(`   • ${err}`));
    }
  }
}

/**
 * Handle corporate tax preparation
 */
async function handleCorporate(orchestrator: TaxExpertOrchestrator): Promise<void> {
  const result = await orchestrator.prepareCorporateTax();

  if (result.success) {
    console.log('\n' + '═'.repeat(60));
    console.log('CORPORATE TAX SUMMARY');
    console.log('═'.repeat(60));
    console.log(`Active Business Income: $${result.summary.income.toLocaleString()}`);
    console.log(`Taxable Income:         $${result.summary.taxable.toLocaleString()}`);
    console.log(`Federal Tax (SBD):      $${result.summary.federalTax.toLocaleString()}`);
    console.log(`Provincial Tax:         $${result.summary.provincialTax.toLocaleString()}`);
    console.log(`Total Tax:              $${result.summary.totalTax.toLocaleString()}`);

    const effectiveRate = ((result.summary.totalTax / result.summary.income) * 100).toFixed(2);
    console.log(`Effective Rate:         ${effectiveRate}%`);

    console.log('\n📦 Filing Package:');
    console.log(`   ${result.packagePath}`);
    console.log('\n📋 Forms included:');
    result.forms.forEach(form => console.log(`   - ${form}`));
  } else {
    console.error('\n❌ Corporate tax preparation failed');
    if (result.errors) {
      result.errors.forEach(err => console.error(`   • ${err}`));
    }
  }
}

/**
 * Handle tax rules update
 */
async function handleUpdateRules(orchestrator: TaxExpertOrchestrator, year?: number): Promise<void> {
  const result = await orchestrator.updateTaxRules(year);

  if (result.success) {
    console.log(`\n✅ Tax rules updated for ${result.year}`);
    console.log(`\nUpdated components:`);
    result.components.forEach(comp => console.log(`  ✓ ${comp}`));

    if (result.changes.length > 0) {
      console.log(`\n📝 Changes detected:`);
      result.changes.forEach(change => {
        console.log(`  • ${change.category}: ${change.field}`);
        console.log(`    ${change.old} → ${change.new}`);
        console.log(`    Impact: ${change.impact}`);
      });
    } else {
      console.log('\n✓ No changes from previous version');
    }
  } else {
    console.error(`\n❌ Failed to update tax rules for ${result.year}`);
    console.error('Please check your internet connection and try again.');
  }
}

/**
 * Handle tax optimization
 */
async function handleOptimize(orchestrator: TaxExpertOrchestrator): Promise<void> {
  const recommendations = await orchestrator.optimizeTaxes();

  console.log('\n' + '═'.repeat(60));
  console.log('TAX OPTIMIZATION RECOMMENDATIONS');
  console.log('═'.repeat(60));

  if (Array.isArray(recommendations) && recommendations.length > 0) {
    recommendations.forEach((rec, i) => {
      console.log(`\n${i + 1}. ${rec.title}`);
      console.log(`   ${rec.description}`);
      if (rec.savings) {
        console.log(`   💰 Potential savings: $${rec.savings.toLocaleString()}`);
      }
    });
  } else {
    console.log('\n✓ Your current tax strategy appears optimal');
    console.log('  No immediate optimization opportunities identified');
  }
}

/**
 * Handle filing status check
 */
async function handleStatus(orchestrator: TaxExpertOrchestrator): Promise<void> {
  const status = await orchestrator.getFilingStatus();

  console.log('\n' + '═'.repeat(60));
  console.log(`FILING STATUS - ${status.year}`);
  console.log('═'.repeat(60));

  if (status.personal) {
    console.log('\n📄 Personal (T1):');
    console.log(`   Status: ${status.personal.status || 'Not started'}`);
    if (status.personal.completedDate) {
      console.log(`   Completed: ${status.personal.completedDate}`);
    }
  } else {
    console.log('\n📄 Personal (T1): Not started');
  }

  if (status.corporate) {
    console.log('\n🏢 Corporate (T2):');
    console.log(`   Status: ${status.corporate.status || 'Not started'}`);
    if (status.corporate.completedDate) {
      console.log(`   Completed: ${status.corporate.completedDate}`);
    }
  } else {
    console.log('\n🏢 Corporate (T2): Not started');
  }

  console.log('\n📅 Deadlines:');
  console.log(`   Personal: April 30, ${status.year + 1}`);
  console.log(`   Corporate: 6 months after fiscal year-end`);
}

/**
 * Show help information
 */
function showHelp(): void {
  console.log('\n' + '═'.repeat(60));
  console.log('CANADIAN TAX EXPERT - HELP');
  console.log('═'.repeat(60));
  console.log('\nUsage: /taxes [command] [year]');
  console.log('\nCommands:');
  console.log('  personal          Prepare personal tax return (T1)');
  console.log('  corporate         Prepare corporate tax return (T2)');
  console.log('  update-rules      Fetch latest CRA tax rules and forms');
  console.log('  optimize          Analyze tax optimization opportunities');
  console.log('  status            Check current filing status');
  console.log('  help              Show this help message');
  console.log('\nExamples:');
  console.log('  /taxes personal       Prepare current year T1');
  console.log('  /taxes personal 2024  Prepare 2024 T1');
  console.log('  /taxes corporate      Prepare current year T2');
  console.log('  /taxes update-rules   Update to latest rules');
  console.log('  /taxes optimize       Get optimization recommendations');
  console.log('\nFeatures:');
  console.log('  • Personal (T1) and Corporate (T2) tax returns');
  console.log('  • CCPC optimization (salary vs dividend)');
  console.log('  • Automatic CRA rule updates (Nov/Dec/Jan)');
  console.log('  • Offline PDF form completion');
  console.log('  • All data stays local (no cloud upload)');
  console.log('\n💡 Tip: The agent will ask for document locations');
  console.log('   as these vary by year. Have file paths ready!');
}

export default taxesCommand;
