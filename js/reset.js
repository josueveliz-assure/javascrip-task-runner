const resetButton = document.getElementById("reset");
const catImage = document.getElementById("cat");
resetButton.addEventListener("click", function () {
    document.getElementById("count").innerText = "00";
    catImage.style.animation = "rotate 1s linear";
    setTimeout(function () {
        catImage.style.animation = "";
    }, 1000);
});