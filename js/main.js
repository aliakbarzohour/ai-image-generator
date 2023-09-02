// Say Hello To New Ai Image Generator

const apiKey = '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';

const maxImage = 4;

const selectedImageNumber = undefined;

// Function To Generate Random Number Between min and max number
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (min - max + 1)) + min;
}

// Function To Disable The Generate Button During Processing
function disableGenerateButton() {
    document.getElementById("generate").disabled = true;
}

// Function To Disable The Generate Button After Process
function enableGenerateButton() {
    document.getElementById("generate").disabled = false;
}

// Function To Clear Image Grid
function clearImageGrid() {
    const imageGrid = document.getElementById("image-grid");
    imageGrid.innerHTML = "";
}

// Function To Generate Images
async function generateImages(input) {
    disableGenerateButton()
    clearImageGrid()

    const loading = document.getElementById("loading");
    loading.style.display = 'block';

    const imageUrls = [];

    for (let i = 0; i < maxImage; i++) {
        // Generate a Random Number Between 1 And 10000 And Append It To The Prompt
        const randomNumber = getRandomNumber(1, 10000);
        const prompt = `${input} ${randomNumber}`;
        // We Added Random Number To Prompt To Create Diffrent Results
        const response = await fetch(
            "https://api-inference.huggingface.co/models/prompthero/openjourney", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({ inputs: prompt }),
            }
        );

        if (!response.ok) {
            const error = document.createElement("h2");
            error.style.color = "red";
            error.style.fontSize = "1.2rem";
            const result = document.getElementById("result");
            result.innerHTML = "Failed To Fetch Data !";
        }
        const blob = await response.blob();
        const imgUrl = URL.createObjectURL(blob);

        imageUrls.push(imgUrl);

        const img = document.createElement("img");
        img.src = imgUrl;
        img.alt = `art-${i + 1}`;
        img.onclick = () => downloadImage(imgUrl, i);
        document.getElementById("image-grid").appendChild(img);
    }
    loading.style.display = "none";
    enableGenerateButton();
    // Reset Selected Image Number
    selectedImageNumber = null;
}

// Function To Fetch Data After Clicking Generate Button
document.getElementById("generate").addEventListener("click", () => {
    const input = document.getElementById("user-prompt").value;
    console.log(input)
    generateImages(input);
});

// Function To Fetch Data On Submit Event
document.getElementById("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("user-prompt").value;
    console.log(input)
    generateImages(input);
})

// Function To Download Image's
function downloadImage(imgUrl, imageNumber) {
    const link = document.createElement("a");
    link.href = imgUrl;
    // Set Filename Based On The Selected Image
    link.download = `image-${imageNumber + 1}.jpg`;
    link.click();
}

// Function To Reamove Loading Page After Document Loaded

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("splash").classList.add("loaded");
})