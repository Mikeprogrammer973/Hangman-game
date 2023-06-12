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
let i_focused = false;
let g_h;
let c_i = 0;
let draw
let intv_piscar

window.onload = () => {
  draw = SVG().addTo("#c-boneco").size(200, 300)

  if (!localStorage.game_history) {
    localStorage.game_history = JSON.stringify([]);
  }

  show_history(false);

  c_msg = document.getElementById('c-msg');
  c_word = document.getElementById('c-word');
  i_letter = document.getElementById('i-letter');
  btn_v = document.getElementById('validate');
  btn_r_w = document.getElementById('rand-w');
  bxs_errors = document.querySelectorAll('.error');

  i_letter.addEventListener('focus', () => {
    i_focused = true;
  });

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

  window.addEventListener('keydown', (e) => {
    if (e.keyCode == 13) {
      if (i_focused) {
        check_letter();
      }
    }
  });
};

function update_history(word, stat) {
  g_h.push([word, stat]);
  localStorage.game_history = JSON.stringify(g_h);
  show_history(false);
}
function show_history(mode) {
  g_h = JSON.parse(localStorage.game_history);

  let r_qtd = 0;
  document.getElementById('h-w-s').innerHTML = '';

  g_h.forEach((w) => {
    let dv = document.createElement('div');
    dv.innerHTML = w[0];
    if (w[1]) {
      dv.style.backgroundColor = 'green';
      r_qtd++;
    }
    document.getElementById('h-w-s').append(dv);
  });
  document.getElementById('win').innerHTML = 'Win: ' + r_qtd;
  document.getElementById('lost').innerHTML = 'Lost: ' + (g_h.length - r_qtd);
  document.getElementById('total').innerHTML = 'Total: ' + g_h.length;

  // Without details
  if (!mode) {
    document.getElementById(
      'game-history'
    ).innerHTML = `${r_qtd}/${g_h.length}`;
    return;
  }
  // With details
  document.getElementById('c-g-h').style.display = 'block';
}

function piscar() {
  let color = c_i == 0 ? 'transparent' : 'darkred';
  if (c_i == 0) {
    c_i = 1;
  } else {
    c_i = 0;
  }
  document.getElementById("c-boneco").style.backgroundColor = color
}

function hangman(error) {
  if(error == 1){
    let p1 = draw.line(5, 190, 190, 290).move(190, 5).stroke({color:'black', width: 10, linecap: 'round'})
    p1.plot(20, 10, 20, 280)

    let p2 = draw.line(5, 190, 190, 290).move(190, 5).stroke({color:'black', width: 10, linecap: 'round'})
    p2.plot(20, 10, 100, 10)

    let p3 = draw.line(5, 190, 190, 290).move(190, 5).stroke({color:'black', width: 10, linecap: 'round'})
    p3.plot(70, 10, 20, 50)

    let p4 = draw.line(5, 190, 190, 290).move(190, 5).stroke({color:'black', width: 10, linecap: 'round'})
    p4.plot(100, 10, 100, 50)

    let p5 = draw.line(5, 190, 190, 290).move(190, 5).stroke({color:'black', width: 10, linecap: 'round'})
    p5.plot(10, 285, 100, 285)

    draw.circle(50).fill("red").move(75, 50)
  }
  if(error == 2){
    draw.line(150, 95, 150, 225).move(100, 55).stroke({color:'red', width: 10, linecap: 'round'})
  }
  if(error == 3){
    let bras1 = draw.line(40, 40, 50, 50).move(100, 55).stroke({color:'red', width: 10, linecap: 'round'})
    bras1.animate(300).plot(100, 125, 120, 165)
  }
  if(error == 4){
    let bras2 = draw.line(40, 40, 50, 50).move(100, 55).stroke({color:'red', width: 10, linecap: 'round'})
    bras2.animate(300).plot(100, 125, 80, 165)
  }
  if(error == 5){
    let pied1 = draw.line(40, 40, 50, 50).move(100, 55).stroke({color:'red', width: 10, linecap: 'round'})
    pied1.animate(300).plot(100, 185, 120, 220)
  }
  if(error == 6){
    let pied2 = draw.line(40, 40, 50, 50).move(100, 55).stroke({color:'red', width: 10, linecap: 'round'})
    pied2.animate(300).plot(100, 185, 80, 220)

    intv_piscar = setInterval(()=>{
      piscar()
    }, 300)
  }
  if(error == 7){
    clearInterval(intv_piscar)
    draw.clear()
  }
}

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
        update_history(word, true);
        take_word();
      }, 3000);
    }
  } else {
    errors++;
    hangman(errors)
    if (errors == bxs_errors.length + 1) {
      //alert("You lost!")
      c_msg.style.display = 'flex';
      c_msg.children[0].style.backgroundColor = 'darkred';
      c_msg.children[0].innerHTML =
        'Game over!<hr><em>The word was: ' + word + '</em>';
      setTimeout(() => {
        c_msg.style.display = 'none';
        update_history(word, false);
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
    let ld1 = word[0];
    let ld2;
    let i = 0;
    while (i < word.length) {
      if (word[i] != ld1) {
        ld2 = word[i];
        break;
      }
      i++;
    }
    i_letter.value = ld1;
    check_letter();
    i_letter.value = ld2;
    check_letter();
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
    if (errors == bxs_errors.length + 1) {
      //alert("You lost!")
      c_msg.style.display = 'flex';
      c_msg.children[0].style.backgroundColor = 'darkred';
      c_msg.children[0].innerHTML =
        'Game over!<hr><em>The word was: ' + word + '</em>';
      setTimeout(() => {
        c_msg.style.display = 'none';
        update_history(word, false);
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
