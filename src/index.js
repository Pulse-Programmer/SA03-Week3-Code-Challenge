document.addEventListener("DOMContentLoaded", () => {
  //const card = document.querySelector("div.card");
  const docTitle = document.querySelector("#title");
  const runtime = document.querySelector("#runtime");
  const info = document.querySelector("#film_info");
  const showtime = document.querySelector("#showtime");
  const ticketNum = document.querySelector("#ticket_num");
  const films = document.querySelector("ul#films");
  const buyBtn = document.querySelector("#buy_ticket");
  const imgPoster = document.querySelector("img#poster");

  //load info of 1st movie upon page load
  function movieData() {
    fetch(`https://json-server-sa3.onrender.com/films`)
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
          imgPoster.src = dataOne.poster;
          imgPoster.alt = dataOne.title;
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
        const filmsArr = document.querySelectorAll("li");

        buyBtn.addEventListener("click", () => {
          if (ticketNum.textContent > 0) {
            // Inside the event listener, checks if the ticket can be bought
            ticketNum.textContent -= 1;
            let numberOfTicketsSold = t - ticketNum.textContent;
            // Access record and update ticketsSold and movieId
            data.forEach((record) => {
              if (docTitle.textContent === record.title) {
                ticketsSold = record.tickets_sold + numberOfTicketsSold; //Adds the difference to the earlier retrieved record of tickets sold.
                let movieId = record.id;

                updateTicketsSold(movieId, ticketsSold); //tickets sold is persisted to the server
                postNewTicket(movieId, numberOfTicketsSold);
              }
            });
          } else {
            buyBtn.textContent = "sold-out";

            filmsArr.forEach((film) => {
              if (film.textContent.includes(docTitle.textContent)) {
                film.classList.add("sold-out");
              }
            });
          }
        });

        const deleteBtns = films.querySelectorAll("button");
        deleteBtns.forEach((item) => {
          item.addEventListener("click", (e) => {
            e.target.parentNode.remove();
            data.forEach((record) => {
              if (
                e.target.parentNode.textContent.replace("  Delete", "") ===
                record.title
              ) {
                let movieId = record.id;
                handleDelete(movieId);
              }
            });
          });
        });

        films.addEventListener("click", (e) => {
          let movieTitle = e.target.textContent.replace("  Delete", "");

          data.forEach((item) => {
            if (item.title === movieTitle) {
              docTitle.textContent = item.title;
              runtime.textContent = item.runtime;
              info.textContent = item.description;
              showtime.textContent = item.showtime;
              let remainingTickets = item.capacity - item.tickets_sold;
              ticketNum.textContent = remainingTickets;
              imgPoster.src = item.poster;
              imgPoster.alt = item.title;
              t = ticketNum.textContent; //resets value of t to the selected movie's value
            }
          });
        });
      })
      .catch((error) => alert(error.message)); //data
  } //function movieData

  movieData();

  //PATCH request function
  function updateTicketsSold(movie_Id, soldTickets) {
    fetch(`https://json-server-sa3.onrender.com/films/${movie_Id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tickets_sold: soldTickets }),
    })
      .then((res) => res.json())
      .then((body) => console.log(body))
      .catch((error) => alert(error.message));
  }

  //POST request function
  function postNewTicket(movie_Id, no_tickets) {
    const postObj = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        film_id: movie_Id,
        number_of_tickets: no_tickets,
      }),
    };
    fetch("https://json-server-sa3.onrender.com/tickets/", postObj)
      .then((res) => res.json())
      .then((body) => console.log(body))
      .catch((error) => alert(error.message));
  }

  //DELETE request function
  function handleDelete(movie_Id) {
    fetch(`https://json-server-sa3.onrender.com/films/${movie_Id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
});
