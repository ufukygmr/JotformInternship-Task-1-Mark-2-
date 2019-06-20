let tasks = [];
let data ={};


const takeText = () => {
            
    const text = document.getElementById("task").value;
    if (text == ""){
        return false
    }
    else {
        return text;
    }
}

const takeData = () => {
    const ref = firebase.database().ref('tasks');

    const data = {
        id : null,
        task: "",
        done: false
    }

    ref.once('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            data.id = childSnapshot.key;
            data.task = childSnapshot.val().task;
            data.done = childSnapshot.val().done;
            addToList(data.task, data.done, data.id);
        })
    });
}

window.onload = () => {
    takeData();
}

const addToList = (dataTask, dataDone, dataId) => {
    const section = document.getElementById("tasks");

    const div = document.createElement("div");
    div.id = dataId;
    div.className = "task";
    div.style.width = "400px";

    const button = document.createElement("input");
    button.className = "taskList";
    button.id = dataId + "1";
    button.type = "checkbox";
    button.className = "taskList";
    button.style.cssFloat = "left";
    button.style.width = "20px";
    button.checked = dataDone;
    div.appendChild(button);
    button.onclick = () => {markAsDone(dataId, !dataDone);};

    const p = document.createElement("p");
    p.className = "text";
    p.id = dataId + "2";
    p.innerText = dataTask;
    p.className = "text;"
    p.style.width = "200px";
    div.appendChild(p);
    p.onclick = () => {clickToEdit(dataId);};

    const input = document.createElement("input");
    input.className = "taskList";
    input.id = dataId + "3"
    input.type = "text";
    button.style.cssFloat = "left";
    input.style.width = "100px";
    input.style.display = "none";
    div.appendChild(input);
    input.value = dataTask;

    const button2 = document.createElement("button");
    button2.className = "taskList";
    button2.id = dataId + "4";
    button2.className = "taskList";
    button2.style.width = "70px";
    button2.style.display = "none";
    button2.innerText = "Save";
    div.appendChild(button2);
    button2.onclick = () => {saveEdit(dataId);};

    const delete1 = document.createElement("button");
    delete1.className = "taskList";
    delete1.id = dataId + "4";
    delete1.className = "taskList";
    delete1.style.width = "70px";
    delete1.innerText = "Delete";
    div.appendChild(delete1);
    delete1.onclick = () => {deleteSelected(dataId)}

    section.appendChild(div);

    const data = {};
    data.id = dataId;
    data.task = dataTask;
    data.done = dataDone;

    tasks.push(data);
    button.id = dataId;
}


const putTask = () => {
    myContent = takeText();

    const ref = firebase.database().ref('tasks')
    const fireBaseRef = firebase.database().ref();

    if (myContent == ""){
        alert("Please fullfill the box");
    }
    else {
        const data2 = {
            task : myContent,
            done : false
        }

        const id = ref.push(data2).key;
        data2.id = id;
        
        addToList(data2.task, data2.done, data2.id);
    }
}

const clickToEdit = id => {
    const tag2 = document.getElementById(id + "2");
    const tag3 = document.getElementById(id + "3");
    const tag4 = document.getElementById(id + "4");

    tag2.style.display = "none";
    tag3.style.display = "inline";
    tag4.style.display = "inline";
}

const saveEdit = id =>{
    const tag2 = document.getElementById(id + "2");
    const tag3 = document.getElementById(id + "3");
    const tag4 = document.getElementById(id + "4");

    text = tag3.value;
    tag2.innerText = text;

    tag2.style.display = "inline";
    tag3.style.display = "none";
    tag4.style.display = "none";

    firebase.database().ref('tasks/' + id).update({task: text});

    const x = tasks.find(x => x.id === id);
    x.task = text;

}

const markAsDone = (id, done) => {
    firebase.database().ref('tasks/' + id).update({done: done});
    const x = tasks.find(x => x.id === id);
    x.done = done;
}

const deleteSelected = id => {
    firebase.database().ref('tasks/' + id).remove();
    
    const a = document.getElementById(id);
    a.remove();
}

