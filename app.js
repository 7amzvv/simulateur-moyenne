const STORAGE_KEY = 'moyenne-claire-matieres-v1';

const elements = {
  average: document.querySelector('#average-value'),
  averageCaption: document.querySelector('#average-caption'),
  count: document.querySelector('#subject-count'),
  coefficientTotal: document.querySelector('#coefficient-total'),
  tableBody: document.querySelector('#subjects-body'),
  emptyState: document.querySelector('#empty-state'),
  formError: document.querySelector('#form-error'),
  dialog: document.querySelector('#subject-dialog'),
  subjectForm: document.querySelector('#subject-form'),
  dialogError: document.querySelector('#dialog-error'),
  result: document.querySelector('#simulation-result'),
};

let subjects = loadSubjects();

function loadSubjects() {
  try {
    const storedSubjects = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(storedSubjects)) return [];
    return storedSubjects.filter(subject =>
      typeof subject.id === 'string' && typeof subject.name === 'string' &&
      Number.isFinite(subject.grade) && subject.grade >= 0 && subject.grade <= 20 &&
      Number.isFinite(subject.coefficient) && subject.coefficient > 0,
    );
  } catch {
    return [];
  }
}

function saveSubjects() {
  // Le stockage est propre au navigateur utilisé pour cette page.
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
}

function formatNumber(value) {
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(value);
}

function weightedAverage(items = subjects) {
  return calculsMoyenne.moyennePonderee(items.map(subject => ({ note: subject.grade, coefficient: subject.coefficient })));
}

function render() {
  const average = weightedAverage();
  const coefficientTotal = subjects.reduce((sum, subject) => sum + subject.coefficient, 0);
  elements.average.textContent = average === null ? '—' : `${formatNumber(average)} / 20`;
  elements.averageCaption.textContent = average === null ? 'Ajoutez une matière pour commencer' : 'Calculée selon vos coefficients';
  elements.count.textContent = subjects.length;
  elements.coefficientTotal.textContent = formatNumber(coefficientTotal);
  elements.emptyState.hidden = subjects.length > 0;
  elements.tableBody.replaceChildren(...subjects.map(createSubjectRow));
}

function createSubjectRow(subject) {
  const row = document.createElement('tr');
  const name = document.createElement('td');
  const grade = document.createElement('td');
  const coefficient = document.createElement('td');
  const actions = document.createElement('td');
  name.textContent = subject.name;
  grade.textContent = `${formatNumber(subject.grade)} / 20`;
  coefficient.textContent = formatNumber(subject.coefficient);
  const edit = document.createElement('button');
  edit.type = 'button';
  edit.className = 'text-action';
  edit.textContent = 'Modifier';
  edit.setAttribute('aria-label', `Modifier ${subject.name}`);
  edit.addEventListener('click', () => openDialog(subject));
  const remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'text-action delete';
  remove.textContent = 'Supprimer';
  remove.setAttribute('aria-label', `Supprimer ${subject.name}`);
  remove.addEventListener('click', () => {
    subjects = subjects.filter(item => item.id !== subject.id);
    saveSubjects();
    render();
  });
  actions.append(edit, remove);
  row.append(name, grade, coefficient, actions);
  return row;
}

function showError(element, message) {
  element.textContent = message;
  element.hidden = false;
}

function clearError(element) {
  element.textContent = '';
  element.hidden = true;
}

function openDialog(subject = null) {
  clearError(elements.dialogError);
  elements.subjectForm.reset();
  document.querySelector('#subject-id').value = subject?.id || '';
  document.querySelector('#subject-name').value = subject?.name || '';
  document.querySelector('#subject-grade').value = subject?.grade ?? '';
  document.querySelector('#subject-coefficient').value = subject?.coefficient ?? 1;
  document.querySelector('#dialog-title').textContent = subject ? 'Modifier la matière' : 'Ajouter une matière';
  elements.dialog.showModal();
  document.querySelector('#subject-name').focus();
}

document.querySelector('#add-subject').addEventListener('click', () => openDialog());
document.querySelector('#empty-add').addEventListener('click', () => openDialog());
document.querySelector('#close-dialog').addEventListener('click', () => elements.dialog.close());
document.querySelector('#cancel-dialog').addEventListener('click', () => elements.dialog.close());

elements.subjectForm.addEventListener('submit', event => {
  event.preventDefault();
  clearError(elements.dialogError);
  const formData = new FormData(elements.subjectForm);
  const name = formData.get('name').trim();
  const grade = Number(formData.get('grade'));
  const coefficient = Number(formData.get('coefficient'));
  if (!name) return showError(elements.dialogError, 'Saisissez le nom de la matière.');
  if (formData.get('grade') === '' || !Number.isFinite(grade) || grade < 0 || grade > 20) {
    return showError(elements.dialogError, 'La note doit être comprise entre 0 et 20.');
  }
  if (formData.get('coefficient') === '' || !Number.isFinite(coefficient) || coefficient <= 0) {
    return showError(elements.dialogError, 'Le coefficient doit être supérieur à 0.');
  }
  const id = formData.get('id');
  const subject = { id: id || crypto.randomUUID(), name, grade, coefficient };
  subjects = id ? subjects.map(item => item.id === id ? subject : item) : [...subjects, subject];
  saveSubjects();
  render();
  elements.dialog.close();
  document.querySelector('#add-subject').focus();
});

document.querySelector('#simulation-form').addEventListener('submit', event => {
  event.preventDefault();
  const targetInput = document.querySelector('#target-average');
  const coefficientInput = document.querySelector('#next-coefficient');
  const target = Number(targetInput.value);
  const nextCoefficient = Number(coefficientInput.value);
  elements.result.hidden = false;
  elements.result.classList.remove('error');
  if (targetInput.value === '' || !Number.isFinite(target) || target < 0 || target > 20) {
    elements.result.textContent = 'Entrez une moyenne cible comprise entre 0 et 20.';
    elements.result.classList.add('error');
    return;
  }
  if (coefficientInput.value === '' || !Number.isFinite(nextCoefficient) || nextCoefficient <= 0) {
    elements.result.textContent = 'Le coefficient doit être supérieur à 0.';
    elements.result.classList.add('error');
    return;
  }
  const neededGrade = calculsMoyenne.noteNecessaire(subjects.map(subject => ({ note: subject.grade, coefficient: subject.coefficient })), target, nextCoefficient);
  if (neededGrade > 20) {
    elements.result.textContent = `Objectif impossible avec une note sur 20 : il faudrait ${formatNumber(neededGrade)} / 20.`;
    elements.result.classList.add('error');
  } else if (neededGrade <= 0) {
    elements.result.textContent = `Votre objectif est déjà atteint : toute note entre 0 et 20 le maintient (${formatNumber(neededGrade)} / 20 calculé).`;
  } else {
    elements.result.textContent = `Il vous faut au moins ${formatNumber(neededGrade)} / 20 à la prochaine évaluation.`;
  }
});

document.querySelector('#simulation-form').addEventListener('input', () => clearError(elements.formError));
render();

