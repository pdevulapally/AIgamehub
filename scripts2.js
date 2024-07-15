document.addEventListener("DOMContentLoaded", function() {
    console.log("DOMContentLoaded event fired");
    const canvas = document.getElementById("emulator-canvas");

    if (!canvas) {
        console.error("Canvas element not found");
        return;
    }

    console.log("Initializing DOSBox");
    Dos(canvas, {
        wdosboxUrl: "https://js-dos.com/v7/build/wdosbox.js",
    }).ready((fs, main) => {
        console.log("DOSBox ready");

        // Mount the current directory as the C drive
        fs.createFolder("/", "C");

        // Load the game executable
        fetch("PPJ2DD.EXE").then(response => response.arrayBuffer()).then(data => {
            fs.createFile("/C/PPJ2DD.EXE", new Uint8Array(data));
            console.log("PPJ2DD.EXE loaded");

            // Start the game
            main(["-c", "C:\\PPJ2DD.EXE"]);
        }).catch((error) => {
            console.error("Error loading PPJ2DD.EXE:", error);
        });
    }).catch((error) => {
        console.error("Error initializing DOSBox:", error);
    });
});
