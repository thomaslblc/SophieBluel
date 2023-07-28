let works = []
const divGallery = document.querySelector(".gallery")
const modal = document.querySelector(".containerModal")
function createWorkDOM(work, container, isModal = false) {
    const figureElement = document.createElement("figure");
    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    const captionElement = document.createElement("figcaption");
    if (!isModal) {
        captionElement.innerText = work.title;
    } else {
        captionElement.innerText = 'éditer'
        const trashIcon = document.createElement("i")
        trashIcon.classList.add("fa-solid", "fa-trash")
        figureElement.appendChild(trashIcon)
        trashIcon.addEventListener("click", () => {
            fetch("http://localhost:5678/api/works/" + work.id, {
                method: 'DELETE',
                headers: { Authorization: 'Bearer ' + localStorage.getItem('authToken') }

            })
                .then((response) => {
                    console.log(response)
                })
        })
    }

    container.appendChild(figureElement);
    figureElement.appendChild(imageElement);
    figureElement.appendChild(captionElement);
}
fetch("http://localhost:5678/api/works").then((data) => data.json()).then((data) => {
    works = data
    divGallery.innerHTML = "";

    for (let work of works) {
        createWorkDOM(work, divGallery)
        createWorkDOM(work, modal, true)
    }
})
const filtersButtons = document.querySelectorAll(".filter")
function resetClassButton() {
    for (let filterButton of filtersButtons) {
        filterButton.classList.remove("filterclicked")
    }
}

for (let button of filtersButtons) {
    button.addEventListener("click", (e) => {
        const filteredWorks = works.filter((work) => {
            if (e.target.innerText == "Tous") {
                return true
            }
            else if (work.category.name === e.target.innerText) {
                return true
            }
            return false
        })
        divGallery.innerHTML = "";

        for (let work of filteredWorks) {
            createWorkDOM(work)
        }
        resetClassButton()

        e.target.classList.add("filterclicked")
    });
}

/** Vérifier si le token est stocké */
const isTokenStored = localStorage.getItem('authToken') !== "";
console.log(localStorage.getItem('authToken'))

if (localStorage.getItem('authToken')) {
    console.log('Le token est stocké en local');
} else {
    console.log('Le token n\'est pas stocké en local');
}
/** Si il est stocké, afficher/cacher ce qui change dans la page d'accueil */
if (localStorage.getItem('authToken')) {
    const editor_mode = document.getElementById('editor_mode');
    editor_mode.classList.remove('hidden');
    editor_mode.classList.add('shown');
    const modify_bio = document.getElementById('modify_bio');
    modify_bio.classList.remove('hidden');
    modify_bio.classList.add('shown');
    const modify_projects = document.getElementById('modify_projects');
    modify_projects.classList.remove('hidden');
    modify_projects.classList.add('shown');
    const filters = document.getElementById('filters');
    filters.classList.add('hidden');
}
/** Modale */
const popup = document.querySelector(".popup");
const popup_content = document.querySelector(".popup_content");
const popup_btn = document.querySelector("#modify_projects");
const popup_close = document.querySelector(".popup_close");

const openPopup = function () {
    popup.classList.remove("hidden");
    popup_content.classList.remove("hidden");
}

popup_btn.addEventListener("click", openPopup);

const closePopup = function () {
    popup.classList.add("hidden");
    popup_content.classList.add("hidden");
}

popup_close.addEventListener("click", closePopup);

popup.addEventListener("click", function (event) {
    const isClickInside = popup_content.contains(event.target);
    if (isClickInside) {

    } else {
        popup.classList.add("hidden");
    }
})