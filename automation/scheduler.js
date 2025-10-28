#!/usr/bin/env node

/**
 * Scheduler pour automatisation quotidienne
 * Exécute le pipeline complet à des heures définies
 */

const cron = require('node-cron');
const AutomationOrchestrator = require('./main');
const fs = require('fs').promises;
const path = require('path');

class Scheduler {
  constructor() {
    this.orchestrator = new AutomationOrchestrator();
    this.logFile = path.join(__dirname, 'logs/scheduler.log');
    this.tasks = [];
  }

  /**
   * Log les messages
   */
  async log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    console.log(logMessage.trim());

    try {
      await fs.appendFile(this.logFile, logMessage);
    } catch (error) {
      console.error('Erreur lors de l\'écriture du log:', error);
    }
  }

  /**
   * Exécute le pipeline d'automatisation
   */
  async runAutomation() {
    await this.log('════════════════════════════════════════════════════');
    await this.log('Déclenchement de l\'automatisation planifiée');
    await this.log('════════════════════════════════════════════════════');

    try {
      await this.orchestrator.run();
      await this.log('✓ Automatisation terminée avec succès');
    } catch (error) {
      await this.log(`✗ Échec de l\'automatisation: ${error.message}`);
    }
  }

  /**
   * Configure les tâches planifiées
   */
  setupSchedule(schedules) {
    schedules.forEach((schedule, index) => {
      const task = cron.schedule(schedule.cron, async () => {
        await this.log(`Exécution de la tâche planifiée: ${schedule.name}`);
        await this.runAutomation();
      }, {
        scheduled: false,
        timezone: schedule.timezone || 'Africa/Tunis'
      });

      this.tasks.push({
        name: schedule.name,
        cron: schedule.cron,
        task
      });

      this.log(`✓ Tâche planifiée configurée: ${schedule.name} (${schedule.cron})`);
    });
  }

  /**
   * Démarre le scheduler
   */
  start() {
    this.log('════════════════════════════════════════════════════');
    this.log('Démarrage du scheduler d\'automatisation');
    this.log('════════════════════════════════════════════════════');

    this.tasks.forEach(({ name, cron, task }) => {
      task.start();
      this.log(`▶️  Tâche démarrée: ${name} (${cron})`);
    });

    this.log(`\n✓ Scheduler actif avec ${this.tasks.length} tâches planifiées`);
    this.log('Le processus continue en arrière-plan...\n');

    // Affichage des prochaines exécutions
    this.displayNextExecutions();

    // Keep alive
    setInterval(() => {
      // Simple ping pour maintenir le processus actif
    }, 60000);
  }

  /**
   * Arrête le scheduler
   */
  stop() {
    this.log('Arrêt du scheduler...');

    this.tasks.forEach(({ name, task }) => {
      task.stop();
      this.log(`⏸️  Tâche arrêtée: ${name}`);
    });

    this.log('✓ Scheduler arrêté');
  }

  /**
   * Affiche les prochaines exécutions
   */
  displayNextExecutions() {
    console.log('\n📅 Prochaines exécutions planifiées:\n');

    this.tasks.forEach(({ name, cron }) => {
      console.log(`   • ${name}`);
      console.log(`     Cron: ${cron}`);
      console.log(`     Description: ${this.describeCron(cron)}\n`);
    });
  }

  /**
   * Décrit une expression cron en français
   */
  describeCron(expression) {
    // Descriptions basiques pour les expressions courantes
    const descriptions = {
      '0 8 * * *': 'Tous les jours à 8h00',
      '0 14 * * *': 'Tous les jours à 14h00',
      '0 20 * * *': 'Tous les jours à 20h00',
      '0 */4 * * *': 'Toutes les 4 heures',
      '0 */6 * * *': 'Toutes les 6 heures',
      '0 0 * * *': 'Tous les jours à minuit',
      '0 12 * * *': 'Tous les jours à midi'
    };

    return descriptions[expression] || expression;
  }

  /**
   * Teste immédiatement l'automatisation
   */
  async testNow() {
    await this.log('Test manuel de l\'automatisation...');
    await this.runAutomation();
  }
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes('--help')) {
    console.log(`
Usage: node automation/scheduler.js [command] [options]

Commands:
  start        Démarre le scheduler en mode continu (défaut)
  test         Exécute immédiatement l'automatisation pour tester
  once         Exécute une seule fois puis quitte

Options:
  --morning    Ajoute une exécution matinale (8h00)
  --afternoon  Ajoute une exécution après-midi (14h00)
  --evening    Ajoute une exécution soir (20h00)
  --interval N Exécute toutes les N heures
  --help       Affiche cette aide

Exemples:
  node automation/scheduler.js start --morning --evening
  node automation/scheduler.js test
  node automation/scheduler.js start --interval 6

Pour lancer en arrière-plan:
  nohup node automation/scheduler.js start > /dev/null 2>&1 &
`);
    process.exit(0);
  }

  const command = args[0] || 'start';
  const scheduler = new Scheduler();

  // Configuration des horaires
  const schedules = [];

  if (args.includes('--morning')) {
    schedules.push({ name: 'Matinale', cron: '0 8 * * *', timezone: 'Africa/Tunis' });
  }

  if (args.includes('--afternoon')) {
    schedules.push({ name: 'Après-midi', cron: '0 14 * * *', timezone: 'Africa/Tunis' });
  }

  if (args.includes('--evening')) {
    schedules.push({ name: 'Soirée', cron: '0 20 * * *', timezone: 'Africa/Tunis' });
  }

  const intervalIndex = args.indexOf('--interval');
  if (intervalIndex !== -1 && args[intervalIndex + 1]) {
    const hours = parseInt(args[intervalIndex + 1]);
    schedules.push({
      name: `Toutes les ${hours}h`,
      cron: `0 */${hours} * * *`,
      timezone: 'Africa/Tunis'
    });
  }

  // Planification par défaut si aucune option
  if (schedules.length === 0 && command === 'start') {
    schedules.push(
      { name: 'Matin', cron: '0 8 * * *', timezone: 'Africa/Tunis' },
      { name: 'Après-midi', cron: '0 14 * * *', timezone: 'Africa/Tunis' },
      { name: 'Soir', cron: '0 20 * * *', timezone: 'Africa/Tunis' }
    );
  }

  // Exécution selon la commande
  if (command === 'test') {
    scheduler.testNow().catch(error => {
      console.error('Erreur lors du test:', error);
      process.exit(1);
    });
  } else if (command === 'once') {
    scheduler.runAutomation().then(() => {
      console.log('✓ Exécution unique terminée');
      process.exit(0);
    }).catch(error => {
      console.error('Erreur:', error);
      process.exit(1);
    });
  } else {
    // Mode start
    scheduler.setupSchedule(schedules);
    scheduler.start();

    // Gestion de l'arrêt propre
    process.on('SIGINT', () => {
      console.log('\nArrêt demandé...');
      scheduler.stop();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.log('\nArrêt demandé...');
      scheduler.stop();
      process.exit(0);
    });
  }
}

module.exports = Scheduler;
