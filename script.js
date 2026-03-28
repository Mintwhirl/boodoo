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

  listEl.innerHTML = '';
  for (const todo of data) {
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

  // Text
  const text = document.createElement('span');
  text.className = 'text';
  text.textContent = todo.text;

  // Delete button
  const del = document.createElement('button');
  del.className = 'delete';
  del.setAttribute('aria-label', 'Delete task');
  del.innerHTML = '&times;';
  del.addEventListener('click', () => deleteTodo(todo.id));

  li.appendChild(check);
  li.appendChild(text);
  li.appendChild(del);

  return li;
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
  const { error } = await db
    .from('todos')
    .update({ completed })
    .eq('id', id);

  if (error) console.error('Failed to update todo:', error);
}

// --- Delete a todo ---
async function deleteTodo(id) {
  const { error } = await db
    .from('todos')
    .delete()
    .eq('id', id);

  if (error) console.error('Failed to delete todo:', error);
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
