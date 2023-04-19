window.addEventListener('load', async () => {
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.register('sw.js')
      console.log('Service worker register success', reg)
    } catch (e) {
      console.log('Service worker register fail')
    }
  }

 
})



const form = document.querySelector(".form");
const convertBtn = document.querySelector(".convert");
const targetName = document.querySelector(".target");
const addTarget = document.querySelector(".add");
const list = document.querySelector(".list");
const swichToConditional = 1000;
const swichToSK = 41;
const swichAngle = -0.0419;
let lastCange;
let { x, y, tryx, tryy } = form;

convertBtn.addEventListener("click", convert);
form.addEventListener("submit", convert);
addTarget.addEventListener("click", addToList);
form.addEventListener("change", change);
form.addEventListener("paste", pasteStr);

function pasteStr(e) {
  e.preventDefault();

  const paste = (e.clipboardData || window.clipboardData).getData("text");
  const input = e.target.closest("input");
 
 
    if (paste.length >= 17) {
      const coordinates = splitString(paste);
      lastCange = input;
      x.value = coordinates[0];
      y.value = coordinates[1];
      tryx.value = coordinates[0];
      tryy.value = coordinates[1];
      checkLastCange();
    }
   
 
 
}

function change(e) {
  const input = e.target.closest("input");

  if (!input && input.value.length < 5) return;
  lastCange = input;
  checkLastCange();
}

function convert(e) {
  
  e.preventDefault();

  checkLastCange();
}

function getConditional() {
  if (tryx.value && tryy.value) {
    x.value = Math.ceil(
      (tryx.value - swichToConditional) * Math.cos(swichAngle) +
        (tryy.value - swichToConditional) * Math.sin(swichAngle) +
        swichToConditional
    );
    y.value = Math.ceil(
      -(tryx.value - swichToConditional) * Math.sin(swichAngle) +
        (tryy.value - swichToConditional) * Math.cos(swichAngle) +
        swichToConditional
    );
  }
}

function getSK() {
  if (x.value && y.value) {
    tryx.value = Math.ceil(
      x.value * Math.cos(-swichAngle) +
        y.value * Math.sin(-swichAngle) -
        swichToSK
    );
    tryy.value = Math.ceil(
      -x.value * Math.sin(-swichAngle) +
        y.value * Math.cos(-swichAngle) +
        swichToSK
    );
  }
}

function addToList() {
  const listItem = document.createElement("li");
  listItem.innerHTML = `<div><span>№</span> ${
    targetName.value && targetName.value
  }:</div><div><span>Ум.</span> ${x.value} ${y.value};</div><div><span>УСК</span> ${tryx.value} ${
    tryy.value
  }.</div>`;
  list.appendChild(listItem);
}

function splitString(string) {
  const regex = /(\d{5})/g;
  const matches = string.match(regex);

  return matches;
}
 function checkLastCange (){
  if (lastCange === x || lastCange === y) {
    getSK();
  }
  if (lastCange === tryx || lastCange === tryy) {
    getConditional();
  }
 }
