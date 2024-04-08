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
  function movieData() {
    fetch(`http://localhost:3000/films`)
      .then((res) => res.json())
      .then((data) => {
        function firstMovie() {
          const dataOne = data[0];

          docTitle.textContent = dataOne.title;
          runtime.textContent = dataOne.runtime;
          info.textContent = dataOne.description;
          showtime.textContent = dataOne.showtime;
          let remainingTickets = dataOne.capacity - dataOne.tickets_sold;
          ticketNum.textContent = remainingTickets;
        }
        firstMovie();

        //Load movie titles
        for (const record of data) {
          const li = document.createElement("li");
          const delBtn = document.createElement("button");
          delBtn.textContent = "Delete";
          delBtn.classList.add("block", "delBtn");
          li.textContent = `${record.title}  `;
          li.appendChild(delBtn);
          li.classList.add("film", "item");
          films.appendChild(li);
        }

        //Buy tickets
        let ticketsSold;
        let t = ticketNum.textContent; //saves or tracks original number before clicking on buy ticket button
        buyBtn.addEventListener("click", () => {
          if (ticketNum.textContent > 0) {
            // Inside the event listener, checks if the ticket can be bought
            ticketNum.textContent -= 1;
            let numberOfTickets = t - ticketNum.textContent;
            // Access record and update ticketsSold and movieId
            data.forEach((record) => {
              if (docTitle.textContent === record.title) {
                ticketsSold = record.tickets_sold + numberOfTickets; //Adds the difference to the earlier retrieved record of tickets sold.
                let movieId = record.id;

                updateTicketsSold(movieId, ticketsSold); //tickets sold is persisted to the server
                postNewTicket(movieId, numberOfTickets);
              }
            });
          } else {
            buyBtn.textContent = "sold-out";
            const filmsArr = films.childNodes;

            // for (let i = 3; i < filmsArr; i++) {
            //   console.log(filmsArr[i].textContent);
            //   if (filmsArr[i].textContent === docTitle.textContent) {
            //     filmsArr[i].classList.add("sold-out");
            //   }
            // }
          } //If tickets are depleted
        });
      }); //data
  } //function movieData

  movieData();

  function updateTicketsSold(movie_Id, soldTickets) {
    fetch(`http://localhost:3000/films/${movie_Id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tickets_sold: soldTickets }),
    });
    // .then((res) => res.json())
    // .then((patchResponse) => console.log(patchResponse));
  }

  function postNewTicket(movie_Id, no_tickets) {
    const postObj = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        film_id: movie_Id,
        number_of_tickets: no_tickets,
      }),
    };
    fetch("http://localhost:3000/tickets/", postObj);
  }
});
