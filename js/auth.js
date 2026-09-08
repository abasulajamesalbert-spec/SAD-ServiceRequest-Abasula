async function checkAuth() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session && !window.location.pathname.includes("login.html")) {
    window.location.href = "login.html";
  }
  return session;
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) alert("Login failed: " + error.message);
  else window.location.href = "index.html";
}

async function logout() {
  await supabaseClient.auth.signOut();
  window.location.href = "login.html";
}
