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


    const delay = Math.floor(Math.random() * (5000 - 3000 + 1)) + 3000;

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
        const randomIndex = Math.floor(Math.random() * answers.length);
        const answer = answers[randomIndex];
        document.getElementById("answer").innerText = answer;
    }, delay);

    document.getElementById("question").value = "";
}