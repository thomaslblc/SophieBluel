const form = document.getElementById("loginForm");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const submitButton = document.getElementById("submitButton");
const errorContainer = document.getElementById("errorContainer");

submitButton.addEventListener("click", (event) => {
  event.preventDefault();
  const emailValue = emailInput.value;
  const passwordValue = passwordInput.value;

  if (emailValue === "" || !isValidEmail(emailValue) || passwordValue === "") {
    errorContainer.textContent = "Veuillez remplir les champs correctement.";
  } else {
    let user = {
      email: emailValue,
      password: passwordValue,
    };
    fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(user),
    })
      .then((data) => {
        if (data.status == 401) {
          throw new Error("Mot de passe incorrect.");
        }
        if (data.status == 404) {
          throw new Error("Utilisateur inconnu.");
        }
        return data.json();
      })
      .then((data) => {
        localStorage.setItem("authToken", data.token);
        window.location.href = "index.html";
      })
      .catch((error) => {
        errorContainer.textContent = error;
      });
  }
});

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
