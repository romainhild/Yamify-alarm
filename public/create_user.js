let button = document.getElementById("button");
button.disabled = true;

let username = document.getElementById("username");
let passwd = document.getElementById('password');
let confirm = document.getElementById('confirm-password');

function check() {
    if( username.value && passwd.value && confirm.value==passwd.value )
	button.disabled = false;
    else
	button.disabled = true;
};
username.onchange = check;
passwd.onchange = check;
confirm.onchange = check;
