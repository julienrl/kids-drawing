import { Circle, Rectangle, TextElement, Point, drawElements, populateTable} from "./shapes.js";

let elements = [];
let typeToRender = "All";
let compteur = parseInt(localStorage.getItem('compteur')) || 0;


function getElementById(elementId) {
    for (const element of elements) {
        if (element.getId() === elementId) {
            return element;
        }
    }
    return null;
}


function renderAndUpdate() {
    renderElements(); 
    updateTable();
}


function filterShapes(type) {
    typeToRender = type;
    renderAndUpdate();
}


function saveToLocalStorage() {
    const elementsToSave = elements.map(element => element.toObject());
    const elementsJson = JSON.stringify(elementsToSave);
    localStorage.setItem('drawingElements', elementsJson);
    localStorage.setItem('compteur', compteur); 
}


function loadFromLocalStorage() {
    const elementsJson = localStorage.getItem('drawingElements');
    if (elementsJson) {
        let loadedElements = JSON.parse(elementsJson);
        elements = loadedElements.map(el => el ? convertToObject(el) : null).filter(el => el);

        // Load le compteur avec le plus grand ID
        let maxId = 0;
        for (const element of elements) {
            if (element.getId() > maxId) {
                maxId = element.getId();
            }
        }
        compteur = maxId + 1;
    }
}


function clearLocalStorage() {
    localStorage.removeItem('drawingElements');
}


function convertToObject(element) {
    if (element.type === 'Circle') {
        const circle = new Circle(new Point(element.center.x, element.center.y), element.radius, element.id);
        circle.setColor(element.color);
        circle.setAlpha(element.alpha);
        return circle;

    } else if (element.type === 'Rectangle') {
        const rectangle = new Rectangle(new Point(element.center.x, element.center.y), element.width, element.height, element.id);
        rectangle.setColor(element.color);
        rectangle.setAlpha(element.alpha);
        return rectangle;

    } else if (element.type === 'TextElement') {
        const textElement = new TextElement(new Point(element.center.x, element.center.y), element.content, element.id, element.font, element.fontSize);
        textElement.setColor(element.color);
        textElement.setAlpha(element.alpha);
        return textElement;
    }
}


function addCircle() {
    const x = parseInt(document.getElementById("cx").value);
    const y = parseInt(document.getElementById("cy").value);
    const r = parseInt(document.getElementById("cr").value);

    if (isNaN(x) || isNaN(y) || isNaN(r) || r <= 0) {
        showPopup("Veuillez entrer des valeurs valides pour le cercle.");
        return;
    }

    const p = new Point(x, y);
    compteur++;
    const circle = new Circle(p, r, compteur);
    circle.setColor("000000");
    circle.setAlpha(1);

    elements.push(circle);
    renderAndUpdate();
    saveToLocalStorage();
}


function addRectangle() {
    const x = parseInt(document.getElementById("rx").value);
    const y = parseInt(document.getElementById("ry").value);
    const width = parseInt(document.getElementById("rw").value);
    const height = parseInt(document.getElementById("rh").value);

    if (isNaN(x) || isNaN(y) || isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
        showPopup("Veuillez entrer des valeurs valides pour le rectangle.");
        return;
    }
    
    const center = new Point(x, y);
    compteur++;
    const rectangle = new Rectangle(center, width, height, compteur);
    rectangle.setColor("000000");
    rectangle.setAlpha(1);

    elements.push(rectangle);
    renderAndUpdate();
    saveToLocalStorage();
}


function addText() {
    const x = parseInt(document.getElementById("tx").value);
    const y = parseInt(document.getElementById("ty").value);
    const content = document.getElementById("text-content").value;

    // Get font-family
    const fontSelect = document.getElementById("fonts");
    const font = fontSelect ? fontSelect.value : 'Arial';

    // Get font size
    const fontSizeInput = document.getElementById("font-size");
    const fontSize = fontSizeInput ? parseInt(fontSizeInput.value, 10) : 16;

    if (isNaN(x) || isNaN(y) || content === "") {
        showPopup("Veuillez entrer des valeurs valides pour le texte.");
        return;
    }

    const center = new Point(x, y);
    compteur++;
    const text = new TextElement(center, content, compteur, font, fontSize);

    text.setColor("000000");
    text.setAlpha(1);

    elements.push(text);
    renderAndUpdate();
    saveToLocalStorage();
}

