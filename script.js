"use strict";

// Generate and append card elements based on data.json
const generateCard = (data) => {
  const cardContainer = document.querySelector("#card-container");
  const fragment = document.createDocumentFragment();

  // Iterate over the data to create individual card elements
  data.forEach((card) => {
    const cardElement = document.createElement("div");

    cardElement.className = "card";
    cardElement.innerHTML = `
        <div class="card-feature-content">
          <h2>${card.heading}</h2>
          <p>${card.description}</p>
        </div>
        <div class="card-feature-img">
          <img src="${card.image}" alt="${card.alt}" />
        </div>
      `;
    fragment.appendChild(cardElement);
  });

  cardContainer.appendChild(fragment);
};

// Generate and append tab elements based on data.json
const generateTab = (data) => {
  const tabContainer = document.querySelector("#tab-container");
  const fragment = document.createDocumentFragment();

  data.forEach((tab, index) => {
    const tabElement = document.createElement("button");

    tabElement.className = "tab";
    tabElement.textContent = tab.heading;
    tabElement.setAttribute("role", "tab");
    tabElement.setAttribute("aria-controls", `card-${index}`);
    tabElement.setAttribute("id", `tab-${index}`);
    tabElement.addEventListener("click", () => {
      setActiveTab(index);
      showCard(index);
    });

    // Add keyboard navigation for tabs
    tabElement.addEventListener("keydown", (event) => {
      if (event.key === "ArrowUp") {
        const nextIndex = (index - 1 + data.length) % data.length;
        document.querySelector(`#tab-${nextIndex}`).focus();
      } else if (event.key === "ArrowDown") {
        const prevIndex = (index + 1) % data.length;
        document.querySelector(`#tab-${prevIndex}`).focus();
      }
    });
    fragment.appendChild(tabElement);
  });

  tabContainer.appendChild(fragment);
};

// Fetch data and initialise the tabs and cards
const getData = async () => {
  const url = "data.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    generateTab(json);
    generateCard(json);
    setActiveTab(0);
    showCard(0);
  } catch (error) {
    console.log("Error fetching data:", error.message);
  }
};

// Set the active tab
const setActiveTab = (index) => {
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab, i) => {
    tab.classList.toggle("active", i === index);
    tab.setAttribute("aria-selected", i === index);
  });
};

// Show the card corresponding to the active tab
const showCard = (index) => {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card, i) => {
    card.classList.toggle("active", i === index);
    card.setAttribute("aria-hidden", i !== index);
  });
};

document.addEventListener("DOMContentLoaded", getData);
