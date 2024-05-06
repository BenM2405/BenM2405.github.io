document.addEventListener('DOMContentLoaded', function () {
    const boxes = document.querySelectorAll('.mystery-box');

    boxes.forEach(function (box) {
        box.addEventListener('click', function () {
            enlargeBox(box);
            showNextPetImage(box);
        });
    });

    function enlargeBox(box) {
        box.style.width = '500px';
        box.style.height = '500px';
        box.style.margin = '0 auto';

    }

    function showNextPetImage(clickedBox) {
        const petImageUrls = ['sprites/robo.png', 'sprites/baby.png', 'sprites/slime.png'];
        let chosenPet = '';
        //Hide
        boxes.forEach(function (box) {
            if (box !== clickedBox) {
                box.style.display = 'none';
            }
        });

        const randomIndex = Math.floor(Math.random() * petImageUrls.length);
        const nextPetImageUrl = petImageUrls[randomIndex];

        chosenPet = nextPetImageUrl;

        setTimeout(function () {
            clickedBox.innerHTML = `<img src="${nextPetImageUrl}" alt="Pet">`;
        }, 1000); // Change this timeout according to your needs
    }
});