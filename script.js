const MASK_CHARACTER = "_";

/**
 * Eine Klasse zur Darstellung einer Tastatur
 */
class Keyboard {
    constructor(textName) {
        this._rows = [
            "QWERTZUIOP",
            "ASDFGHJKL",
            "YXCVBNM"
        ];
        this._textName = textName;
    }

    renderHtml() {
        var result = '<div class="keyboard" onclick="onKeyClick(window.event,' + this._textName + ')"> ';
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

/**
 * Eine Klasse für den zur erratenden Text
 */
class HangmanText {
    constructor(element) {
        this._text = "";
        this._guessed = "";
        this.connect(element);
    }

    get text() {
        return this._text;
    }
    set text(text) {
        this._text = text;
        for (var i = 0; i < this._text.length; i++) {
            if (this._text[i] === " ") {
                this._guessed += " ";
            } else {
                this._guessed += MASK_CHARACTER;
            }
        }
        if (this._element) {
            this._element.innerText = this._guessed;
        }
    }

    get guessed() {
        return this._guessed;
    }

    connect(element) {
        this._element = element;
    }

    guess(char) {
        var check = char.toUpperCase();
        for (var i = 0; i < this._text.length; i++) {
            if (this._text[i].toUpperCase() == check) {
                this._guessed = this._guessed.substring(0, i) + this._text[i] +
                                this._guessed.substring(i + 1);
            }
        }
        if (this._element) {
            this._element.innerText = this._guessed;
        }
    }
}

function onKeyClick(ev, ht) {
    if (ev.target.id) {
        ht.guess(ev.target.id);
    }
}
