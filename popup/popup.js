window.onload = function () {
    let buttons = document.getElementsByClassName("bg");
    for (let i=0; i<buttons.length; i++){
        buttons[i].addEventListener("click", e=>{          
            e.currentTarget.classList.toggle("active"); 
        })
    }
}