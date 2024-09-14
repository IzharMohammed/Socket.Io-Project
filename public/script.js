const socket = io();

let button = document.getElementById('btn');
let inputBox = document.getElementById('inputText');
let lists = document.getElementById('lists');

button.onclick = function exec() {
    socket.emit('msg_sent', {
        msg: inputBox.value
    })
}

// button.onclick = function exec(){
//     socket.emit('from_client');
// }

socket.on('msg_sent', (data) => {
    const ul =document.getElementById('lists');
    const li = document.createElement('li');
    li.innerText = data.msg;
    ul.append(li);
})