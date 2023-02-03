class ListElement {
    constructor(value = ".", id, parentID = "", children = []) {
        this.value = value;
        this.id = id;
        this.parentID = parentID;
        this.children = children;
    }
}

let boards = [
    /*
    new ListElement("ToDo", "kanban0", "content", ["wrapper0"]),
    new ListElement("Doing", "kanban1", "content", ["wrapper1"]),
    new ListElement("Done", "kanban2", "content", ["wrapper2"]),
     */
];
let header = [
    /*
    new ListElement("To do", "header0", "wrapper0"),
    new ListElement("Doing", "header1", "wrapper1"),
    new ListElement("Done", "header2", "wrapper2")
     */
];
let elements = [
    //new ListElement("Test", "element0", "wrapper0")
];

//localStorage.setItem("boards", JSON.stringify(boards));
//localStorage.setItem("header", JSON.stringify(header));

const colors = ["#ff8585", "#fffb85", "#9dff85", "#85ffd8", "#85b0ff", "#c485ff", "#ff85eb"];
let numberOfElements;
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
    getElementByID(data).children.push(ev.target.id);
    getElementByID(data).parentID = ev.target.id;
    ev.target.appendChild(document.getElementById(data));
    updateJSON();
}

function appendNewBoard(value = "") {
    let board = createBoard(value);
    document.getElementById("content").appendChild(board);
    if (value === "") {
        document.getElementById("inputElement").focus();
    }
    boards.push(convertElement(board));
    updateJSON();
}

function createNewElement(ev) {
    ev.stopImmediatePropagation();
    let target = document.getElementById(ev.target.id);
    let element = createElement();
    let inputElement = createInputElement()
    element.replaceChildren(inputElement);
    target.appendChild(element);
    inputElement.focus();

    elements.push(convertElement(element));
    updateJSON();
    ++numberOfElements;
}

function saveInput(ev) {
    ev.stopPropagation();
    let target = document.getElementById(ev.target.id);
    let parentElement = target.parentElement;
    let value = target.value;
    getElementByID(parentElement.id).value = value; //setzt den Value des Objekts
    parentElement.innerText = value;
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

function createElement(value = "") {
    let element = document.createElement("p");
    element.addEventListener("dblclick", ev => editElement(ev));
    element.addEventListener("dragstart", ev => drag(ev));
    element.setAttribute("draggable", "true");
    element.id = `element${numberOfElements}`;
    element.className = "element"
    element.innerText = value;

    ++numberOfElements;
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
    boardElement.style.backgroundColor = colors[numberOfBoards % 7];


    let wrapperElement = document.createElement("div");
    wrapperElement.className = "wrapper";
    wrapperElement.id = `wrapper${id}`;
    wrapperElement.addEventListener("dblclick", ev => createNewElement(ev));
    wrapperElement.addEventListener("drop", ev => drop(ev));
    wrapperElement.addEventListener("dragover", ev => allowDrop(ev));

    let headerElement = document.createElement("p");
    headerElement.id = `header${id}`;
    headerElement.innerText = value;
    headerElement.className = "kanbanHeader";
    headerElement.addEventListener("dblclick", ev => editElement(ev));

    if (value === "") {
        let inputElement = document.createElement("input");
        inputElement.className = "headInput";
        inputElement.id = "inputElement";
        inputElement.addEventListener("focusout", ev => saveInput(ev));
        inputElement.addEventListener("keypress", ev => enterPresses(ev));
        inputElement.value = "";
        inputElement.focus();

        headerElement.appendChild(inputElement);
    }

    wrapperElement.appendChild(headerElement);
    boardElement.appendChild(wrapperElement);

    header.push(convertElement(headerElement));
    ++numberOfBoards;

    return boardElement;
}

function convertElement(element) {
    return new ListElement(element.value, element.id, element.parentElement.id, getChildIDs(element));
}

function getChildIDs(HTMLElement) {
    let childIDs = []
    let children = HTMLElement.childNodes;
    for (let i = 0; i < children.length; i++) {
        childIDs.push(children[i].id);
    }
    return childIDs;
}


function buildObjects() {
    numberOfBoards = 0;
    numberOfElements = 0;
    let jsonBoards = localStorage.getItem("boards");
    let jsonHeader = localStorage.getItem("header");
    let jsonElements = localStorage.getItem("elements");
    console.log("Boards:", jsonBoards);
    console.log("Header:", jsonHeader);
    console.log("elements", jsonElements);
    if (jsonBoards !== null) {
        boards = JSON.parse(jsonBoards);
    }
    if (jsonHeader !== null) {
        header = JSON.parse(jsonHeader);
    }
    if (jsonElements !== null) {
        elements = JSON.parse(jsonElements);
    }
    for (const board of boards) {
        let id = board.id.split("n")[2];
        let value = getElementByID(`header${id}`).value;
        document.getElementById("content").appendChild(createBoard(value)); //TODO überarbeiten
    }
    for (const element of elements) {
        document.getElementById(element.parentID).appendChild(createElement(element.value));
    }
}

function setHeader(bordElement, listElements) {
    const wrapperID = bordElement.firstChild.id;
    let target = bordElement.firstChild.firstChild;
    let value;
    for (const listElement of listElements) {
        if (listElement.parentID === wrapperID) {
            value = listElement.value;
        }
    }
    target.innerText = value;
    getElementByID(target.id).value = value;
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
    localStorage.setItem("boards", JSON.stringify(boards));
    localStorage.setItem("header", JSON.stringify(header));
    localStorage.setItem("elements", JSON.stringify(elements));
}