/**
 * Button "Tout Effacer"
 */
function clearAll() {
    elements = [];
    compteur = 0;
    renderAndUpdate();
    clearLocalStorage();
}


function renderElements() {
    const svgCanvas = document.getElementById("canvas");
    drawElements(svgCanvas, elements, typeToRender );
}


function updateTable() {
    const tableBody = document.getElementById("table-body");
    populateTable(tableBody, elements, 
        onClickUp, 
        onClickDown, 
        onClickLeft, 
        onClickRight, 
        onClickPaint, 
        onClickDelete,
        onClickTransparent
    );
}

/**
 * Action buttons function for each elements
 * onClickUp, onClickDown, onClickLeft, onClickRight
 * onClickPaint, onClickDelete, onClickTransparent
 */

function moveElement(elementId, moveX, moveY) {
    const element = getElementById(elementId);
    if (!element) return;

    const center = element.getCenter();
    const newCenter = new Point(center.getX() + moveX, center.getY() + moveY);
    element.setCenter(newCenter);
    renderAndUpdate();
    saveToLocalStorage();
}

function onClickUp(elementId) {
    moveElement(elementId, 0, -10);
}

function onClickDown(elementId) {
    moveElement(elementId, 0, 10);
}

function onClickLeft(elementId) {
    moveElement(elementId, -10, 0);
}

function onClickRight(elementId) {
    moveElement(elementId, 10, 0);
}


function onClickPaint(elementId, color) {
    const element = getElementById(elementId);
    if (!element) return;

    element.setColor(color.substring(1));
    renderAndUpdate();
    saveToLocalStorage();
}


function onClickDelete(elementId) {
    const index = elements.findIndex(element => element.getId() === elementId);
    if (index !== -1) {
        elements.splice(index, 1);
    }
    renderAndUpdate();
    saveToLocalStorage();
}


function onClickTransparent(elementId, value) {
    const element = getElementById(elementId);
    if (!element) return;

    const newAlpha = value / 100;
    element.setAlpha(newAlpha);
    renderAndUpdate();
    saveToLocalStorage();
}

/**
 * Function to add delay between
 * new elements
 */
function debounce(func, wait) {
    let timeout;

    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };

// source : https://www.freecodecamp.org/news/javascript-debounce-example/
};

const debouncedAddCircle = debounce(addCircle, 500);
const debouncedAddRectangle = debounce(addRectangle, 500);
const debouncedAddText = debounce(addText, 500);

/**
 * Hide/unhide the popup
 */
function showPopup(message) {
    document.getElementById('popup-message').textContent = message;
    document.getElementById('popup').classList.remove('hidden');
    document.getElementById('main-content').classList.add('blur-effect');
}

function hidePopup() {
    document.getElementById('popup').classList.add('hidden');
    document.getElementById('main-content').classList.remove('blur-effect');
}


document.getElementById("add-circle").addEventListener("click", debouncedAddCircle);
document.getElementById("add-rectangle").addEventListener("click", debouncedAddRectangle);
document.getElementById("add-text").addEventListener("click", debouncedAddText);
document.getElementById("clear-drawing").addEventListener("click", clearAll);
document.getElementById('popup-ok').addEventListener('click', hidePopup);

document.getElementById("filterAllShapes").addEventListener("click", () => filterShapes("All"));
document.getElementById("filterCircle").addEventListener("click", () => filterShapes("Circles"));
document.getElementById("filterRectangle").addEventListener("click", () => filterShapes("Rectangles"));
document.getElementById("filterTextElement").addEventListener("click", () => filterShapes("Texts"));

loadFromLocalStorage();
renderAndUpdate();