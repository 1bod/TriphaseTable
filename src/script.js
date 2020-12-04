if (document.readyState == 'complete' || document.readyState == 'interactive') {
    setTimeout(() => {
        document.querySelector('.loader').style.opacity = "0";
        document.querySelector('.loader').style.display = "none"
    }, 500);

}

function changed(el) {
    el.style.width = (el.value.length * 23 + 10) + 'px';
}

var simplevar = 0
var unsaved = false;

function addTRow() {
    simplevar++
    document.getElementsByClassName('new').item(0).insertAdjacentHTML('beforeBegin', '<div id="' + simplevar + '" class="box tri"> <div class="icon"><a><div class="material-icons drag">drag_indicator</div></a><div class="mic"><div class="material-icons">dehaze</div></div><div class="material-icons del" onclick="del(this)">delete</div></div><input type="text" class="deviceName rname" placeholder="Nom de l\'appareil"><span class="consumption"><input onchange="changed(this);calculs()" value="0" class="T" type="number">W</span><span class="sub">consommation</span></div>')
    return simplevar
}

function addMRow() {
    simplevar++
    document.getElementsByClassName('new').item(0).insertAdjacentHTML('beforeBegin', '<div id="' + simplevar + '" class="box mono"> <div class="icon"><a><div class="material-icons drag">drag_indicator</div></a><div class="mic"><div class="material-icons">horizontal_rule</div></div><div class="material-icons del" onclick="del(this)">delete</div></div><input type="text" class="deviceName rname" placeholder="Nom de l\'appareil"><span class="consumption"><input class="mnum" onchange="changed(this);calculs()" value="0" type="number">W</span><span class="sub">consommation sur la<select class="mph" name="phase" class="phase" onchange="calculs()"><option value="1" selected>phase 1</option><option value="2">phase 2</option><option value="3">phase 3</option></select></span></div>')
    return simplevar
}

function del(b) {
    b.parentNode.parentNode.remove()
    calculs()
}


function calculs() {
    P1Total = 0
    P2Total = 0
    P3Total = 0
    document.querySelectorAll('.T').forEach(triphase => {
        P1Total += Number(triphase.value / 3)
        P2Total += Number(triphase.value / 3)
        P3Total += Number(triphase.value / 3)
    })
    document.querySelectorAll('.mph').forEach(element => {
        phase = element.value
        
        
        document.querySelectorAll('.mnum').forEach(el => {
            valh = el.value
            if(phase == 1){
                P1Total += Number(el.value)
            }else if(phase == 2){
                P2Total += Number(el.value)
            }else if(phase == 3){
                P3Total += Number(el.value)
            }
        
    })
    })
    GTotal = P1Total + P2Total + P3Total
    // Render
    document.getElementById("totalN").innerHTML = Number(GTotal).toFixed(0) + ' W'
    document.getElementById("totalP1").innerHTML = Number(P1Total).toFixed(0) + ' W'
    document.getElementById("totalP2").innerHTML = Number(P2Total).toFixed(0) + ' W'
    document.getElementById("totalP3").innerHTML = Number(P3Total).toFixed(0) + ' W'

    unsaved = true
}

function createData() {
    let title = _.escape(document.getElementById("title").value)
    let table = []
    var tableJSON = [{
        "title": title
    }]
    document.querySelectorAll(".row").forEach(row => {
        let rname = _.escape(row.querySelector(".rname").innerHTML)
        /*if (rname == "") {
            rname = row.getAttribute("id")
        }*/
        if (_.startsWith(row.getAttribute("class"), 'trow')) { // si row = triphasé

            table.push({
                'name': rname,
                'type': 'T',
                'value': row.childNodes[1].firstChild.value
            })
        } else if (_.startsWith(row.getAttribute("class"), 'mrow')) { // si row = monophasé
            table.push({
                'name': rname,
                'type': 'M',
                'values': [row.childNodes[1].firstChild.value, row.childNodes[2].firstChild.value, row.childNodes[3].firstChild.value]
            })
        }

    })
    tableJSON.push(table)
    let totVars = []
    document.querySelectorAll('.linkedVar').forEach(el => {
        let content = el.innerHTML.split(' = ')
        let name = _.escape(content[0])
        let val = parseFloat(content[1].substring(0, (content[1].length - 2)))
        totVars.push({
            'name': name,
            'value': val
        })
    })
    tableJSON.push(totVars)
    save(tableJSON)
}

function save(downloadJSON) {
    window.URL.revokeObjectURL(url);
    var data = new Blob([JSON.stringify(downloadJSON)], {
        type: 'text/json'
    })

    var url = window.URL.createObjectURL(data)

    document.getElementById('download').href = url
    document.getElementById('download').target = "_blank"
    document.getElementById('download').download = document.getElementById("title").value ? _.escape(document.getElementById("title").value) + ".json" : "table" + ".json"
}

function importTable(table) {
    if (table.type && table.type.indexOf('json') === -1) {
        showError('File is not JSON: ' + table.type + '  ' + table)
        return;
    }
    let tableData, fulltableData
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        fulltableData = JSON.parse(event.target.result)
        document.getElementById('title').value = fulltableData[0].title
        tableData = fulltableData[1]
        tableData.forEach(obj => {
            if (obj.type == 'T') { //si la sauvegarde indique row = triphasé
                let row = document.getElementById(String(addTRow()))
                row.querySelector(".rname").innerHTML = obj.name
                row.childNodes[1].firstChild.value = obj.value
            } else if (obj.type == 'M') { //si la sauvegarde indique row = monomhasé
                let row = document.getElementById(String(addMRow()))
                row.querySelector(".rname").innerHTML = obj.name
                row.childNodes[1].firstChild.value = obj.values[0]
                row.childNodes[2].firstChild.value = obj.values[1]
                row.childNodes[3].firstChild.value = obj.values[2]
            }
        })
        fulltableData[2].forEach(obj => {
            document.querySelector('.linkedVars').insertAdjacentHTML('beforeend', "<li class='linkedVar'>" + obj.name + " = " + obj.value + "mm</li>")
        })
    })
    reader.readAsText(table)
}

function showError(message) {
    console.error(message)
    document.getElementById('messageContent').innerHTML = message + '    <a href="#" id="dismissMes"onclick="this.parentNode.parentNode.classList.remove(\'activeMes\')">&times;</a>'
    document.getElementById('messageContent').parentNode.classList.add("activeMes")
}

function section() {
    let T = document.getElementById("U").value
    let dU = document.getElementById("dU").value
    let TRel = parseFloat(document.getElementById("chuteDeTensionRel").innerHTML)
    let rohtxt = document.getElementById("roh").value
    let roh = rohtxt == "0.037 (Aluminium)" ? 0.037 : 0.023
    let L = document.getElementById("L").value
    let I = document.getElementById("I").value
    TRel = (dU / 100) * T
    document.getElementById("chuteDeTensionRel").innerHTML = TRel.toFixed(2)
    result = (roh * 2 * L * I) / TRel
    document.getElementById("Result").innerHTML = result.toFixed(2)
}

//https://stackoverflow.com/questions/11844256/alert-for-unsaved-changes-in-form



function unloadPage() {
    if (unsaved) {
        return "You have unsaved changes on this page. Do you want to leave this page and discard your changes or stay on this page?";
    }
}

window.onbeforeunload = unloadPage;

function linkResVar() {
    let name = prompt("Quel nom voulez vous donner à cette variable")
    let val = parseFloat(document.getElementById("Result").innerHTML)
    document.querySelector('.linkedVars').insertAdjacentHTML('beforeend', "<li class='linkedVar'>" + name + " = " + val + "mm</li>")
}