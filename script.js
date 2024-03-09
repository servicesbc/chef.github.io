const API_URL = 'https://www.themealdb.com/api/json/v1/1/';

async function fetchAllRecipes() {
    try {
        const response = await fetch(API_URL + 'search.php?f=a');
        const data = await response.json();
        return data.meals;
    } catch (error) {
        console.error('Error fetching recipes:', error);
    }
}

async function displayAllRecipes() {
    const recipes = await fetchAllRecipes();
    displayRecipes(recipes);
}

function displayRecipes(recipes) {
    const recipeList = document.getElementById('recipe-list');
    recipeList.innerHTML = '';

    if (!recipes || recipes.length === 0) {
        const notFoundItem = document.createElement('li');
        notFoundItem.classList.add('not-found');
        notFoundItem.textContent = 'Not Found';
        recipeList.appendChild(notFoundItem);
        return;
    }

    recipes.forEach(recipe => {
        const listItem = document.createElement('li');
        listItem.classList.add('recipe');
        listItem.innerHTML = `
            <h2>${recipe.strMeal}</h2>
            <img src="${recipe.strMealThumb + '/preview'}" alt="${recipe.strMeal} Image">
            <button onclick="openModal('${recipe.idMeal}')" class="btn btn-primary btn-sm view-recipe-btn">View Recipe</button>
        `;
        recipeList.appendChild(listItem);
    });
}

async function searchRecipes() {
    const searchInput = document.getElementById('search-input').value;
    try {
        const response = await fetch(API_URL + 'search.php?s=' + searchInput);
        const data = await response.json();
        if (data.meals) {
            displayRecipes(data.meals);
        } else {
            console.error('No meals found for search query:', searchInput);
        }
    } catch (error) {
        console.error('Error searching recipes:', error);
    }
}

async function filterByLetter(letter) {
    try {
        const response = await fetch(API_URL + 'search.php?f=' + letter);
        const data = await response.json();
        if (data.meals) {
            displayRecipes(data.meals);
        } else {
            console.error('No meals found for letter:', letter);
            const recipeList = document.getElementById('recipe-list');
            recipeList.innerHTML = ''; // Limpiar la lista si no hay recetas
            const notFoundItem = document.createElement('li');
            notFoundItem.classList.add('not-found');
            notFoundItem.textContent = 'Not Found';
            recipeList.appendChild(notFoundItem);
        }
    } catch (error) {
        console.error('Error filtering recipes by letter:', error);
    }
}

// Función para abrir el modal con los detalles de la receta
async function openModal(recipeId) {
    const modal = document.getElementById('recipe-modal');
    const modalContent = document.getElementById('recipe-content');
    try {
        const response = await fetch(API_URL + 'lookup.php?i=' + recipeId);
        const data = await response.json();
        if (data.meals && data.meals.length > 0) {
            const recipe = data.meals[0];
            modalContent.innerHTML = `
                <h2>${recipe.strMeal}</h2>
                <img src="${recipe.strMealThumb + '/preview'}" alt="${recipe.strMeal} Image">
                <p><strong>Category:</strong> ${recipe.strCategory}</p>
                <p><strong>Area:</strong> ${recipe.strArea}</p>
                <p><strong>Ingredients:</strong></p>
                <ul>
                    ${getIngredientsList(recipe)}
                </ul>
                <p><strong>Instructions:</strong></p>
                <ol>
                    ${getInstructionsList(recipe)}
                </ol>
            `;
            modal.style.display = 'block';
        } else {
            console.error('No meal found with ID:', recipeId);
        }
    } catch (error) {
        console.error('Error fetching recipe details:', error);
    }
}

function closeModal() {
    const modal = document.getElementById('recipe-modal');
    modal.style.display = 'none';
}

function getIngredientsList(recipe) {
    let ingredientsList = '';
    for (let i = 1; i <= 20; i++) { // Máximo 20 ingredientes
        const ingredient = recipe['strIngredient' + i];
        const measure = recipe['strMeasure' + i];
        if (ingredient && ingredient.trim() !== '') {
            ingredientsList += `<li>${measure} ${ingredient}</li>`;
        }
    }
    return ingredientsList;
}

function getInstructionsList(recipe) {
    const instructions = recipe.strInstructions.split('\r\n');
    let instructionsList = '';
    instructions.forEach(instruction => {
        if (instruction.trim() !== '') {
            instructionsList += `<li>${instruction}</li>`;
        }
    });
    return instructionsList;
}

function updateTime() {
    const currentTimeElement = document.getElementById('current-time');
    setInterval(() => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        currentTimeElement.textContent = `${hours}:${minutes}`;
    }, 1000);
}

window.onload = async function() {
    displayAllRecipes();
    updateTime(); 
};


