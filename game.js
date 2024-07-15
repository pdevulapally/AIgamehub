document.addEventListener("DOMContentLoaded", function() {
    const storyElement = document.getElementById('story');
    const choicesElement = document.getElementById('choices');
    const endingElement = document.getElementById('ending');
    
    // Sound effect for typing
    const typingSound = new Audio('typing-sound.mp3'); // Ensure this path is correct

    // Function to type out text with typing sound
    function typeText(element, text, callback) {
        let index = 0;
        element.innerHTML = '';

        function typeChar() {
            if (index < text.length) {
                element.innerHTML += text.charAt(index);
                typingSound.play();
                index++;
                setTimeout(typeChar, 50); // Adjust typing speed here
            } else if (callback) {
                callback();
            }
        }
        typeChar();
    }

    const stories = {
        start: {
            text: "Welcome to the Breaking Bad game! You are Walter White, a high school chemistry teacher turned methamphetamine manufacturer. What will you do?",
            choices: [
                { text: "Start Cooking", next: 'startCooking' },
                { text: "Avoid Crime", next: 'avoidCrime' }
            ]
        },
        startCooking: {
            text: "You start cooking meth with your former student, Jesse Pinkman. As your operation grows, so does the danger. Do you continue?",
            choices: [
                { text: "Continue Cooking", next: 'continueCooking' },
                { text: "Stop Cooking", next: 'stopCooking' }
            ]
        },
        avoidCrime: {
            text: "You avoid the life of crime and try to make ends meet with your teaching salary. Life is tough, but you have your integrity. Do you reconsider?",
            choices: [
                { text: "Reconsider Cooking", next: 'startCooking' },
                { text: "Look for Another Job", next: 'lookForJob' }
            ]
        },
        continueCooking: {
            text: "Your meth empire expands, but so do the risks. The DEA is on your trail. Do you lay low or confront them?",
            choices: [
                { text: "Lay Low", next: 'layLow' },
                { text: "Confront DEA", next: 'confrontDEA' }
            ]
        },
        stopCooking: {
            text: "You stop cooking meth and try to live a normal life, but the memories and dangers linger. Can you truly escape your past?",
            choices: [
                { text: "Escape to a New Life", next: 'newLife' },
                { text: "Face the Consequences", next: 'faceConsequences' }
            ]
        },
        layLow: {
            text: "You lay low, but the pressure is immense. Eventually, the DEA catches up to you. Do you try to escape or turn yourself in?",
            choices: [
                { text: "Try to Escape", next: 'tryToEscape' },
                { text: "Turn Yourself In", next: 'turnIn' }
            ]
        },
        confrontDEA: {
            text: "You confront the DEA in a dramatic showdown. The confrontation is intense. Do you surrender or fight back?",
            choices: [
                { text: "Surrender", next: 'surrender' },
                { text: "Fight Back", next: 'fightBack' }
            ]
        },
        newLife: {
            text: "You manage to escape and start a new life. However, you're always looking over your shoulder. Do you stay hidden or return?",
            choices: [
                { text: "Stay Hidden", next: 'stayHidden' },
                { text: "Return", next: 'return' }
            ]
        },
        faceConsequences: {
            text: "You face the consequences of your actions and accept your fate. Do you cooperate with the authorities or stay silent?",
            choices: [
                { text: "Cooperate", next: 'cooperate' },
                { text: "Stay Silent", next: 'staySilent' }
            ]
        },
        tryToEscape: {
            text: "You attempt to escape, but it's risky. Do you flee the country or hide locally?",
            choices: [
                { text: "Flee the Country", next: 'fleeCountry' },
                { text: "Hide Locally", next: 'hideLocally' }
            ]
        },
        turnIn: {
            text: "You turn yourself in and cooperate with the DEA. Your information helps them, but you still face prison time.",
            choices: [],
            ending: "Game Over: In Prison"
        },
        surrender: {
            text: "You surrender to the DEA and are taken into custody. Your cooperation leads to a reduced sentence.",
            choices: [],
            ending: "Game Over: Reduced Sentence"
        },
        fightBack: {
            text: "You fight back against the DEA, leading to a deadly confrontation. Your story ends in tragedy.",
            choices: [],
            ending: "Game Over: Tragic End"
        },
        stayHidden: {
            text: "You remain hidden, living a life of constant fear and paranoia. It's a lonely existence.",
            choices: [],
            ending: "Game Over: Lonely Existence"
        },
        return: {
            text: "You return to face your past. The DEA arrests you, but you find some peace in owning up to your actions.",
            choices: [],
            ending: "Game Over: Peaceful Arrest"
        },
        cooperate: {
            text: "You cooperate with the authorities and help dismantle the drug network. Your sentence is reduced, but you're in witness protection.",
            choices: [],
            ending: "Game Over: Witness Protection"
        },
        staySilent: {
            text: "You stay silent, protecting others involved but facing a long prison sentence.",
            choices: [],
            ending: "Game Over: Long Sentence"
        },
        fleeCountry: {
            text: "You flee the country, starting a new life abroad. However, you're constantly on the run.",
            choices: [],
            ending: "Game Over: Life on the Run"
        },
        hideLocally: {
            text: "You hide locally, but the DEA is closing in. Do you try to leave again or confront them?",
            choices: [
                { text: "Try to Leave Again", next: 'tryToLeaveAgain' },
                { text: "Confront Them", next: 'finalConfrontation' }
            ]
        },
        tryToLeaveAgain: {
            text: "You attempt to leave again, but resources are scarce. Do you seek help from an old friend or go solo?",
            choices: [
                { text: "Seek Help", next: 'seekHelp' },
                { text: "Go Solo", next: 'goSolo' }
            ]
        },
        finalConfrontation: {
            text: "You confront the DEA for a final time. It's a high-stakes situation. Do you negotiate or fight?",
            choices: [
                { text: "Negotiate", next: 'negotiate' },
                { text: "Fight", next: 'fightFinal' }
            ]
        },
        seekHelp: {
            text: "You seek help from an old friend who agrees to assist. Do you trust them completely or stay cautious?",
            choices: [
                { text: "Trust Them", next: 'trustFriend' },
                { text: "Stay Cautious", next: 'cautious' }
            ]
        },
        goSolo: {
            text: "You decide to go solo, facing immense challenges. Do you find a safe place or keep moving?",
            choices: [
                { text: "Find Safe Place", next: 'safePlace' },
                { text: "Keep Moving", next: 'keepMoving' }
            ]
        },
        negotiate: {
            text: "You negotiate with the DEA, revealing critical information. Your life changes, but you're under their watch.",
            choices: [],
            ending: "Game Over: Under Watch"
        },
        fightFinal: {
            text: "In the final fight with the DEA, the outcome is dire. You lose everything.",
            choices: [],
            ending: "Game Over: Total Loss"
        },
        trustFriend: {
            text: "Trusting your friend proves beneficial. Together, you manage to evade the DEA for a while.",
            choices: [
                { text: "Stay Together", next: 'stayTogether' },
                { text: "Part Ways", next: 'partWays' }
            ]
        },
        cautious: {
            text: "Your caution pays off as you detect a potential betrayal. Do you confront your friend or leave?",
            choices: [
                { text: "Confront Friend", next: 'confrontFriend' },
                { text: "Leave", next: 'leave' }
            ]
        },
        safePlace: {
            text: "You find a safe place, but it's temporary. Do you reinforce your hideout or prepare to move?",
            choices: [
                { text: "Reinforce Hideout", next: 'reinforce' },
                { text: "Prepare to Move", next: 'prepareMove' }
            ]
        },
        keepMoving: {
            text: "You keep moving, always a step ahead of the DEA. Your life is a constant chase.",
            choices: [],
            ending: "Game Over: Constant Chase"
        },
        stayTogether: {
            text: "Staying together provides some security, but it also doubles the risk. Do you split up to cover more ground?",
            choices: [
                { text: "Split Up", next: 'splitUp' },
                { text: "Stay United", next: 'stayUnited' }
            ]
        },
        partWays: {
            text: "Parting ways means less risk of detection, but more loneliness. Do you seek new allies or remain alone?",
            choices: [
                { text: "Seek Allies", next: 'seekAllies' },
                { text: "Remain Alone", next: 'remainAlone' }
            ]
        },
        confrontFriend: {
            text: "Confronting your friend reveals their true intentions. You have a chance to set things right or let them go.",
            choices: [
                { text: "Set Things Right", next: 'setRight' },
                { text: "Let Them Go", next: 'letGo' }
            ]
        },
        leave: {
            text: "You leave immediately, trusting no one. The road is tough, but you survive another day.",
            choices: [],
            ending: "Game Over: Lone Survivor"
        },
        reinforce: {
            text: "You reinforce your hideout, making it harder for the DEA to find you. It's a temporary solution.",
            choices: [],
            ending: "Game Over: Temporary Safety"
        },
        prepareMove: {
            text: "Preparing to move keeps you ready for any situation. You remain on the run, but adaptable.",
            choices: [],
            ending: "Game Over: Adaptable Fugitive"
        },
        splitUp: {
            text: "Splitting up helps you cover more ground, but it also means you're on your own again.",
            choices: [],
            ending: "Game Over: On Your Own"
        },
        stayUnited: {
            text: "Staying united makes you stronger. You continue to evade the DEA together.",
            choices: [],
            ending: "Game Over: Stronger Together"
        },
        seekAllies: {
            text: "Seeking new allies helps you build a network. However, trust is a rare commodity.",
            choices: [],
            ending: "Game Over: Network Builder"
        },
        remainAlone: {
            text: "Remaining alone is a tough choice, but it keeps you focused and undistracted.",
            choices: [],
            ending: "Game Over: Focused Fugitive"
        },
        setRight: {
            text: "Setting things right with your friend helps you gain an unexpected ally. You both work together to stay hidden.",
            choices: [],
            ending: "Game Over: Unexpected Ally"
        },
        letGo: {
            text: "Letting them go means fewer ties and fewer risks. You continue your journey alone.",
            choices: [],
            ending: "Game Over: Solo Journey"
        }
    };

    function showStory(storyKey) {
        const story = stories[storyKey];
        typeText(storyElement, story.text, function() {
            if (story.choices && story.choices.length > 0) {
                choicesElement.innerHTML = '';
                story.choices.forEach(choice => {
                    const button = document.createElement('button');
                    button.innerText = choice.text;
                    button.classList.add('choice-button');
                    button.onclick = function() {
                        showStory(choice.next);
                    };
                    choicesElement.appendChild(button);
                });
            } else {
                endingElement.innerText = story.ending;
            }
        });
    }

    // Start the game with the initial story
    showStory('start');
});
