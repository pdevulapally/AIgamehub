document.addEventListener("DOMContentLoaded", function () {
    let currentFontSize = 1;
    const accessibilityMenu = document.getElementById("accessibilityMenu");
    const accessibilityToggle = document.getElementById("accessibilityToggle");
    const burgerMenu = document.getElementById("burgerMenu");
    const navList = document.getElementById("navList");

    function increaseFontSize() {
        currentFontSize += 0.1;
        document.body.style.fontSize = currentFontSize + "em";
    }

    function decreaseFontSize() {
        currentFontSize -= 0.1;
        document.body.style.fontSize = currentFontSize + "em";
    }

    function toggleHighContrast() {
        document.body.classList.add("high-contrast");
    }

    function toggleNormalView() {
        document.body.classList.remove("high-contrast");
    }

    function toggleColorBlindMode() {
        document.body.classList.toggle("color-blind-mode");
    }

    accessibilityToggle.addEventListener("click", function () {
        accessibilityMenu.classList.toggle("show");
    });

    document.getElementById("increaseFont").addEventListener("click", increaseFontSize);
    document.getElementById("decreaseFont").addEventListener("click", decreaseFontSize);
    document.getElementById("highContrast").addEventListener("click", toggleHighContrast);
    document.getElementById("normalView").addEventListener("click", toggleNormalView);
    document.getElementById("colorBlind").addEventListener("click", toggleColorBlindMode);

    burgerMenu.addEventListener("click", function () {
        burgerMenu.classList.toggle("active");
        navList.classList.toggle("show");
    });
});


