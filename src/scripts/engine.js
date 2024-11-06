const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },

    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
        cardBox: document.querySelector(".card_details"),
    },

    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },

    playerSides: {
        player1: "player-cards",
        player1BOX: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBOX: document.querySelector("#computer-cards")
    },

    actions: {
        button: document.getElementById("next-duel"),
    },
};

const path = "./src/assets/icons/"
const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${path}dragon.png`,
        WinOf: [1],
        LoseOf: [2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${path}magician.png`,
        WinOf: [2],
        LoseOf: [0],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${path}exodia.png`,
        WinOf: [0],
        LoseOf: [1],
    },
];

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
};

async function creatCardImage(idCard, fieldSide) {
    let cardImage;

    if (fieldSide === state.playerSides.player1) {
        cardImage = document.createElement("img");
        cardImage.setAttribute("src", `${cardData[idCard].img}`);
        cardImage.setAttribute("height", "100px");
        cardImage.setAttribute("data-id", idCard);
        cardImage.classList.add("card");

        cardImage.addEventListener("click", () => {
            setCardField(cardImage.getAttribute("data-id"));
        });

        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(idCard);
        });
    } else if (fieldSide === state.playerSides.computer) {
        cardImage = document.createElement("img");
        cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
        cardImage.setAttribute("height", "100px");
        cardImage.setAttribute("data-id", idCard);
        cardImage.classList.add("card");
    }

    return cardImage;
};

async function setCardField(cardId) {
    removeAllCardsImages();
    let computerCardId = await getRandomCardId();

    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";

    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
};

async function drawButton(text) {
    state.actions.button.innerText = text;
    state.actions.button.style.display = "block";
}

async function updateScore() {
    state.score.scoreBox.innerText = `WIn: ${state.score.playerScore} | Lose: ${state.score.computerScore}`
}

async function checkDuelResults(playerCardId, ComputerCardId) {
    let duelResults = "draw";
    let playerCard = cardData[playerCardId];

    if (playerCard.WinOf == ComputerCardId) {
        duelResults = "win";
        playAudio(duelResults);
        state.score.playerScore++;
    }

    if (playerCard.LoseOf == ComputerCardId) {
        duelResults = "lose";
        playAudio(duelResults);
        state.score.computerScore++;
    }

    return duelResults;
};

async function removeAllCardsImages() {
    let { computerBOX, player1BOX } = state.playerSides;
    let imgElements = computerBOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    imgElements = player1BOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    state.cardSprites.avatar.style.display = "none";
    state.cardSprites.cardBox.style.display = "none";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
}

async function drawSelectCard(index) {
    state.cardSprites.avatar.style.display = "block";
    state.cardSprites.cardBox.style.display = "flex";

    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Atribute : " + cardData[index].type;
};

async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId()
        const cardImage = await creatCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    };
};

async function resetDuel() {
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";
    state.actions.button.style.display = "none";

    state.fieldCards.player.src = "";
    state.fieldCards.computer.src = "";

    main();
}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();
}

function main() {
    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);

    const bgm = document.getElementById("bgm");
    bgm.volume = 0.4;
    bgm.play();
};

main();