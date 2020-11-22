// isolate button 
// listen for a click event 
// if dog isGoodDog === true, change text to false and vice versa
// make a patch request to that specific dog
// update isGoodDog value to opposite


// -------------Variables-------------//

const dogBar = document.querySelector("div#dog-bar")
const dogInfoDiv = document.querySelector("div#dog-info")
const goodDogButton = document.querySelector("#good-dog")
const dogFilter = document.querySelector("#good-dog-filter")

// -------------Function Definitions------------- //


function getDogNames() {
    fetch("http://localhost:3000/pups")
    .then(response => response.json())
    .then(pupArray => pupArray.forEach(pup => {
        makeDogNameSpan(pup)
    }))
}

function makeDogNameSpan(pupObj) {
    const dogName = document.createElement("span")
    dogName.dataset.id = pupObj.id
    dogName.textContent = pupObj.name
    dogBar.append(dogName)
}


function renderInfo(dogObj) {
    dogInfoDiv.innerHTML = ""

    const dogImage = document.createElement("img")
    dogImage.src = dogObj.image

    const h2 = document.createElement("h2")
    h2.textContent = dogObj.name

    const button = document.createElement("button")
    button.id = "good-dog"
    button.dataset.id = dogObj.id
    if (dogObj.isGoodDog) {
    button.textContent = "Good Dog!"
    } else {
        button.textContent = "Bad Dog!"
    }

    dogInfoDiv.append(dogImage, h2, button)
}



function initialize() {
    getDogNames()
}

// -------------Event Listeners------------- //

dogBar.addEventListener("click", event => {
    if(event.target.tagName === "SPAN") {
        const dogId = event.target.dataset.id
        fetch(`http://localhost:3000/pups/${dogId}`)
        .then(response => response.json())
        .then(dogObj => renderInfo(dogObj))
    }
})


dogInfoDiv.addEventListener("click", event => {
    if (event.target.tagName === "BUTTON"){
        const button = event.target
        if (button.textContent === "Good Dog!") {

            fetch(`http://localhost:3000/pups/${button.dataset.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    isGoodDog: false
                })
            })

            button.textContent = "Bad Dog!"
        
        } else {
            button.textContent = "Good Dog!"

            fetch(`http://localhost:3000/pups/${button.dataset.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    isGoodDog: true
                })
            })
        }
    }
})

dogFilter.addEventListener("click", event => {
    if (dogFilter.textContent === "Filter good dogs: OFF") {
        dogFilter.textContent = "Filter good dogs: ON"
        dogBar.innerHTML = ""

        fetch("http://localhost:3000/pups")
        .then(response => response.json())
        .then(pupArray => pupArray.forEach(pup => {
            if (pup.isGoodDog){
            makeDogNameSpan(pup)
            }
        }))
    } else {
        dogFilter.textContent = "Filter good dogs: OFF"
        dogBar.innerHTML = ""
        getDogNames()
    }
})



// -------------Initialize------------- //

initialize()
