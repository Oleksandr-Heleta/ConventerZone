window.addEventListener("load", async () => {
  if ("serviceWorker" in navigator) {
    try {
      const reg = await navigator.serviceWorker.register("sw.js");
      // console.log("Service worker register success", reg);
    } catch (e) {
      console.log("Service worker register fail");
    }
  }
  renderList();
});

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
list.addEventListener('click', removeTarget);

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
  const targetsList = JSON.parse(localStorage.getItem("targets")) || [];
  targetsList.unshift({
    name: targetName.value,
    x: x.value,
    y: y.value,
    tryx: tryx.value,
    tryy: tryy.value,
  });
  localStorage.setItem("targets", JSON.stringify(targetsList));
  renderList();
}

function renderList() {
  const targetsList = JSON.parse(localStorage.getItem("targets")) || [];
  const listItem = targetsList.reduce((listHtml, el) => {
   return listHtml += `<li id="${el.name}"><div class='name'><span>№</span> ${el.name}:</div>
   <div><span>Ум.</span> ${el.x} ${el.y};</div>
   <div><span>УСК</span> ${el.tryx} ${el.tryy}.</div>
   <div class='xbtn'><button>x</button></div>
   </li>`;
  }, "");
 
  list.innerHTML = listItem;
 
}

function splitString(string) {
  const regex = /(\d{5})/g;
  const matches = string.match(regex);

  return matches;
}
function checkLastCange() {
  if (lastCange === x || lastCange === y) {
    getSK();
  }
  if (lastCange === tryx || lastCange === tryy) {
    getConditional();
  }
}

function removeTarget(e){
const btn = e.target.closest('.xbtn');
if (!btn) return;
const targetId = e.target.closest('li').id;
const targetsList = JSON.parse(localStorage.getItem("targets")) || [];
const filteretList = targetsList.filter(el=>el.name!=targetId);
localStorage.setItem("targets", JSON.stringify(filteretList));
renderList();
}
