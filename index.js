import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const firebaseConfig = {
    databaseURL: "https://playground-f7dba-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(firebaseConfig)
const db = getDatabase(app)
const endorsementsInDB = ref(db, "endorsements")

const textareaEl = document.getElementById("textarea-el")
const fromEl = document.getElementById("from-el")
const toEl = document.getElementById("to-el")
const requiredEl = document.getElementById("required-el")
const publishBtn = document.getElementById("publish-btn")
const endorsementsListEl = document.getElementById("endorsements-list-el")

publishBtn.addEventListener("click", () => {
    publish()
})

document.querySelectorAll(".pressEnter").forEach(item => {
    item.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            publish()
        }
    })
})


function publish() {
    const textarea = textareaEl.value
    const fromValue = fromEl.value
    const toValue = toEl.value

    if (textarea && fromValue && toValue) {
        clearScreen()
        pushData(textarea, fromValue, toValue)
    } else {
        requiredEl.textContent = "The fields are required"
        if (!textarea) {
            textareaEl.style.border = "2px solid red"
        }
        if (!fromValue) {
            fromEl.style.border = "2px solid red"
        }
        if (!toValue) {
            toEl.style.border = "2px solid red"
        }
    }
}

onValue(endorsementsInDB, (snapshot) => {
     if (snapshot.exists()) {
        const endorsementsArray = Object.entries(snapshot.val())

        clearEndorsementsList()

        for (let i = endorsementsArray.length - 1; i >= 0; i--) {
            const currentEndorsementArr = endorsementsArray[i];
            appendReviewToEndorsements(currentEndorsementArr)
            
        }
     }
})

function clearScreen() {
    textareaEl.value = ""
    toEl.value = ""
    fromEl.value = ""
    requiredEl.textContent = ""
    textareaEl.style.border = "none"
    fromEl.style.border = "none"
    toEl.style.border = "none"
}

function pushData(textarea, fromValue, toValue){
    const userData = [textarea, fromValue, toValue, 0]
    push(endorsementsInDB, userData)
}

function clearEndorsementsList() {
    endorsementsListEl.innerHTML = ""
}

function appendReviewToEndorsements(endorsementArr) {
    const id = endorsementArr[0]
    const endorsementValueArr = endorsementArr[1]
    const textarea = endorsementValueArr[0]
    const from = endorsementValueArr[1]
    const to = endorsementValueArr[2]
    let likes = endorsementValueArr[3]
    
    let newListEl = document.createElement("li")
    let toEl = document.createElement("h2")
    let textEl = document.createElement("p")
    let divContainer = document.createElement("div")
    let buttonEl = document.createElement("button")
    let likesEl = document.createElement("span")
    let fromEl = document.createElement("h2")

    toEl.textContent = `To ${to}`
    newListEl.appendChild(toEl)

    textEl.textContent = `"${textarea}"`
    textEl.classList = "text"
    newListEl.appendChild(textEl)

    divContainer.classList = "from-like-container"
    fromEl.textContent = `From ${from}`
    fromEl.classList = "from"
    divContainer.appendChild(fromEl)
    buttonEl.id = "like-btn-el"
    buttonEl.textContent = "❤ "
    likesEl.textContent = likes
    buttonEl.appendChild(likesEl)
    divContainer.appendChild(buttonEl)
    newListEl.appendChild(divContainer)

    buttonEl.addEventListener("click", () => {
        likes += 1
        const exactLocationInDB = ref(db, `endorsements/${id}`)
        update(exactLocationInDB, {3: likes})
    })
    
    endorsementsListEl.append(newListEl)
}
