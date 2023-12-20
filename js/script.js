const counterButton = document.getElementById("increment");
counterButton.addEventListener("click", function () {
    const counter = document.getElementById("count").innerText;
    const counterNumber = parseInt(counter);
    const newCounter = counterNumber + 1;
    document.getElementById("count").innerText = newCounter > 9 ? newCounter : "0" + newCounter;
});