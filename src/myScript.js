class ListElement {
    constructor(value = ".", id, parentID = "", children = null) {
        this.type = value !== "" || parentID !== "" || id !== undefined ? "Element" : "Placeholder";
        this.value = value;
        this.id = id;
        this.parentID = parentID;
        this.children = children;
    }
}

const boards = [];
const header = [];
const elements = [];
let numberOfElements = elements.length;
let numberOfBoards;

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

function appendNewBoard() {
    let board = createBoard();
    let content = document.getElementById("content").appendChild(createBoard());
    boards.push(new ListElement("", board.id, content.id));
    header.push(new ListElement(board.firstChild.textContent, board.firstChild.id, board.id));
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
    console.log(target);
    getElementByID(ev.target.parentElement.id).value = target.value; //setzt den Value des Objekts
    console.log("Target Parent Element: ", target.parentElement);
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

function createBoard(value = "", id = numberOfBoards) {
    let boardElement = document.createElement("div");
    boardElement.id = `kanban${id}`;
    boardElement.className = "kanban";
    boardElement.addEventListener("drop", ev => drop(ev));
    boardElement.addEventListener("drag", ev => allowDrop(ev));

    let wrapperElement = document.createElement("div");
    wrapperElement.className = "wrapper";
    wrapperElement.id = `wrapper${id}`;
    wrapperElement.addEventListener("dblclick", ev => createNewElement(ev));

    let headerElement = document.createElement("p");
    headerElement.id = `header${id}`;
    headerElement.className = "kanbanHeader";
    headerElement.addEventListener("dblclick", ev => editElement(ev));

    let inputElement = document.createElement("input");
    inputElement.className = "headInput";
    inputElement.id = "inputElement";
    inputElement.addEventListener("focusout", ev => saveInput(ev));
    inputElement.addEventListener("keypress", ev => enterPresses(ev));
    inputElement.value = "";
    inputElement.focus();

    headerElement.appendChild(inputElement);
    wrapperElement.appendChild(headerElement);
    boardElement.appendChild(wrapperElement);

    return boardElement;
}


function buildObjects() {
    numberOfBoards = document.getElementsByClassName("kanban").length;
    for (const board of boards) {
        let boardElement = createBoard();
        boardElement.id = board.id;
    }
    for (const element of elements) {
        let paragraphElement = createElement();
        paragraphElement.id = element.id;
        paragraphElement.innerText = element.value;
        document.getElementById(element.parentID).appendChild(paragraphElement);
    }
}

function getElementByID(id = "") {
    for (const board of boards) {
        if (board.id === id) {
            return board;
        }
    }
    for (const head of header) {
        if (head.id === id) {
            return head;
        }
    }
    for (const element of elements) {
        if (element.id === id) {
            return element
        }
    }
    return undefined;
}

function updateJSON() {
    console.log("Boards: ", JSON.stringify(boards));
    console.log("Header: ", JSON.stringify(header));
    console.log("Elements: ", JSON.stringify(elements));
}