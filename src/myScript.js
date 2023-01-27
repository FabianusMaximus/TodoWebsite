class ListElement {
    constructor(value = ".", id, parentID = "", children = null) {
        this.type = value !== "" || parentID !== "" || id !== undefined ? "Element" : "Placeholder";
        this.value = value;
        this.id = id;
        this.parentID = parentID;
        this.children = children;
    }
}

const elements = [];
let numberOfElements = elements.length;

document.addEventListener('DOMContentLoaded', buildObjects, false);

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.stopPropagation();
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    let data = ev.dataTransfer.getData("text");
    getElementByID(data).parentID = ev.target.id;
    ev.target.appendChild(document.getElementById(data));
    updateJSON();
}

function createNewElement(ev) {
    ev.stopImmediatePropagation();
    let target = document.getElementById(ev.target.id);
    let element = createElement();
    elements.push(new ListElement("", element.id, target.id));
    updateJSON();
    let inputElement = createInputElement()
    element.replaceChildren(inputElement);
    target.appendChild(element);
    inputElement.focus();
    ++numberOfElements;
}

function saveInput(ev) {
    ev.stopPropagation();
    let target = document.getElementById(ev.target.id);
    getElementByID(ev.target.parentElement.id).value = target.value;
    target.parentElement.innerText = target.value;
    updateJSON();
}

function editElement(ev) {
    ev.stopPropagation();
    let target = document.getElementById(ev.target.id);
    let inputElement = createInputElement(target.innerText, parseInt(ev.target.id.split("t")[1]));
    target.replaceChildren(inputElement);
    inputElement.focus();
}

function enterPresses(ev) {
    ev.stopPropagation();
    if (ev.keyCode === 13) {
        saveInput(ev);
    }
}

function createElement() {
    let element = document.createElement("p");
    element.addEventListener("dblclick", ev => editElement(ev));
    element.addEventListener("dragstart", ev => drag(ev));
    element.setAttribute("draggable", "true");
    element.id = `element${numberOfElements}`;
    element.className = "element"
    return element
}

function createInputElement(value = "", id = numberOfElements) {
    let inputElement = document.createElement("input");
    inputElement.addEventListener("focusout", ev => saveInput(ev));
    inputElement.addEventListener("keypress", ev => enterPresses(ev));
    inputElement.id = `input${id}`;
    inputElement.className = "input"
    inputElement.value = value;
    return inputElement;
}


function buildObjects() {
    for (const element of elements) {
        let paragraphElement = createElement();
        paragraphElement.id = element.id;
        paragraphElement.innerText = element.value;
        document.getElementById(element.parentID).appendChild(paragraphElement);
    }
}

function getElementByID(id = "") {
    for (const element of elements) {
        if (element.id === id) {
            return element
        }
    }
    return undefined;
}

function updateJSON() {
    console.log(JSON.stringify(elements));
}