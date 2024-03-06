function shakeMagic8Ball() {
    const answers = [
        "It is certain.",
        "It is decidedly so.",
        "Without a doubt.",
        "Yes - definitely.",
        "You may rely on it.",
        "As I see it, yes.",
        "Most likely.",
        "Outlook good.",
        "Yes.",
        "Signs point to yes.",
        "Reply hazy, try again.",
        "Ask again later.",
        "Better not tell you now.",
        "Cannot predict now.",
        "Concentrate and ask again.",
        "Don't count on it.",
        "My reply is no.",
        "My sources say no.",
        "Outlook not so good.",
        "Very doubtful."
    ];

    const question = document.getElementById("question").value.trim();
    if (question === "") {
        document.getElementById("answer").innerText = "You didn't ask anything.";
        return; 
    }

    const magicBall = document.querySelector(".magic-ball img");
    magicBall.classList.add("shake-animation");

    const delay = Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000;
    const intervalId = setInterval(() => {
        const currentDots = document.getElementById("answer").innerText;
        if (currentDots.length >= 3) {
            document.getElementById("answer").innerText = ".";
        } else {
            document.getElementById("answer").innerText += ".";
        }
    }, 500);

    setTimeout(() => {
        clearInterval(intervalId);
        magicBall.classList.remove("shake-animation");
        const randomIndex = Math.floor(Math.random() * answers.length);
        const answer = answers[randomIndex];
        document.getElementById("answer").innerText = answer;
    }, delay);

    document.getElementById("question").value = "";
}