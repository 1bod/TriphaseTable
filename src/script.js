if (document.readyState == 'complete' || document.readyState == 'interactive') {
    setTimeout(() => {
        document.querySelector('.loader').style.opacity = "0";
        document.querySelector('.loader').style.display = "none"
    }, 500);

}

function changed(el) {
    el.style.width = (el.value.length * 23 + 10) + 'px';
}
var simplevar2 = 0
var simplevar = 0
var unsaved = false;

function addTRow() {
    simplevar++
    document.getElementsByClassName('new').item(0).insertAdjacentHTML('beforeBegin', '<div id="' + simplevar + '" class="tri box"> <div class="icon"><a><div class="material-icons drag">drag_indicator</div></a><div class="mic"><div class="material-icons">dehaze</div></div><div class="material-icons del" onclick="del(this)">delete</div></div><input type="text" class="deviceName rname" placeholder="Nom de l\'appareil"><span class="consumption"><input onchange="changed(this);calculs()" value="0" class="T" type="number">W</span><span class="sub">consommation</span></div>')
    return simplevar
}

function addMRow() {
    simplevar++
    document.getElementsByClassName('new').item(0).insertAdjacentHTML('beforeBegin', '<div id="' + simplevar + '" class="mono box"> <div class="icon"><a><div class="material-icons drag">drag_indicator</div></a><div class="mic"><div class="material-icons">horizontal_rule</div></div><div class="material-icons del" onclick="del(this)">delete</div></div><input type="text" class="deviceName rname" placeholder="Nom de l\'appareil"><span class="consumption"><input class="mnum" onchange="changed(this);calculs()" value="0" type="number">W</span><span class="sub">consommation sur la<select class="mph" name="phase" class="phase" onchange="calculs()"><option value="1" selected>phase 1</option><option value="2">phase 2</option><option value="3">phase 3</option></select></span></div>')
    return simplevar
}

function del(b) {
    b.parentNode.parentNode.remove()
    calculs()
}

function delEZ(b) {
    b.parentNode.remove()
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
        valh = element.parentNode.previousSibling.firstChild.value
        if (phase == 1) {
            P1Total += Number(valh)
        } else if (phase == 2) {
            P2Total += Number(valh)
        } else if (phase == 3) {
            P3Total += Number(valh)
        }

    })
    GTotal = P1Total + P2Total + P3Total
    // Render
    document.getElementById("totalN").innerHTML = Number(GTotal).toFixed(0) + ' W'
    document.getElementById("totalP1").innerHTML = Number(P1Total).toFixed(0) + ' W'
    document.getElementById("totalP2").innerHTML = Number(P2Total).toFixed(0) + ' W'
    document.getElementById("totalP3").innerHTML = Number(P3Total).toFixed(0) + ' W'

    unsaved = true
}

function createData(el) {
    let title = _.escape(document.getElementById("title").value)
    let table = []
    var tableJSON = [{
        "title": title
    }]
    document.querySelectorAll(".box").forEach(row => {
        let rname = _.escape(row.querySelector(".rname").value)
        /*if (rname == "") {
            rname = row.getAttribute("id")
        }*/
        if (_.startsWith(row.getAttribute("class"), 'tri')) { // si row = triphasé

            table.push({
                'name': rname,
                'type': 'T',
                'value': row.childNodes[3].firstChild.value
            })
        } else if (_.startsWith(row.getAttribute("class"), 'mono')) { // si row = monophasé
            table.push({
                'name': rname,
                'type': 'M',
                'phase': row.childNodes[4].lastChild.value,
                'value': row.childNodes[3].firstChild.value
            })
        }

    })
    tableJSON.push(table)
    let totVars = []
    document.querySelectorAll('.varName').forEach(el => {
        let content = el.innerHTML.split(' = ')
        let name = _.escape(el.innerHTML)
        let val = _.escape(el.nextElementSibling.innerHTML)
        totVars.push({
            'name': name,
            'value': val
        })
    })
    tableJSON.push(totVars)
    save(tableJSON, el.id)
}

function save(downloadJSON, did) {
    window.URL.revokeObjectURL(url);
    var data = new Blob([JSON.stringify(downloadJSON)], {
        type: 'text/json'
    })

    var url = window.URL.createObjectURL(data)

    document.getElementById(did).href = url
    document.getElementById(did).target = "_blank"
    document.getElementById(did).download = document.getElementById("title").value ? _.escape(document.getElementById("title").value) + ".json" : "table" + ".json"
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
                row.querySelector(".rname").value = obj.name
                row.childNodes[3].firstChild.value = obj.value
            } else if (obj.type == 'M') { //si la sauvegarde indique row = monomhasé
                let row = document.getElementById(String(addMRow()))
                row.querySelector(".rname").value = obj.name
                row.childNodes[3].firstChild.value = obj.value
                row.childNodes[4].lastChild.value = obj.phase
            }
        })
        fulltableData[2].forEach(obj => {
            linkResVar(undefined, 'c', obj)
        })
    })
    reader.readAsText(table)
    setTimeout(() => {
        calculs()
    }, 10);
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

function linkResVar(plus, form, content) {
    simplevar2++
    if (form == 'v') {
        vname = plus.nextElementSibling.value
        vvalue = plus.nextElementSibling.nextElementSibling.value
    } else if (form == 'c') {
        vname = content.name
        vvalue = content.value
    }
    document.querySelector('#vars').insertAdjacentHTML('beforeend', '<li id="var' + simplevar2 + '" class="var"><span onclick="delEZ(this)" class="varDel" title="Supprimer la variable"><div class="material-icons md-24">clear</div></span><p class="varName">' + vname + '</p>=<p class="varVal">' + vvalue + '</p></li><br>')
}