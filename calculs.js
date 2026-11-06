(function (root) {
  function moyennePonderee(matieres) {
    // Chaque note contribue au total selon son coefficient.
    const totalCoefficients = matieres.reduce((total, matiere) => total + matiere.coefficient, 0);
    if (totalCoefficients === 0) return null;
    const totalPondere = matieres.reduce((total, matiere) => total + matiere.note * matiere.coefficient, 0);
    return totalPondere / totalCoefficients;
  }

  function noteNecessaire(matieres, cible, coefficientProchaineNote) {
    // On isole la prochaine note dans la formule de la moyenne cible.
    const totalCoefficients = matieres.reduce((total, matiere) => total + matiere.coefficient, 0);
    const totalPondere = matieres.reduce((total, matiere) => total + matiere.note * matiere.coefficient, 0);
    return (cible * (totalCoefficients + coefficientProchaineNote) - totalPondere) / coefficientProchaineNote;
  }

  const calculs = { moyennePonderee, noteNecessaire };
  if (typeof module !== 'undefined' && module.exports) module.exports = calculs;
  root.calculsMoyenne = calculs;
})(typeof globalThis === 'undefined' ? window : globalThis);

