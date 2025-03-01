function searchWord() {
    let word = document.getElementById("wordInput").value.trim();
    let resultDiv = document.getElementById("result");

    if (word === "") {
        resultDiv.innerHTML = "<p>Please enter a word.</p>";
        return;
    }

    resultDiv.innerHTML = "<p>🔄 Searching...</p>";

    // Fetch definition from Dictionary API
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(response => response.json())
        .then(data => {
            if (data.title) {
                resultDiv.innerHTML = `<p>❌ Word not found.</p>`;
                return;
            }

            let meaning = data[0].meanings[0].definitions[0].definition;
            let phonetics = data[0].phonetics.find(p => p.audio);
            let audioHTML = "";

            if (phonetics && phonetics.audio) {
                audioHTML = `
                    <button id="audioBtn" class="toggle-btn" style="display: none;" onclick="toggleAudio()">
                        🔊 Play Pronounce
                    </button>
                    <audio id="audioPlayer" src="${phonetics.audio}"></audio>
                `;
            }

            resultDiv.innerHTML = `<p><strong>📌 ${word}:</strong> ${meaning}</p> ${audioHTML}`;

            // Show pronounce button only if audio is available
            if (phonetics && phonetics.audio) {
                setTimeout(() => {
                    document.getElementById("audioBtn").style.display = "inline-block";
                }, 300);
            }

            // Fetch image from Pixabay API
            fetch(`https://pixabay.com/api/?key=49124603-a400a1ab7553983af7c564556&q=${word}&image_type=photo`)
                .then(response => response.json())
                .then(imgData => {
                    if (imgData.hits.length > 0) {
                        let imgURL = imgData.hits[0].webformatURL;
                        let imgContainer = document.createElement("div");
                        imgContainer.style = "width: 100%; position: relative; padding-top: 56.25%; overflow: hidden; border-radius: 10px; margin-top: 10px;";
                        
                        let img = document.createElement("img");
                        img.src = imgURL;
                        img.alt = word;
                        img.style = "position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;";
                        
                        imgContainer.appendChild(img);
                        resultDiv.appendChild(imgContainer);
                    } else {
                        resultDiv.innerHTML += `<p>⚠ No image available.</p>`;
                    }
                })
                .catch(() => {
                    resultDiv.innerHTML += `<p>⚠ Image fetch error.</p>`;
                });
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            resultDiv.innerHTML = `<p>⚠ Unable to fetch definition.</p>`;
        });
}

// Function to toggle audio play/pause
function toggleAudio() {
    const audio = document.getElementById("audioPlayer");
    const button = document.getElementById("audioBtn");

    if (audio.paused) {
        audio.play();
        button.innerHTML = "⏸ Pause Pronounce"; // Change text
        button.classList.add("active"); // Apply red color
    } else {
        audio.pause();
        button.innerHTML = "🔊 Play Pronounce"; // Change back text
        button.classList.remove("active"); // Revert to original color
    }

    // Reset button when audio ends
    audio.onended = () => {
        button.innerHTML = "🔊 Play Pronounce";
        button.classList.remove("active");
    };
}

// Dark Mode Toggle
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

// Load saved theme preference
if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-mode");
    themeToggle.innerHTML = "🌞";  // Sun icon for light mode
}

// Toggle Dark Mode
themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");

    // Save user preference
    if (body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        themeToggle.innerHTML = "🌞";  // Sun icon when in dark mode
    } else {
        localStorage.setItem("theme", "light");
        themeToggle.innerHTML = "🌙";  // Moon icon when in light mode
    }
});
