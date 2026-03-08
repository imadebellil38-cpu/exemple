const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const dossier = __dirname;
let timer = null;

console.log('✅ Sauvegarde automatique activée — je surveille ton projet...');

// Surveille tous les fichiers du dossier
fs.watch(dossier, { recursive: true }, (event, fichier) => {
  if (!fichier) return;

  // Ignore les fichiers Git et node_modules
  if (fichier.includes('.git') || fichier.includes('node_modules') || fichier.includes('autosave')) return;

  // Attends 2 secondes avant de sauvegarder (évite les doublons)
  clearTimeout(timer);
  timer = setTimeout(() => {
    try {
      const date = new Date().toLocaleString('fr-FR');
      execSync(`git -C "${dossier}" add .`);
      execSync(`git -C "${dossier}" commit -m "Sauvegarde automatique — ${date}"`, { stdio: 'pipe' });
      console.log(`💾 Sauvegardé automatiquement — ${date} (${fichier})`);
    } catch (e) {
      // Pas de changement à sauvegarder, c'est normal
    }
  }, 2000);
});
