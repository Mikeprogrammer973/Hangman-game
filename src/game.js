let animation;
let width = 0;
let bxs_errors;
let errors = 0;
let ok = 0;
let alrd_ok = [];
let btn_v;
let c_msg;
let btn_r_w;
let word;
let c_word;
let i_letter;
let words = ['dog', 'cat', 'response'];
let i_focused = false

window.onload = () => {
  c_msg = document.getElementById('c-msg');
  c_word = document.getElementById('c-word');
  i_letter = document.getElementById('i-letter');
  btn_v = document.getElementById('validate');
  btn_r_w = document.getElementById('rand-w');
  bxs_errors = document.querySelectorAll('.error');

  i_letter.addEventListener("focus", ()=>{
    i_focused = true
  })

  let containers_l = document.querySelectorAll('.container-logo');
  render_logo(containers_l[0], '5vh', '4vh bold monospace');
  render_logo(containers_l[1], '3vh', '2.5vh bold monospace');

  let btn = document.getElementById('btn-init-stop');
  btn.addEventListener('mouseenter', (e) => {
    if (e.target.innerHTML == 'Start') {
      btn.style.backgroundColor = 'green';
      btn.style.color = 'white';
    }
    if (e.target.innerHTML == 'Stop') {
      btn.style.backgroundColor = 'darkred';
      btn.style.color = 'white';
    }
  });
  btn.addEventListener('mouseout', (e) => {
    btn.style.backgroundColor = 'whitesmoke';
    btn.style.color = 'darkgray';
  });

  window.addEventListener("keydown", (e)=>{
    if(e.keyCode == 13 || e.keyCode == 32){
      if(i_focused){
        alert("OK!")
      }
    }
  })
};

function start_game() {
  //alert("Game started!")
  //i_letter.focus()
  take_word();
  btn_r_w.removeAttribute('disabled');
  btn_v.removeAttribute('disabled');
  i_letter.removeAttribute('disabled');
}
function stop_game() {
  //alert("Game stopped!")
  c_word.innerHTML = '';
  btn_r_w.setAttribute('disabled', '');
  btn_v.setAttribute('disabled', '');
  i_letter.setAttribute('disabled', '');
  i_letter.value = '';
  cancelAnimationFrame(animation);
}

function check_letter() {
  if (i_letter.value == '' || i_letter.value.length > 1) {
    //alert("Type one letter, just one!")
    return;
  }
  if (alrd_ok.indexOf(i_letter.value) != -1) {
    return;
  }
  let w = word;
  let right = false;
  let qtd_r = 0;
  let search = w.match(i_letter.value);
  //alert(search)
  while (search != null) {
    c_word.children[w.indexOf(i_letter.value)].innerHTML =
      i_letter.value.toUpperCase();
    w = w.replace(i_letter.value, '!');
    qtd_r++;
    alrd_ok.push(i_letter.value);
    right = true;
    search = w.match(i_letter.value);
  }

  if (right) {
    ok += qtd_r;
    if (ok == word.length) {
      //alert("You win!")
      c_msg.style.display = 'flex';
      c_msg.children[0].style.backgroundColor = 'green';
      c_msg.children[0].innerHTML = 'You win!';
      setTimeout(() => {
        c_msg.style.display = 'none';
        take_word();
      }, 3000);
    }
  } else {
    errors++;
    if (errors == 5) {
      //alert("You lost!")
      c_msg.style.display = 'flex';
      c_msg.children[0].style.backgroundColor = 'darkred';
      c_msg.children[0].innerHTML = 'Game over!';
      setTimeout(() => {
        c_msg.style.display = 'none';
        take_word();
      }, 3000);
    } else {
      bxs_errors[errors - 1].innerHTML = i_letter.value.toUpperCase();
      bxs_errors[errors - 1].style.backgroundColor = 'darkred';
    }
  }
  i_letter.value = '';
  i_letter.focus();
  width = 0;
}

function take_word() {
  ok = 0;
  errors = 0;
  alrd_ok = [];
  cancelAnimationFrame(animation);
  width = 0;
  bxs_errors.forEach((bx) => {
    bx.style.backgroundColor = 'green';
    bx.innerHTML = '';
  });
  c_word.innerHTML = '';
  random_word().then((data) => {
    word = data.word;

    for (let i = 0; i < word.length; i++) {
      let bx = document.createElement('div');
      bx.style.width = '7vh';
      bx.style.height = '7vh';
      bx.style.padding = '.5vh';
      bx.style.justifyContent = 'center';
      bx.style.alignItems = 'center';
      bx.style.textAlign = 'center';
      bx.style.boxSizing = 'border-box';
      bx.style.color = 'teal';
      bx.style.font = '5vh bolder monospace';
      bx.style.backgroundColor = 'whitesmoke';
      bx.style.margin = '1vh';
      bx.style.display = 'inline-block';

      c_word.append(bx);
    }
    //Dica
    //alert(word)
    c_word.children[0].innerHTML = word[0].toUpperCase();
    alrd_ok.push(word[0]);
    c_word.children[word.length - 1].innerHTML =
      word[word.length - 1].toUpperCase();
    alrd_ok.push(word[word.length - 1]);
    ok += 2;
    //
    i_letter.focus();
    fill_time_bar();
  });
}

function fill_time_bar() {
  width += 2;
  if (width >= 1002) {
    width = 0;
    errors++;
    if (errors == 5) {
      //alert("You lost!")
      c_msg.style.display = 'flex';
      c_msg.children[0].style.backgroundColor = 'darkred';
      c_msg.children[0].innerHTML = 'Game over!';
      setTimeout(() => {
        c_msg.style.display = 'none';
        take_word();
      }, 3000);
    } else {
      bxs_errors[errors - 1].style.backgroundColor = 'darkred';
    }
  }
  document.getElementById('time-bar').children[0].style.width = `${
    width / 10
  }%`;
  document.getElementById('time-bar').children[0].style.backgroundColor = 'red';

  animation = window.requestAnimationFrame(fill_time_bar);
}
function process_action(btn) {
  let action = btn.innerHTML;
  if (action == 'Start') {
    btn.innerHTML = 'Stop';
    start_game();
  }
  if (action == 'Stop') {
    btn.innerHTML = 'Start';
    stop_game();
  }
}

async function random_word() {
  const response = await fetch('https://api.api-ninjas.com/v1/randomword', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': 'ICVGRtJ5V429LyUoN72JVw==30pl4Uow8NRTtKNa',
    },
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

function render_logo(container, size, font) {
  for (let i = 0; i < 3; i++) {
    let part = document.createElement('div');
    part.style.width = size;
    part.style.height = size;
    part.style.display = 'inline-flex';
    part.style.backgroundColor = 'white';
    part.style.margin = '.3vw';
    part.style.borderRadius = '50%';
    part.style.justifyContent = 'center';
    part.style.alignItems = 'center';
    if (i != 1) {
      part.style.backgroundColor = 'lightgray';
    }
    if (i == 1) {
      part.innerHTML = '?';
      part.style.color = 'darkred';
      part.style.font = font;
    }

    container.append(part);
  }
}
