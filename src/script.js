
function addRow() {
    document.getElementById('maintable').insertAdjacentHTML('beforeend','<tr class="trow" :id="id"><td contenteditable></td><td colspan="3">{{Twattage}}</td></tr>')
}

