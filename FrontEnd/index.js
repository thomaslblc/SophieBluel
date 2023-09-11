let works = [];
const divGallery = document.querySelector(".gallery");
const modal = document.querySelector(".containerModal");

/** Fonction pour créer les balises qui accueilleront les works */

function createWorkDOM(work, container, isModal = false) {
  const figureElement = document.createElement("div");
  const imageElement = document.createElement("img");
  imageElement.src = work.imageUrl;
  imageElement.alt = work.title;
  const captionElement = document.createElement("p");
  container.appendChild(figureElement);
  figureElement.appendChild(imageElement);
  figureElement.appendChild(captionElement);
  
  if (!isModal) {
    captionElement.innerText = work.title;
    figureElement.dataset.workid = work.id;
  } else {
    captionElement.innerText = "éditer";

    /** Supprimer un work de la database */

    const trashIcon = document.createElement("i");
    trashIcon.classList.add("fa-solid", "fa-trash-can");
    figureElement.appendChild(trashIcon);
    trashIcon.addEventListener("click", () => {
      fetch("http://localhost:5678/api/works/" + work.id, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("authToken"),
        },
      });

      figureElement.remove();
      document.querySelector("figure[data-workid='" + work.id + "']").remove();
    });
  }
}

/** Récupération des works et injection dans le DOM */

fetch("http://localhost:5678/api/works")
  .then((data) => data.json())
  .then((data) => {
    works = data;
    divGallery.innerHTML = "";

    for (let work of works) {
      createWorkDOM(work, divGallery);
      createWorkDOM(work, modal, true);
    }
  });

/** Filtrage des works selon leur catégorie */

const filtersButtons = document.querySelectorAll(".filter");
function resetClassButton() {
  for (let filterButton of filtersButtons) {
    filterButton.classList.remove("filterclicked");
  }
}
for (let button of filtersButtons) {
  button.addEventListener("click", (e) => {
    const filteredWorks = works.filter((work) => {
      if (e.target.innerText == "Tous") {
        return true;
      } else if (work.category.name === e.target.innerText) {
        return true;
      }
      return false;
    });
    divGallery.innerHTML = "";

    for (let work of filteredWorks) {
      createWorkDOM(work, divGallery);
    }
    resetClassButton();

    e.target.classList.add("filterclicked");
  });
}
/** Vérifier si le token est stocké */

const isTokenStored = localStorage.getItem("authToken") !== "";

if (localStorage.getItem("authToken")) {
  console.log("Le token est stocké en local");
} else {
  console.log("Le token n'est pas stocké en local");
}
/** Si il est stocké, afficher/cacher ce qui change dans la page d'accueil */

if (localStorage.getItem("authToken")) {
  const editor_mode = document.getElementById("editor_mode");
  editor_mode.classList.remove("hidden");
  editor_mode.classList.add("shown");
  const modify_bio = document.getElementById("modify_bio");
  modify_bio.classList.remove("hidden");
  modify_bio.classList.add("shown");
  const modify_projects = document.getElementById("modify_projects");
  modify_projects.classList.remove("hidden");
  modify_projects.classList.add("shown");
  const filters = document.getElementById("filters");
  filters.classList.add("hidden");
  const login_topmenu = document.getElementById("login");
  login_topmenu.classList.add("hidden");
  const logout_topmenu = document.getElementById("logout");
  logout_topmenu.classList.remove("hidden");
  logout_topmenu.classList.add("shown");
}
/** Déconnexion */

const logout_btn = document.getElementById("logout");
logout_btn.addEventListener("click", function (e) {
  e.preventDefault();
  localStorage.removeItem("authToken");
  window.location.href = "login.html";
});

/** Ouverture/Fermeture/Retour Modale */

const popup = document.querySelector(".popup");
const popup_content = document.querySelector(".popup_content");
const popup_btn = document.querySelector("#modify_projects");
const popup_close = document.querySelectorAll(".popup_close");
const popup_addWork_btn = document.querySelector(".addphoto");
const popup_addWork = document.querySelector(".popup_addWork");

