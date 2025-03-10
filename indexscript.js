document.addEventListener("DOMContentLoaded", function () {
    const starContainer = document.querySelector(".star-container");
    const numStars = 100; // Adjust for more or fewer stars

    for (let i = 0; i < numStars; i++) {
        let star = document.createElement("div");
        star.classList.add("star");

        // Random positioning
        let x = Math.random() * window.innerWidth;
        let y = Math.random() * window.innerHeight;
        let size = Math.random() * 3 + 1; // Random size between 1px and 4px
        let duration = Math.random() * 3 + 2; // Random twinkle duration

        // Apply styles
        star.style.left = `${x}px`;
        star.style.top = `${y}px`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.animationDuration = `${duration}s`;
        star.style.animationDelay = `${Math.random() * 5}s`; // Random start time

        starContainer.appendChild(star);
    }
});