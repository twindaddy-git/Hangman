/**
 * Ein Hangman-Spiel
 * @version 0.1
 * @author Markus Steffl
 */
const MASK_CHARACTER = "_";
const SHOW_GUESSES_DEFAULT = true;
const COLOR_SUCCESS = "#C0FFC0";
const COLOR_FAIL = "#FFC0C0";

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
        var result = '<div class="keyboard">';
        for (var i = 0; i < this._rows.length; i++) {
            result += '<table class="keyboard"><tr class="kbrow">';
            for (var j = 0; j < this._rows[i].length; j++) {
                result += '<td id="' + this._rows[i][j] + '">' + this._rows[i][j] + '</td>';
            }
            result += "</table></tr>";
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
        this._keyboard = false;
        this.connect(elementID);
        this.showGuesses = SHOW_GUESSES_DEFAULT;
    }

    /**
     * Der zu erratende Text
     * @type {string}
     */
    get text() {
        return this._text;
    }

    set text(newText) {
        this._text = newText;
        this.reset();
    }

    /**
     * Einstellung, ob die bisher geratenen Versuche angezeigt werden sollen
     * @type {boolean}
     */
    get showGuesses() {
        return this._showGuesses;
    }

    set showGuesses(newValue) {
        this._showGuesses = newValue;
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
        if (this._keyboard) {
            this._keyboard.render();
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
     * @type {Keyboard}
     */
    get keyboard() {
        return this._keyboard;
    }
    
    set keyboard(newKeyboard) {
        this._keyboard = newKeyboard;
        newKeyboard.element.addEventListener("click", ev => this.onClick(ev));
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
        }
        if (this._keyboard && this.showGuesses) {
            this._keyboard.setKeyColor(check, found ? COLOR_SUCCESS : COLOR_FAIL);
        }
        if (this._elementID) {
            this.element.innerText = this._guessed;
        }
        if (this.isSolved()) {
            alert("Das Wort wurde mit " + this._fails + " Fehlversuchen gelöst!");
        }
    }
}
