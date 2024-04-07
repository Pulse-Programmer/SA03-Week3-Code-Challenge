document.addEventListener("DOMContentLoaded", () => {
  //const card = document.querySelector("div.card");
  const docTitle = document.querySelector("#title");
  const runtime = document.querySelector("#runtime");
  const info = document.querySelector("#film_info");
  const showtime = document.querySelector("#showtime");
  const ticketNum = document.querySelector("#ticket_num");
  const films = document.querySelector("ul#films");
  const buyBtn = document.querySelector("#buy_ticket");

  //load info of 1st movie upon page load
  fetch(`http://localhost:3000/films/1`)
    .then((res) => res.json())
    .then((data) => {
      docTitle.textContent = data.title;
      runtime.textContent = data.runtime;
      info.textContent = data.description;
      showtime.textContent = data.showtime;
      let remainingTickets = data.capacity - data.tickets_sold;
      ticketNum.textContent = remainingTickets;
    });

  //Load movie titles
  fetch("http://localhost:3000/films")
    .then((res) => res.json())
    .then((data) => {
      for (const record of data) {
        const li = document.createElement("li");
        li.textContent = record.title;
        li.classList.add("film", "item");
        films.append(li);
      }
    });

  //Buy tickets
  buyBtn.addEventListener("click", () => {
    ticketNum.textContent -= 1;
    fetch("http://localhost:3000/films")
      .then((res) => res.json())
      .then((data) => {
        data.forEach((record) => {
          if (docTitle.textContent === record.title) {
            ticketsSold = record.tickets_sold + 1;
          }
        });
      });
  });
});
