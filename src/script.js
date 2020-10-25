//document.getElementById('maintable').insertAdjacentHTML('beforeend','<tr class="mrow"><td contenteditable></td><td id="P1-'+NRP1ID+'"></td><td id="P2-'+NRP2ID+'"></td><td id="P3-'+NRP3ID+'"></td><td><div class="del">&times;</div></td></tr>')
var simplevar = 0
function addTRow() {
    simplevar++
    document.getElementById('maintable').insertAdjacentHTML('beforeend','<tr id="'+simplevar+'" class="trow"><td contenteditable></td><td colspan="3"><input onchange="calculs()" value="0" class="T" name="T" type="number" min="0">W</td></td><td><div class="del" onclick="del(this)" title="Supprimer cette ligne">&times;</div></td></tr>')
}
function addMRow(){
    simplevar++
    document.getElementById('maintable').insertAdjacentHTML('beforeend','<tr id="'+simplevar+'" class="mrow"><td contenteditable></td><td><input onchange="calculs()" value="0" class="P1" name="P1" type="number" min="0">W</td><td><input onchange="calculs()" value="0" class="P2" name="P2" type="number" min="0">W</td><td><input onchange="calculs()" value="0" class="P3" name="P3" type="number" min="0">W</td><td><div class="del" onclick="del(this)" title="Supprimer cette ligne">&times;</div></td></tr>')
}

function del(times){
    times.parentNode.parentNode.remove()
}

setTimeout(calculs,1000)

function calculs(){
    P1Total=0
    P2Total=0
    P3Total=0
    document.querySelectorAll('.T').forEach(triphase=>{
        P1Total+=Number(triphase.value/3)
        P2Total+=Number(triphase.value/3)
        P3Total+=Number(triphase.value/3)
    })
    document.querySelectorAll('.P1').forEach(P1=>{
        P1Total+=Number(P1.value)
    })
        document.querySelectorAll('.P2').forEach(P2=>{
        P2Total+=Number(P2.value)
    })
        document.querySelectorAll('.P3').forEach(P3=>{
        P3Total+=Number(P3.value)
    })
    GTotal=P1Total+P2Total+P3Total
    // Render
    document.getElementById("totalN").innerHTML=Number(GTotal).toFixed(0)
    document.getElementById("totalP1").innerHTML=Number(P1Total).toFixed(0)
    document.getElementById("totalP2").innerHTML=Number(P2Total).toFixed(0)
    document.getElementById("totalP3").innerHTML=Number(P3Total).toFixed(0)
}