import m from "https://esm.sh/mithril@2.2.2";

const BLACK = "rgba(0, 0, 0, 1)";

export class Point{
    #x;
    #y;
    constructor(x, y) {
        this.#x = x;
        this.#y = y;
    }
    getX(){
        return this.#x;
    }

    getY(){
        return this.#y;
    }
}


export class Circle{
    #alpha = 1;
    #center;
    #radius;
    #color;
    #id;

    constructor(center, radius, id) {
        this.#center = center;
        this.#radius = radius;
        this.#color = BLACK;
        this.#id = id;
    }

    getCenter(){
        return this.#center;
    }

    getRadius(){
        return this.#radius;
    }

    setColor(color) {
        this.#color = color;
    }
    
    setAlpha(alpha) {
        this.#alpha = alpha;
    }

    getAlpha() {
        return this.#alpha;
    } 

    getColor() {
        if (this.#color.length === 6) { // HEX
            const r = parseInt(this.#color.substring(0,2), 16);
            const g = parseInt(this.#color.substring(2,4), 16);
            const b = parseInt(this.#color.substring(4,6), 16);
            return `rgba(${r}, ${g}, ${b}, ${this.#alpha})`;
        }
        return this.#color;
    }

    setCenter(center){
        this.#center = center;
    }

    getId(){
        return this.#id;
    }

    toString(){
        return `Cercle (${ this.getCenter().getX() }, ${ this.getCenter().getY() }, ${ this.#radius })`;
    }

    toObject() {
        return {
            type: 'Circle',
            center: { x: this.#center.getX(), y: this.#center.getY() },
            radius: this.#radius,
            color: this.#color,
            alpha: this.#alpha,
            id: this.#id
        };
    }
}


export class Rectangle {
    #alpha = 1;
    #center;
    #width;
    #height;
    #color;
    #id;

    constructor(center, width, height, id) {
        this.#center = center;
        this.#width = width;
        this.#height = height;
        this.#color = BLACK;
        this.#id = id;
    }

    getCenter(){
        return this.#center;
    }

    getWidth(){
        return this.#width;
    }

    getHeight(){
        return this.#height;
    }

    setColor(color) {
        this.#color = color;
    }

    setAlpha(alpha) {
        this.#alpha = alpha;
    }

    getAlpha() {
        return this.#alpha;
    } 

    getColor() {
        if (this.#color.length === 6) { // HEX
            const r = parseInt(this.#color.substring(0,2), 16);
            const g = parseInt(this.#color.substring(2,4), 16);
            const b = parseInt(this.#color.substring(4,6), 16);
            return `rgba(${r}, ${g}, ${b}, ${this.#alpha})`;
        }
        return this.#color;
    }

    getId(){
        return this.#id;
    }

    setCenter(center) {
        this.#center = center;
    }

    getUpperLeftCorner() {
        const upperLeftX = this.#center.getX() - this.#width / 2;
        const upperLeftY = this.#center.getY() - this.#height / 2;
        return new Point(upperLeftX, upperLeftY);
    }

    toString() {
        const upperLeft = this.getUpperLeftCorner();
        return `Rectangle (${this.#center.getX()}, ${this.#center.getY()}, ${this.#width}, ${this.#height})`;
    }

    toObject() {
        return {
            type: 'Rectangle',
            center: { x: this.#center.getX(), y: this.#center.getY() },
            width: this.#width,
            height: this.#height,
            color: this.#color,
            alpha: this.#alpha,
            id: this.#id
        };
    }
}


export class TextElement {
    #alpha = 1;
    #center;
    #content;
    #color;
    #id;
    #font;
    #fontSize;

    constructor(center, content, id, font = 'Arial', fontSize = 16) {
        this.#center = center;
        this.#content = content;
        this.#color = BLACK;
        this.#id = id;
        this.#font = font;
        this.#fontSize = fontSize;
    }

    getCenter(){
        return this.#center;
    }

    getContent(){
        return this.#content;
    }

    setColor(color) {
        this.#color = color;
    }

    setAlpha(alpha) {
        this.#alpha = alpha;
    }

    getAlpha() {
        return this.#alpha;
    }    

    getColor() {
        if (this.#color.length === 6) { // HEX
            const r = parseInt(this.#color.substring(0,2), 16);
            const g = parseInt(this.#color.substring(2,4), 16);
            const b = parseInt(this.#color.substring(4,6), 16);
            return `rgba(${r}, ${g}, ${b}, ${this.#alpha})`;
        }
        return this.#color;
    }

    setFont(font) {
        this.#font = font;
    }

    getFont() {
        return this.#font;
    }

    setFontSize(fontSize) {
        this.#fontSize = fontSize;
    }

    getFontSize() {
        return this.#fontSize;
    }

    getId(){
        return this.#id;
    }

    setCenter(center) {
        this.#center = center;
    }

    toString() {
        return `Texte 
                (${ this.getCenter().getX() }, ${ this.getCenter().getY() }, ${this.#content})`;
    }

    toObject() {
        return {
            type: 'TextElement',
            center: { x: this.#center.getX(), y: this.#center.getY() },
            content: this.#content,
            font: this.#font,
            fontSize: this.#fontSize,
            color: this.#color,
            alpha: this.#alpha,
            id: this.#id
        };
    }
}


export function drawElements(node, elements, filter) {
    let svgElements = [];
    for (const element of elements) {
        if (element instanceof Circle && (filter === "All" || filter === "Circles")) {
            svgElements.push(m("circle", {
                cx: element.getCenter().getX(),
                cy: element.getCenter().getY(),
                r: element.getRadius(),
                fill: element.getColor(),
            }));
        } else if (element instanceof Rectangle && (filter === "All" || filter === "Rectangles")) {
            const center = element.getCenter();
            svgElements.push(m("rect", {
                x: center.getX() - element.getWidth() / 2,
                y: center.getY() - element.getHeight() / 2,
                width: element.getWidth(),
                height: element.getHeight(),
                fill: element.getColor(),
            }));
        } else if (element instanceof TextElement && (filter === "All" || filter === "Texts")) {
            const center = element.getCenter();
            svgElements.push(m("text", {
                x: center.getX(),
                y: center.getY(),
                fill: element.getColor(),
                style: `font-family: ${element.getFont()}; font-size: ${element.getFontSize()}px;`
            }, element.getContent()));
        }
    }
    m.render(node, svgElements);
}


function identity(x) {
    return x;
}


function functionOrDefault(fn){
    if(typeof fn === 'function'){
        return fn;
    }
    return identity;
}


function drawIcons(element, onClickUp, onClickDown, onClickLeft, onClickRight, onClickPaint, onClickDelete, onClickTransparent) {
    const alphaValue = element.getAlpha() * 100;
    const elementId = element.getId();

    let colorValue = element.getColor();
    if (colorValue.startsWith('rgba')) {
        colorValue = rgbaToHex(colorValue);
    }
    
    return m("div.flex.items-center.space-x-2.ml-2", [
        m("i.fa-solid.fa-arrow-up.cursor-pointer.text-gray-500 hover:text-sky-400", {onclick: () => onClickUp(elementId)}),
        m("i.fa-solid.fa-arrow-down.cursor-pointer.text-gray-500 hover:text-sky-400", {onclick: () => onClickDown(elementId)}),
        m("i.fa-solid.fa-arrow-left.cursor-pointer.text-gray-500 hover:text-sky-400", {onclick: () => onClickLeft(elementId)}),
        m("i.fa-solid.fa-arrow-right.cursor-pointer.text-gray-500 hover:text-sky-400", {onclick: () => onClickRight(elementId)}),
        m("input.cursor-pointer.colorStyle", {
            type: "color", 
            id: `color-picker-${elementId}`, 
            value: colorValue,
            onchange: (evt) => onClickPaint(elementId, evt.target.value)
        }),
        m("input.cursor-pointer", {
            type: "range", 
            value: alphaValue, 
            min: "0", 
            max: "100", 
            id: `transparency-range-${elementId}`, 
            onchange: (evt) => onClickTransparent(elementId, evt.target.value)
        }),
        m("i.fa-solid.fa-trash.cursor-pointer.text-red-400 hover:text-red-700", {onclick: () => onClickDelete(elementId)}),
    ]);
}


function rgbaToHex(rgba) {
    const parts = rgba.substring(rgba.indexOf("(") + 1, rgba.indexOf(")")).split(/,\s*/);
    let r = parseInt(parts[0]).toString(16);
    let g = parseInt(parts[1]).toString(16);
    let b = parseInt(parts[2]).toString(16);

    r = r.length === 1 ? "0" + r : r;
    g = g.length === 1 ? "0" + g : g;
    b = b.length === 1 ? "0" + b : b;

    return `#${r}${g}${b}`;
}
// https://stackoverflow.com/questions/49974145/how-to-convert-rgba-to-hex-color-code-using-javascript



export function populateTable(node, 
                            elements, 
                            onClickUp=undefined, 
                            onClickDown=undefined, 
                            onClickLeft=undefined, 
                            onClickRight=undefined, 
                            onClickPaint=undefined,
                            onClickDelete=undefined,
                            onClickTransparent=undefined) {
    const rows = [];
    for (const element of elements) {
        if (!element) {
            console.error("Encountered undefined element:", element);
            continue;
        }

        try {
            let description;
            if (element instanceof Circle) {
                description = element.toString();
            } else if (element instanceof Rectangle) {
                description = element.toString();
            } else if (element instanceof TextElement) {
                description = element.toString();
            }

            const elementIdWithPrefix = "Calque " + element.getId();

            const row = [
                m("td.id-style", { style: { fontSize: "12px" } }, elementIdWithPrefix),
                m("td.desc-style", { style: { fontSize: "12px" } }, description)
            ];
            const descriptionRow = m("tr", { "data-id": element.getId() }, row);

            const actionRow = [
                m("td.action-icons", { colspan: "3" }, drawIcons(element,
                    functionOrDefault(onClickUp),
                    functionOrDefault(onClickDown),
                    functionOrDefault(onClickLeft),
                    functionOrDefault(onClickRight),
                    functionOrDefault(onClickPaint),
                    functionOrDefault(onClickDelete),
                    functionOrDefault(onClickTransparent)))
            ];
            const actions = m("tr", actionRow);
            const groupedRow = m("tr.grouped-row", {},
                m("td", { colspan: "2" },
                    m("div", {}, [descriptionRow, actions])
                )
            );
            rows.push(groupedRow);
        } catch (error) {
            console.error("Error populating table:", error);
        }
    }
    m.render(node, rows);
}

