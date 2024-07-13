document.addEventListener("DOMContentLoaded", function() {
    const burgerMenu = document.getElementById('burger-menu');
    const sidebar = document.getElementById('sidebar');
    const closeBtn = document.getElementById('close-btn');
    const exerciseText = document.getElementById('exercise-text');
    const exerciseInstructions = document.getElementById('exercise-instructions');
    const stopExerciseBtn = document.getElementById('stop-exercise');
    const changeExerciseBtn = document.getElementById('change-exercise');
    const feedbackContainer = document.getElementById('feedback-container');
    const emojis = document.querySelectorAll('#emoji-feedback .emoji');
    const stars = document.querySelectorAll('#star-rating i');
    const breathingCircle = document.getElementById('breathing-circle');
    const timerDisplay = document.getElementById('timer-display');
    const startTimerBtn = document.getElementById('start-timer');
    const resetTimerBtn = document.getElementById('reset-timer');
    const downloadBtn = document.getElementById('download');
    const fileFormat = document.getElementById('file-format');
    let currentExercise = '4-7-8';
    let timeline;
    let timerInterval;

    const exercises = {
        '4-7-8': {
            instructions: 'Breathe in for 4 seconds, hold for 7 seconds, breathe out for 8 seconds.',
            animation: () => {
                timeline = gsap.timeline({repeat: -1});
                timeline.to(breathingCircle, {scale: 1.5, duration: 4, ease: "power1.inOut", onStart: () => exerciseText.innerText = "Breathe In"})
                        .to(breathingCircle, {scale: 1, duration: 7, ease: "power1.inOut", onStart: () => exerciseText.innerText = "Hold"})
                        .to(breathingCircle, {scale: 0.5, duration: 8, ease: "power1.inOut", onStart: () => exerciseText.innerText = "Breathe Out"});
            }
        },
        'box-breathing': {
            instructions: 'Breathe in for 4 seconds, hold for 4 seconds, breathe out for 4 seconds, hold for 4 seconds.',
            animation: () => {
                timeline = gsap.timeline({repeat: -1});
                timeline.to(breathingCircle, {scale: 1.5, duration: 4, ease: "power1.inOut", onStart: () => exerciseText.innerText = "Breathe In"})
                        .to(breathingCircle, {scale: 1, duration: 4, ease: "power1.inOut", onStart: () => exerciseText.innerText = "Hold"})
                        .to(breathingCircle, {scale: 0.5, duration: 4, ease: "power1.inOut", onStart: () => exerciseText.innerText = "Breathe Out"})
                        .to(breathingCircle, {scale: 1, duration: 4, ease: "power1.inOut", onStart: () => exerciseText.innerText = "Hold"});
            }
        },
        'simple-body': {
            instructions: 'Stand up, stretch your arms above your head for 5 seconds, and then slowly bend to touch your toes.',
            animation: () => {
                if (timeline) {
                    timeline.kill();
                }
                timeline = gsap.timeline({repeat: -1});
                timeline.to(exerciseText, {text: "Stretch Up", duration: 5, ease: "power1.inOut"})
                        .to(exerciseText, {text: "Bend Down", duration: 5, ease: "power1.inOut"});
            }
        }
    };

    // Burger menu functionality
    burgerMenu.addEventListener('click', function() {
        burgerMenu.classList.toggle('open');
        if (sidebar.style.right === "0px") {
            sidebar.style.right = "-100%";
        } else {
            sidebar.style.right = "0px";
        }
    });

    // Close button functionality
    closeBtn.addEventListener('click', function() {
        sidebar.style.right = "-100%";
        burgerMenu.classList.remove('open');
    });

    // Start exercise
    const startExercise = (exercise) => {
        if (timeline) {
            timeline.kill();
        }
        feedbackContainer.style.display = 'none';
        exerciseInstructions.innerText = exercises[exercise].instructions;
        breathingCircle.classList.remove('hidden');
        exercises[exercise].animation();
    };

    startExercise(currentExercise);

    // Stop exercise
    stopExerciseBtn.addEventListener('click', () => {
        if (timeline) {
            timeline.kill();
        }
        feedbackContainer.style.display = 'block';
    });

    // Change exercise
    changeExerciseBtn.addEventListener('click', () => {
        currentExercise = currentExercise === '4-7-8' ? (currentExercise === 'box-breathing' ? 'simple-body' : 'box-breathing') : '4-7-8';
        startExercise(currentExercise);
    });

    // Emoji feedback
    emojis.forEach(emoji => {
        emoji.addEventListener('click', () => {
            if (emoji.id === 'emoji-happy') {
                startExercise(currentExercise);
            } else {
                changeExerciseBtn.click();
            }
        });
    });

    // Star rating feedback
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = star.getAttribute('data-rating');
            stars.forEach(s => s.classList.remove('selected'));
            star.classList.add('selected');
            if (rating >= 4) {
                startExercise(currentExercise);
            } else {
                changeExerciseBtn.click();
            }
        });
    });

    // Mindfulness Timer
    const startTimer = (duration) => {
        let timer = duration * 60, minutes, seconds;
        timerInterval = setInterval(() => {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            timerDisplay.textContent = minutes + ":" + seconds;

            if (--timer < 0) {
                clearInterval(timerInterval);
                timerDisplay.textContent = "00:00";
                alert("Time's up! Take a moment to reflect on your mindfulness practice.");
            }
        }, 1000);
    };

    startTimerBtn.addEventListener('click', () => {
        const duration = parseInt(document.getElementById('timer-duration').value);
        if (!isNaN(duration) && duration > 0) {
            clearInterval(timerInterval);
            startTimer(duration);
        } else {
            alert("Please enter a valid duration in minutes.");
        }
    });

    resetTimerBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        timerDisplay.textContent = "00:00";
    });

    // Drawing board functionality
    const canvas = document.getElementById('drawing-board');
    const ctx = canvas.getContext('2d');
    let painting = false;
    let brushSize = 5;
    let brushColor = '#ff6f61';

    const startPosition = (e) => {
        painting = true;
        draw(e);
    };

    const endPosition = () => {
        painting = false;
        ctx.beginPath();
    };

    const getMousePos = (canvas, evt) => {
        const rect = canvas.getBoundingClientRect();
        return {
            x: (evt.clientX - rect.left) * (canvas.width / rect.width),
            y: (evt.clientY - rect.top) * (canvas.height / rect.height)
        };
    };

    const draw = (e) => {
        if (!painting) return;

        // Get the canvas coordinates
        const pos = getMousePos(canvas, e);

        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.strokeStyle = brushColor;

        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    };

    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', endPosition);
    canvas.addEventListener('mousemove', draw);

    document.getElementById('free-drawing').addEventListener('click', () => {
        brushColor = document.getElementById('color-picker').value;
    });

    document.getElementById('color-filling').addEventListener('click', () => {
        // Add color filling functionality
    });

    document.getElementById('eraser').addEventListener('click', () => {
        brushColor = '#ffffff'; // Set to canvas background color
    });

    document.getElementById('color-picker').addEventListener('input', (e) => {
        brushColor = e.target.value;
    });

    document.getElementById('brush-size').addEventListener('input', (e) => {
        brushSize = e.target.value;
    });

    document.getElementById('clear-board').addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    downloadBtn.addEventListener('click', () => {
        const format = fileFormat.value;
        const link = document.createElement('a');
        
        if (format === 'png' || format === 'jpg') {
            link.href = canvas.toDataURL(`image/${format}`);
            link.download = `drawing.${format}`;
        } else if (format === 'pdf') {
            const pdf = new jsPDF();
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
            link.href = pdf.output('bloburl');
            link.download = 'drawing.pdf';
        }
        
        link.click();
    });

    // Touch support for mobile devices
    canvas.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    });

    canvas.addEventListener('touchend', (e) => {
        const mouseEvent = new MouseEvent('mouseup', {});
        canvas.dispatchEvent(mouseEvent);
    });

    canvas.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    });
});
