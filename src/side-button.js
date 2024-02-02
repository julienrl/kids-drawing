/**
 * 
 * Toggle pour les bouttons du sidebar
 * Ouvre une side panel
 */

function togglePanel(panelToToggle, allPanels) {
    allPanels.forEach(panel => {
        if (panel !== panelToToggle) panel.classList.add('-translate-x-full');
    });
    panelToToggle.classList.toggle('-translate-x-full');
}


function setupButtonListener(buttonId, panel, allPanels) {
    const button = document.querySelector(buttonId);
    if (button) {
        button.addEventListener('click', () => togglePanel(panel, allPanels));
    } else {
        console.error(`${buttonId} not found.`);
    }
}


document.addEventListener('DOMContentLoaded', function () {
    const panels = {
        circle: document.querySelector('#circleOptionsPanel'),
        rectangle: document.querySelector('#rectangleOptionsPanel'),
        text: document.querySelector('#textOptionsPanel')
    };
    const allPanels = Object.values(panels);

    setupButtonListener('#circleButton', panels.circle, allPanels);
    setupButtonListener('#rectangleButton', panels.rectangle, allPanels);
    setupButtonListener('#textButton', panels.text, allPanels);
    setupButtonListener('#add-circle', panels.circle, allPanels);
    setupButtonListener('#add-rectangle', panels.rectangle, allPanels);
    setupButtonListener('#add-text', panels.text, allPanels);
    setupButtonListener('#closeCirclePanel', panels.circle, allPanels);
    setupButtonListener('#closeRectanglePanel', panels.rectangle, allPanels);
    setupButtonListener('#closeTextPanel', panels.text, allPanels);
});

// Filtre 
const filterButtons = document.querySelectorAll(".color-button");
filterButtons.forEach(button => {
    button.addEventListener("click", function() { 
        filterButtons.forEach(btn => {btn.classList.remove("clicked"); 
        });
        this.classList.add("clicked");
    });
});