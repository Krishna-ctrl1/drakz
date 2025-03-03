function openNav() {
    document.getElementById("mySidebar").style.width = "180px";
    document.querySelector(".content").style.marginLeft = "180px"; // Fixed targeting
    document.getElementById("open-button").style.visibility = "hidden";
}

function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.querySelector(".content").style.marginLeft = "0"; // Fixed targeting
    document.getElementById("open-button").style.visibility = "visible";
}