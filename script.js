// ============================================================
// Boo Doo — Shared Todo List
// Replace these with your Supabase project values (see SETUP.md)
// ============================================================

const SUPABASE_URL = 'https://pcujzyteqogxiedaxltg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjdWp6eXRlcW9neGllZGF4bHRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3Mjk4NTgsImV4cCI6MjA5MDMwNTg1OH0.bXA6VPIGt1umacMhrFDEH6b0kRoXZHoLD_ab_L-yCPo';

// ============================================================

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const listEl = document.getElementById('todo-list');
const formEl = document.getElementById('add-form');
const inputEl = document.getElementById('todo-input');

let currentTab = 'active';
let allTodos = [];

// --- Tab switching ---
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentTab = btn.dataset.tab;
    renderTodos();
  });
});

// --- Fetch all todos and render ---
async function loadTodos() {
  const { data, error } = await db
    .from('todos')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Failed to load todos:', error);
    return;
  }

  allTodos = data || [];
  renderTodos();
}

// --- Render filtered list ---
function renderTodos() {
  const filtered = allTodos.filter(t =>
    currentTab === 'active' ? !t.completed : t.completed
  );

  listEl.innerHTML = '';
  for (const todo of filtered) {
    listEl.appendChild(createTodoEl(todo));
  }
}

// --- Create a todo DOM element ---
function createTodoEl(todo) {
  const li = document.createElement('li');
  li.className = 'todo-item' + (todo.completed ? ' completed' : '');
  li.dataset.id = todo.id;

  // Checkbox
  const check = document.createElement('div');
  check.className = 'check';
  check.setAttribute('role', 'checkbox');
  check.setAttribute('aria-checked', todo.completed);
  check.setAttribute('tabindex', '0');
  check.addEventListener('click', () => toggleTodo(todo.id, !todo.completed));
  check.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleTodo(todo.id, !todo.completed);
    }
  });

  // Text + optional date
  const textWrap = document.createElement('div');
  textWrap.style.flex = '1';
  textWrap.style.minWidth = '0';

  const text = document.createElement('span');
  text.className = 'text';
  text.textContent = todo.text;
  textWrap.appendChild(text);

  if (todo.completed && todo.completed_at) {
    const dateEl = document.createElement('div');
    dateEl.className = 'completed-date';
    dateEl.textContent = formatDate(todo.completed_at);
    textWrap.appendChild(dateEl);
  }

  // Delete button
  const del = document.createElement('button');
  del.className = 'delete';
  del.setAttribute('aria-label', 'Delete task');
  del.innerHTML = '&times;';
  del.addEventListener('click', () => deleteTodo(todo.id));

  li.appendChild(check);
  li.appendChild(textWrap);
  li.appendChild(del);

  return li;
}

// --- Format date nicely ---
function formatDate(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now - d) / 86400000);

  const time = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  if (diffDays === 0) return 'Today ' + time;
  if (diffDays === 1) return 'Yesterday ' + time;
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + time;
}

// --- Add a new todo ---
formEl.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = inputEl.value.trim();
  if (!text) return;

  inputEl.value = '';
  inputEl.focus();

  const { error } = await db
    .from('todos')
    .insert({ text });

  if (error) console.error('Failed to add todo:', error);
});

// --- Toggle completed ---
async function toggleTodo(id, completed) {
  const updates = { completed };
  if (completed) {
    updates.completed_at = new Date().toISOString();
  } else {
    updates.completed_at = null;
  }

  const { error } = await db
    .from('todos')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Failed to update todo:', error);
    return;
  }

  // Celebrate on completion
  if (completed) {
    celebrate();
  }
}

// --- Delete a todo ---
async function deleteTodo(id) {
  const { error } = await db
    .from('todos')
    .delete()
    .eq('id', id);

  if (error) console.error('Failed to delete todo:', error);
}

// --- Celebration ---
const CHEERS = [
  "Go you!", "You did it!", "Nice work!", "Crushed it!",
  "Heck yeah!", "One down!", "BOOM!", "Awesome!",
  "Nailed it!", "Get it!", "So good!", "YESSS!"
];

function celebrate() {
  // Popup
  const el = document.createElement('div');
  el.className = 'celebration';
  el.textContent = CHEERS[Math.floor(Math.random() * CHEERS.length)];
  document.body.appendChild(el);
  el.addEventListener('animationend', () => el.remove());

  // Confetti bits
  const colors = ['#6b8f71', '#c97c7c', '#d4a574', '#7c9ec9', '#c9a87c', '#a07cc9'];
  for (let i = 0; i < 16; i++) {
    const bit = document.createElement('div');
    bit.className = 'confetti';
    bit.style.background = colors[Math.floor(Math.random() * colors.length)];
    const angle = (Math.PI * 2 * i) / 16 + (Math.random() - 0.5) * 0.5;
    const dist = 80 + Math.random() * 120;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;
    bit.style.setProperty('--dx', dx + 'px');
    bit.style.setProperty('--dy', dy + 'px');
    bit.animate([
      { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
      { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.3)`, opacity: 0 }
    ], { duration: 900 + Math.random() * 400, easing: 'cubic-bezier(.2,.8,.3,1)' });
    document.body.appendChild(bit);
    setTimeout(() => bit.remove(), 1400);
  }
}

// --- Real-time subscription ---
db
  .channel('todos-realtime')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'todos' },
    () => { loadTodos(); }
  )
  .subscribe();

// --- Initial load ---
loadTodos();

// --- Register service worker ---
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
