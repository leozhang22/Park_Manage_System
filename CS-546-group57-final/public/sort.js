function getAllCards() {
    let cards = document.getElementsByClassName("card");
    let events = [];
    for (let card of cards) {
        let event = {};
        event.link = card.children[0].children[0].getAttribute("href"); // Targets link of <a>, with id
        event.name = card.children[0].children[0].innerHTML; // Targets content of <a>, name
        event.capacity = card.children[1].innerHTML;
        event.date = card.children[2].innerHTML;
        event.type = card.children[3].innerHTML;
        event.overallRating = card.children[4].innerHTML;
        events.push(event);
    }
    return events;
}

function sortCardsDescending() {
    let events = getAllCards();
    events.sort(highToLow);
    let cards = document.getElementsByClassName("card");
    while(cards[0]) {
        cards[0].parentNode.removeChild(cards[0]);
    }
    const parentDiv = document.getElementsByClassName("event_Collection")[0];
    for (let ev of events) {
        let div = document.createElement("div");
        div.setAttribute("class", "card");
        div.setAttribute("onClick", "location.href=\"" + ev.link + "\";");
        let h2 = document.createElement("h2");
        let a = document.createElement("a");
        a.setAttribute("href", ev.link);
        a.innerHTML = ev.name;
        h2.appendChild(a);
        div.appendChild(h2);
        let p1 = document.createElement("p");
        p1.setAttribute("class", "category");
        p1.innerHTML = ev.capacity;
        div.appendChild(p1);
        let p2 = document.createElement("p");
        p2.innerHTML = ev.date;
        div.appendChild(p2);
        let p3 = document.createElement("p");
        p3.innerHTML = ev.type;
        div.appendChild(p3);
        let p4 = document.createElement("p");
        p4.setAttribute("class", "avg");
        p4.innerHTML = ev.overallRating;
        div.appendChild(p4);
        div.appendChild(document.createElement("br"));
        parentDiv.append(div);
    }
}

function highToLow(a, b) {
    let ratingA = a.overallRating.substring(0, 3);
    let ratingB = b.overallRating.substring(0, 3); 
    if (ratingB === "No ") return -1
    if (ratingA === "No ") return 1
    return parseFloat(ratingB)-parseFloat(ratingA)
}