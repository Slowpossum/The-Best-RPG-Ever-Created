$(document).ready(function () {
    var rpgGame = {
        gameState: "noCharacter",
        enemies: [],
        playerCharacter: {},
        currentEnemy: {},
        characters: {
            sausageNinja: {
                name: "Sausage Ninja",
                id: "sausageNinja",
                health: 120,
                attack: 8
            },
            fishAssassin: {
                name: "Fish Assassin",
                id: "fishAssassin",
                health: 100,
                attack: 5
            },
            broccoliContemplator: {
                name: "Broccoli Contemplator",
                id: "broccoliContemplator",
                health: 150,
                attack: 20
            },
            lemonAbomination: {
                name: "Lemon Abomination",
                id: "lemonAbomination",
                health: 180,
                attack: 25
            }
        },
        loadGame: function () {
            $("#reset").hide();

            for (var character in this.characters) {
                makeButton(this.characters[character]);
            }

            $(".characterPortrait").on("click", portraitClick);
        },
        clearText: function () {
            $("#damageDealt").text("");
            $("#damageReceived").text("");
        },
        checkState: function () {
            if (this.playerCharacter.health <= 0) {
                this.gameState = "lose";
                this.clearText();
                $("#damageDealt").text("You have been defeated... GAME OVER!!!");
                $("#reset").show();
            } else if (this.currentEnemy.health <= 0) {
                this.clearText();
                $("#damageDealt").text(`You have defeated ${this.currentEnemy.name}, you can choose to fight another enemy.`);

                this.enemies.splice(this.enemies.indexOf(this.currentEnemy.id), 1);
                this.gameState = "noCurrEnemy";
                $(`#${this.currentEnemy.id}`).remove();
                this.currentEnemy = {};
            }

            if (this.enemies.length === 0 && this.gameState !== "noCharacter") {
                this.gameState = "win";
                this.clearText();
                $("#damageDealt").text("You Won!!!! GAME OVER!!!");
                $("#reset").show();
            }
        },
        resetAll: function () {
            this.gameState = "noCharacter";
            this.playerCharacter = {};
            this.currentEnemy = {};
            $("#enemiesToAttack").html("");
            $("#yourCharacter").html("");
            $("#defender").html("");
            this.clearText();
            this.loadGame();
        }
    };

    $("#attack").on("click", function () {
        if (rpgGame.gameState === "fighting") {
            var enemy = rpgGame.currentEnemy.name;
            var theirDamage = rpgGame.currentEnemy.attack;
            var yourDamage = rpgGame.playerCharacter.attack;

            $("#damageDealt").text(`You attacked ${enemy} for ${yourDamage} damage.`);
            $("#damageReceived").text(`${enemy} attacked you for ${theirDamage} damage.`);

            rpgGame.currentEnemy.health -= yourDamage;
            rpgGame.playerCharacter.attack += rpgGame.playerCharacter.baseAttack;
            if (rpgGame.currentEnemy.health > 0) {
                rpgGame.playerCharacter.health -= theirDamage;
            }

            $(`#${rpgGame.playerCharacter.id} h6:eq(1)`).text(rpgGame.playerCharacter.health);
            $(`#${rpgGame.currentEnemy.id} h6:eq(1)`).text(rpgGame.currentEnemy.health);
        } else if (rpgGame.gameState !== "win" && rpgGame.gameState !== "lose") {
            $("#damageDealt").text("No enemy here.");
        }

        rpgGame.checkState();
    });

    $("#reset").on("click", function () {
        rpgGame.resetAll();
    });

    function portraitClick() {
        if (rpgGame.gameState === "noCharacter") {
            var i = 0;
            rpgGame.clearText();

            rpgGame.playerCharacter.name = rpgGame.characters[$(this).attr("id")].name;
            rpgGame.playerCharacter.id = rpgGame.characters[$(this).attr("id")].id;
            rpgGame.playerCharacter.health = rpgGame.characters[$(this).attr("id")].health;
            rpgGame.playerCharacter.attack = rpgGame.characters[$(this).attr("id")].attack;
            rpgGame.playerCharacter.baseAttack = rpgGame.playerCharacter.attack;

            for (var character in rpgGame.characters) {
                var currCharacter = $(`#${character}`);

                if (character !== rpgGame.playerCharacter.id) {
                    currCharacter.css("background", "red");
                    currCharacter.detach();
                    currCharacter.appendTo("#enemiesToAttack");
                    rpgGame.enemies[i] = character;
                    i++;
                } else {
                    currCharacter.detach();
                    currCharacter.appendTo("#yourCharacter");
                }
            }

            rpgGame.gameState = "noCurrEnemy";
        } else if (rpgGame.gameState === "noCurrEnemy" && $(this).attr("id") !== rpgGame.playerCharacter.id) {
            var currCharacter = $(`#${$(this).attr("id")}`);

            rpgGame.clearText();

            rpgGame.currentEnemy.name = rpgGame.characters[$(this).attr("id")].name;
            rpgGame.currentEnemy.id = rpgGame.characters[$(this).attr("id")].id;
            rpgGame.currentEnemy.health = rpgGame.characters[$(this).attr("id")].health;
            rpgGame.currentEnemy.attack = rpgGame.characters[$(this).attr("id")].attack;

            currCharacter.css("color", "white");
            currCharacter.css("background", "black");
            currCharacter.detach();
            currCharacter.appendTo("#defender");

            rpgGame.gameState = "fighting";
        }
    }

    function makeButton(character) {
        var characterDiv = $(`<div id="${character.id}" class="characterPortrait"></div>`);
        var characterName = $(`<h6 class="noMargin">${character.name}</h6>`);
        var characterPortrait = $(`<img class="portraitImage" src="./assets/images/${character.id}.jpg"></img>`);
        var characterHealth = $(`<h6 class="noMargin">${character.health}</h6>`);

        characterDiv.append(characterName);
        characterDiv.append(characterPortrait);
        characterDiv.append(characterHealth);

        $("#characters").append(characterDiv);
    }

    rpgGame.loadGame();
});