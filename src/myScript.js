let numberOfElements = 6;

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    let data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}

function createNewElement(ev) {
    let target = document.getElementById(ev.target.id);
    target.innerHTML += `<p class=\"element\" id=\"element${numberOfElements}\" draggable=\"true\" ondragstart=\"drag(event)\">
    <input type="text" id=\"input${numberOfElements}\" onfocusout=\"saveInput(event)\"></p>`;
}

function saveInput(ev){
    console.log("pimmel")
    let target = document.getElementById(ev.target.id);
}

function editElement(ev){
    let target = document.getElementById(ev.target.id);
}
