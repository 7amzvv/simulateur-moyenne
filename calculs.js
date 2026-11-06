(function (root) {
  function moyennePonderee(matieres) {
    const totalCoefficients = matieres.reduce((total, matiere) => total + matiere.coefficient, 0);
    if (totalCoefficients === 0) return null;
    const totalPondere = matieres.reduce((total, matiere) => total + matiere.note * matiere.coefficient, 0);
    return totalPondere / totalCoefficients;
  }

  function noteNecessaire(matieres, cible, coefficientProchaineNote) {
    const totalCoefficients = matieres.reduce((total, matiere) => total + matiere.coefficient, 0);
    const totalPondere = matieres.reduce((total, matiere) => total + matiere.note * matiere.coefficient, 0);
    return (cible * (totalCoefficients + coefficientProchaineNote) - totalPondere) / coefficientProchaineNote;
  }

  const calculs = { moyennePonderee, noteNecessaire };
  if (typeof module !== 'undefined' && module.exports) module.exports = calculs;
  root.calculsMoyenne = calculs;
})(typeof globalThis === 'undefined' ? window : globalThis);
