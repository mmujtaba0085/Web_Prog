function moveBoxRandomly(){
    const box = document.getElementById("box");
    const container =document.getElementById("container");

    //Dimensions
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const boxWidth = box.clientWidth;
    const boxHeight = box.clientHeight;

    //Movement with box (Calculation)
    const randomX = Math.floor(Math.random() * (containerWidth - boxWidth));
    const randomY = Math.floor(Math.random() * (containerHeight - boxHeight));

    // Move the box
    box.style.left = randomX + "px";
    box.style.top = randomY + "px";
}