const openPopup = function () {
  popup.classList.remove("hidden");
  popup_content.classList.remove("hidden");
};

popup_btn.addEventListener("click", openPopup);

const closePopup = function () {
  popup.classList.add("hidden");
  popup_content.classList.add("hidden");
  popup_addWork.classList.add("hidden");
};
for (let close_Mark of popup_close) {
  close_Mark.addEventListener("click", closePopup);
}

const modalReturn = function () {
  popup_addWork.classList.add("hidden");
  popup_content.classList.remove("hidden");
};

const popup_Return = document.querySelector(".popup_return");

popup_Return.addEventListener("click", modalReturn);

/** Modale AddWorks */

const openAddWork = function () {
  popup_content.classList.add("hidden");
  popup_addWork.classList.remove("hidden");
};

popup_addWork_btn.addEventListener("click", openAddWork);

popup.addEventListener("click", function (event) {
  const isClickInside =
    popup_content.contains(event.target) + popup_addWork.contains(event.target);
  if (isClickInside) {
  } else {
    popup.classList.add("hidden");
    popup_addWork.classList.add("hidden");
  }
});

/** Ajout de l'image en prévisualisation */

const addWork_input = document.querySelector(".addWork_add");
const addWork_preview = document.querySelector(".addWork_preview");
const addWork_icon = document.querySelector(".fa-image");
const addWork_label = document.querySelector('label[for="addWork_input"]');
const addWork_p = document.querySelector(".addWork_p");

addWork_input.addEventListener("change", function () {
  const imageFile = addWork_input.files[0];

  if (typeof imageFile !== "undefined" && imageFile !== "") {
    const readerImage = new FileReader();
    readerImage.addEventListener(
      "load",
      function () {
        addWork_preview.src = readerImage.result;
      },
      false
    );
    readerImage.readAsDataURL(imageFile);
    addWork_Verification();
    addWork_input.classList.add("hidden");
    addWork_icon.classList.add("hidden");
    addWork_label.classList.add("hidden");
    addWork_p.classList.add("hidden");
  }
});

/** Vérifier que tous les champs sont remplis pour pouvoir ajouter le work */

const addWork_text = document.querySelector(".addWork_text");
const addWork_category = document.querySelector("#addWork_category");
const validation_btn = document.querySelector(".popup_addWork_validation");
const addWork_error = document.querySelector(".addWork_error");

function addWork_Verification() {
  let error = 0;
  if (
    addWork_input.files.length < 1 ||
    addWork_input.files[0] == "undefined" ||
    addWork_input.files[0] == ""
  ) {
    error++;
  }
  if (addWork_text.value == "") {
    error++;
  }
  if (addWork_category.value == "") {
    error++;
  }
  if (error === 0) {
    validation_btn.removeAttribute("disabled");
    addWork_error.classList.add("hidden");
  } else {
    validation_btn.setAttribute("disabled", "");
    addWork_error.classList.remove("hidden");
  }
}

/** Fetch pour ajouter le work */

addWork_category.addEventListener("change", addWork_Verification);
addWork_text.addEventListener("change", addWork_Verification);

validation_btn.addEventListener("click", function (e) {
  e.preventDefault();
  const data = new FormData();
  data.append("title", addWork_text.value);
  data.append("category", addWork_category.value);
  data.append("image", addWork_input.files[0]);

  fetch("http://localhost:5678/api/works/", {
    method: "POST",
    headers: { Authorization: "Bearer " + localStorage.getItem("authToken") },
    body: data,
  })
    .then((response) => {
      return response.json();
    })
    .then((work) => {
      createWorkDOM(work, divGallery);
      createWorkDOM(work, modal, true);
      popup.classList.add("hidden");
      popup_addWork.classList.add("hidden");
      addWork_input.value = "";
      addWork_text.value = "";
      addWork_category.value = "";
      addWork_preview.src = "";
      addWork_input.classList.remove("hidden");
      addWork_icon.classList.remove("hidden");
      addWork_label.classList.remove("hidden");
      addWork_p.classList.remove("hidden");
      addWork_Verification();
    });
});
