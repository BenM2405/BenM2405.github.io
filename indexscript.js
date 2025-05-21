document.addEventListener("DOMContentLoaded", function () {
    const starContainer = document.querySelector(".star-container");
    const numStars = 100;

    for (let i = 0; i < numStars; i++) {
        let star = document.createElement("div");
        star.classList.add("star");


        let x = Math.random() * window.innerWidth;
        let y = Math.random() * window.innerHeight;
        let size = Math.random() * 3 + 1; 
        let duration = Math.random() * 3 + 2;


        star.style.left = `${x}px`;
        star.style.top = `${y}px`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.animationDuration = `${duration}s`;
        star.style.animationDelay = `${Math.random() * 5}s`;

        starContainer.appendChild(star);
    }
});

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = scrollTop / docHeight;

    const colorTop = [15,15,15];
    const colorMid = [30, 40, 64];
    const colorBottom = [26, 45, 92];

    let color;
    if (scrollPercent < 0.5) {
        color = interpolateColor(colorTop, colorMid, scrollPercent * 2);
    } else {
        color = interpolateColor(colorMid, colorBottom, (scrollPercent-0.5) * 2);
    }
    document.body.style.backgroundColor = `rgb(${color.join(',')})`;
});

function interpolateColor(color1, color2, factor) {
    return color1.map((c, i) => Math.round(c + (color2[i] - c) * factor));
}