/**
 * Ein Hangman-Spiel
 */
const MASK_CHARACTER = "_";

/**
 * Eine Klasse zur Darstellung einer On-Screen-Tastatur
 */
class Keyboard {

    /**
     * Erstellt eine On-Screen-Tastatur
     * @param {string} elementID - Die ID des zugeordneten DOM-Elements
     */
    constructor(elementID) {
        this._rows = [
            "QWERTZUIOP",
            "ASDFGHJKL",
            "YXCVBNM"
        ];
        this._elementID = elementID;
    }

    /**
     * Das zugeordnete DOM-Element.
     * @type {object} 
     */
    get element() {
        return document.getElementById(this._elementID);
    }

    /**
     * Erstellt eine HTML-Repräsentation einer kleinen Tastatur
     * @returns {string} Ein Div-Tag mit der Visualisierung der Tastatur
     */
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

    /**
     * Erssetzt den innertHTML-Bereich des zugeordneten DOM-Elements mit
     * der HTML-Repräsentation der Tastatur
     */
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

    /**
     * Erstellt einen HangmanText
     * @param {string} elementID - Die ID des zugeordneten DOM-Elements
     */
    constructor(elementID = false) {
        this._text = "";
        this._guessed = "";
        this.connect(elementID);
    }

    /**
     * Der zu erratende Text
     * @type {string}
     */
    get text() {
        return this._text;
    }

    set text(text) {
        this._text = text;
        this.reset();
    }

    /**
     * Der bisher erratene Text. Noch nicht erratene Zeichen sind durch
     * das MASK_CHARACTER ersetzt.
     * @type {string}
     */
    get guessed() {
        return this._guessed;
    }

    /**
     * Das zugeordnete DOM-Element.
     * @type {object} 
     */
    get element() {
        return document.getElementById(this._elementID);
    }

    /**
     * Verbindet den HangmanText mit einem DOM-Element
     * @param {string} elementID - Die ID des zugeordneten DOM-Elements
     */
    connect(elementID) {
        this._elementID = elementID;
    }

    /**
     * Setzt den Ratetext und die Anzahl der (Fehl)Versuche auf den Ausgangszustand zurück.
     */
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

    /**
     * Der Lösungzustand des Ratetexts
     * @returns {boolean} Liefert true, wenn das Rätsel gelöst ist.
     */
    isSolved() {
        return this._guessed.indexOf(MASK_CHARACTER) < 0;
    }

    /**
     * Verbindet den Ratetext mit einen On-Screen-Keyboard, das die 
     * Eingaben für die geratenen Buchstaben liefert
     * @param {Keyboard} keyboard - Die Instanz einer On-Screen-Tastatur
     */
    registerKeyboard(keyboard) {
        this._keyboard = keyboard;
        keyboard.element.addEventListener("click", ev => this.onClick(ev));
    }

    /**
     * EventListener für Klicks auf die zugeordnete On-Screen-Tastatur
     * @param {Event} ev - Das auslösende Click-Event
     */
    onClick(ev) {
        if (ev.target.id) {
            this.guess(ev.target.id);
        }
    }

    /**
     * Prüft einen Rateversuch. Der Vergleich ignoriert Groß-/Kleinschreibung
     * @param {string} char - Das zu prüfende Zeichen
     */
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
        if (!found) {
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
