const socket = io();

let button = document.getElementById('btn');
let inputBox = document.getElementById('inputText');
let lists = document.getElementById('lists');

button.onclick = function exec() {
    console.log(inputBox.value);
    socket.emit('msg_sent', {
        msg: inputBox.value
    })
}

// button.onclick = function exec(){
//     socket.emit('from_client');
// }

socket.on('from_server', () => {
    const div = document.createElement('div');
    div.innerText = "i am the greatest";
    document.body.append(div);
})