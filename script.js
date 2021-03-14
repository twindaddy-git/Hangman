/**
 * Eine Klasse zur Darstellung einer Tastatur
 */
class Keyboard {
    constructor() {
        this._rows = [
            "QWERTZUIOP",
            "ASDFGHJKL",
            "YXCVBNM"
        ];
    }

    renderHtml() {
        var result = '<div class="keyboard" onclick="onKeyClick(window.event)"> ';
        for (var i = 0; i < this._rows.length; i++) {
            result += "<div class='kbrow'>";
            for (var j = 0; j < this._rows[i].length; j++) {
                result += '<span id="' + this._rows[i][j] + '">' + this._rows[i][j] + '</span>';
            }
            result += "</div>";
        }
        result += "</div>";
        return result;
    }
}

function onKeyClick(ev) {
    if (ev.target.id) {
        alert("Clicked on: " + ev.target.id);
    }
}
