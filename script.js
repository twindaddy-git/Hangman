const MASK_CHARACTER = "_";

/**
 * Eine Klasse zur Darstellung einer Tastatur
 */
class Keyboard {
    constructor(elementID) {
        this._rows = [
            "QWERTZUIOP",
            "ASDFGHJKL",
            "YXCVBNM"
        ];
        this._elementID = elementID;
    }

    get element() {
        return document.getElementById(this._elementID);
    }

    renderHtml() {
        var result = '<div class="keyboard"> ';
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

    render() {
        this.element.innerHTML = this.renderHtml();
    }

    setKeyColor(key, color) {
        document.getElementById(key).style.backgroundColor = color;
    }
}

/**
 * Eine Klasse für den zur erratenden Text
 */
class HangmanText {

    constructor(elementID = false) {
        this._text = "";
        this._guessed = "";
        this.connect(elementID);
    }

    get text() {
        return this._text;
    }

    set text(text) {
        this._text = text;
        this.reset();
    }

    get element() {
        return document.getElementById(this._elementID);
    }

    get guessed() {
        return this._guessed;
    }

    connect(elementID) {
        this._elementID = elementID;
    }

    reset() {
        this._tries = 0;
        this._fails = 0;
        for (var i = 0; i < this._text.length; i++) {
            if (this._text[i] === " ") {
                this._guessed += " ";
            } else {
                this._guessed += MASK_CHARACTER;
            }
        }
        if (this._elementID) {
            this.element.innerText = this._guessed;
        }
    }

    isSolved() {
        return this._guessed.indexOf(MASK_CHARACTER) < 0;
    }

    registerKeyboard(keyboard) {
        this._keyboard = keyboard;
        keyboard.element.addEventListener("click", ev => this.onClick(ev));
    }

    onClick(ev) {
        if (ev.target.id) {
            this.guess(ev.target.id);
        }
    }

    guess(char) {
        var check = char.toUpperCase();
        var found = false;
        this._tries++;
        for (var i = 0; i < this._text.length; i++) {
            if (this._text[i].toUpperCase() == check) {
                this._guessed = this._guessed.substring(0, i) + this._text[i] +
                                this._guessed.substring(i + 1);
                found = true;
            }
        }
        if (! found) {
            this._fails++;
            if (this._keyboard) {
                this._keyboard.setKeyColor(check, "#FFC0C0");
            }
        }
        if (this._elementID) {            
            this.element.innerText = this._guessed;
        }
        if (this.isSolved()) {
            alert("Das Wort wurde mit " + this._fails + " Fehlversuchen gelöst!");
        }
    }
}
