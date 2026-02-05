const year = document.getElementById('year');
if (year) {
  year.textContent = new Date().getFullYear();
}

const mobileToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

mobileToggle?.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  mobileToggle.setAttribute('aria-expanded', String(isOpen));
});

mobileMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    mobileToggle.setAttribute('aria-expanded', 'false');
  });
});

const editableEls = Array.from(document.querySelectorAll('[data-editable]'));
const toggleEdit = document.getElementById('toggleEdit');
const saveEdits = document.getElementById('saveEdits');
const resetEdits = document.getElementById('resetEdits');

const pageKey = window.location.pathname.replace('/', '') || 'index';
const STORAGE_KEY = `maestranza-editable-content:${pageKey}`;

const defaults = editableEls.reduce((acc, el) => {
  acc[el.dataset.editable] = el.innerHTML.trim();
  return acc;
}, {});

const applyStoredContent = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return;
  const parsed = JSON.parse(stored);
  editableEls.forEach(el => {
    const key = el.dataset.editable;
    if (parsed[key]) {
      el.innerHTML = parsed[key];
    }
  });
};

applyStoredContent();

let isEditing = false;

const setEditing = (value) => {
  isEditing = value;
  editableEls.forEach(el => {
    el.contentEditable = String(value);
    el.classList.toggle('is-editing', value);
    el.classList.add('editable');
  });
  if (toggleEdit) {
    toggleEdit.textContent = value ? 'Desactivar edición' : 'Activar edición';
  }
};

if (toggleEdit) {
  toggleEdit.addEventListener('click', () => {
    setEditing(!isEditing);
  });
}

if (saveEdits) {
  saveEdits.addEventListener('click', () => {
    const payload = editableEls.reduce((acc, el) => {
      acc[el.dataset.editable] = el.innerHTML.trim();
      return acc;
    }, {});
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    setEditing(false);
    alert('Cambios guardados en este navegador.');
  });
}

if (resetEdits) {
  resetEdits.addEventListener('click', () => {
    editableEls.forEach(el => {
      el.innerHTML = defaults[el.dataset.editable] || '';
    });
    localStorage.removeItem(STORAGE_KEY);
    setEditing(false);
    alert('Contenido restaurado.');
  });
}

const navLinks = document.querySelectorAll('nav a[data-page]');
const currentPage = pageKey.replace('.html', '') || 'index';
navLinks.forEach(link => {
  if (link.dataset.page === currentPage) {
    link.classList.add('active');
  }
});
