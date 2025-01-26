const form = document.getElementById('loginForm');
const usernameField = document.getElementById('username');
const passwordField = document.getElementById('password');
const errorMsg = document.getElementById('errorMsg');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = usernameField.value;
  const password = passwordField.value;

  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();

  if (data.success) {
    // Redirect to dashboard
    window.location.href = '/dashboard.html';
  } else {
    errorMsg.style.display = 'block';
  }
});