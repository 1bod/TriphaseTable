var NLinesContainer = document.getElementsByClassName("table").item(0);
var addedCells = document.getElementsByClassName("newCell");
var newRows = document.getElementsByClassName("newRow");
var emptyLine =
  "<tr class='newRow'><td class='designation' contenteditable></td><td class='newCell'> </td><td class='newCell'></td><td class='newCell'></td></td><td class='newCell'></td><td class='newCell'></td><td class='newCell'></td></tr><tr><td class='designation' contenteditable></td><td class='newCell' colspan='3'></td></td><td class='newCell'></td><td class='newCell'></td><td class='newCell'></td></tr>";

var P1Total = 0;
var P2Total = 0;
var P3Total = 0;
var GTotal = 0;

function addLine() {
  NLinesContainer.insertAdjacentHTML("beforeend", emptyLine);
  var TIndex = Object.keys(newRows)[Object.keys(newRows).length - 1];
  Object.values(addedCells).forEach(function (cell, index) {
    cell.innerHTML =
      "<input class='wattage tdnum" +
      index +
      " trnum" +
      TIndex +
      "' type='number' min='0' step='100' value='0' onchange='changed(this)'>W";
    cell.classList.remove("newCell");
  });
}

function changed(input) {
  var inputTD = input.classList.item(1);
  var inputTR = input.classList.item(2);
  if (inputTD == "tdnum0") {
    //Changer le 3
    document
      .getElementsByClassName(inputTR + " tdnum3")
      .item(0).value = parseInt(input.value);
    calcP1();
  } else if (inputTD == "tdnum1") {
    //Changer le 4
    document
      .getElementsByClassName(inputTR + " tdnum4")
      .item(0).value = parseInt(input.value);
    calcP2();
  } else if (inputTD == "tdnum2") {
    //Changer le 5
    document
      .getElementsByClassName(inputTR + " tdnum5")
      .item(0).value = parseInt(input.value);
    calcP3();
  } else if (inputTD == "tdnum3") {
    //Changer le 0
    document
      .getElementsByClassName(inputTR + " tdnum0")
      .item(0).value = parseInt(input.value);
    calcP1();
  } else if (inputTD == "tdnum4") {
    //Changer le 1
    document
      .getElementsByClassName(inputTR + " tdnum1")
      .item(0).value = parseInt(input.value);
    calcP2();
  } else if (inputTD == "tdnum5") {
    //Changer le 2
    document
      .getElementsByClassName(inputTR + " tdnum2")
      .item(0).value = parseInt(input.value);
    calcP3();
  } else if (inputTD == "tdnum6") {
    document.getElementsByClassName(inputTR + " tdnum7").item(0).value =
      parseInt(input.value) / 3;
    document.getElementsByClassName(inputTR + " tdnum8").item(0).value =
      parseInt(input.value) / 3;
    document.getElementsByClassName(inputTR + " tdnum9").item(0).value =
      parseInt(input.value) / 3;
    calcP1();
    calcP2();
    calcP3();
  } else if (inputTD == "tdnum7") {
    document.getElementsByClassName(inputTR + " tdnum6").item(0).value =
      parseInt(input.value) * 3;
    document.getElementsByClassName(inputTR + " tdnum8").item(0).value =
      parseInt(
        document.getElementsByClassName(inputTR + " tdnum6").item(0).value
      ) / 3;
    document.getElementsByClassName(inputTR + " tdnum9").item(0).value =
      parseInt(
        document.getElementsByClassName(inputTR + " tdnum6").item(0).value
      ) / 3;
    calcP1();
    calcP2();
    calcP3();
  } else if (inputTD == "tdnum8") {
    document.getElementsByClassName(inputTR + " tdnum6").item(0).value =
      parseInt(input.value) * 3;
    document.getElementsByClassName(inputTR + " tdnum7").item(0).value =
      parseInt(
        document.getElementsByClassName(inputTR + " tdnum6").item(0).value
      ) / 3;
    document.getElementsByClassName(inputTR + " tdnum9").item(0).value =
      parseInt(
        document.getElementsByClassName(inputTR + " tdnum6").item(0).value
      ) / 3;
    calcP1();
    calcP2();
    calcP3();
  } else if (inputTD == "tdnum9") {
    document.getElementsByClassName(inputTR + " tdnum6").item(0).value =
      parseInt(input.value) * 3;
    document.getElementsByClassName(inputTR + " tdnum7").item(0).value =
      parseInt(
        document.getElementsByClassName(inputTR + " tdnum6").item(0).value
      ) / 3;
    document.getElementsByClassName(inputTR + " tdnum8").item(0).value =
      parseInt(
        document.getElementsByClassName(inputTR + " tdnum6").item(0).value
      ) / 3;

    calcP1();
    calcP2();
    calcP3();
  }
  calcTotal();
}

function calcP1() {
  P1Total = 0;
  Object.values(document.getElementsByClassName("tdnum3")).forEach((input) => {
    P1Total = P1Total + parseInt(input.value);
  });
  Object.values(document.getElementsByClassName("tdnum7")).forEach((input) => {
    P1Total = P1Total + parseInt(input.value);
  });
  document.getElementById("totalP1").innerHTML = P1Total;
}

function calcP2() {
  P2Total = 0;
  Object.values(document.getElementsByClassName("tdnum4")).forEach((input) => {
    P2Total = P2Total + parseInt(input.value);
  });
  Object.values(document.getElementsByClassName("tdnum8")).forEach((input) => {
    P2Total = P2Total + parseInt(input.value);
  });
  document.getElementById("totalP2").innerHTML = P2Total;
}

function calcP3() {
  P3Total = 0;
  Object.values(document.getElementsByClassName("tdnum5")).forEach((input) => {
    P3Total = P3Total + parseInt(input.value);
  });
  Object.values(document.getElementsByClassName("tdnum9")).forEach((input) => {
    P3Total = P3Total + parseInt(input.value);
  });
  document.getElementById("totalP3").innerHTML = P3Total;
}

function calcTotal() {
  GTotal = P1Total + P2Total + P3Total;
  document.getElementById("totalN").innerHTML = GTotal;
}
