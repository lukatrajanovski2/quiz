let index = 0
let score = 0
document.addEventListener('DOMContentLoaded', function() {
    quiz();
});
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Дали ова колаче започнува со името што ни треба?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Ја зачувуваме вредноста во променлива
const csrftoken = getCookie('csrftoken');

function quiz(){
  document.querySelector('#categories').style.display = 'block';
  document.querySelector('#each_question').style.display = 'none';
  document.querySelector('#score-btn').style.display = 'none';
  document.querySelector('#back').style.display = 'none';
  document.querySelector('#leaderboarddiv').style.display = 'none';

  const leader_l = document.querySelector("#leader")
  leader_l.addEventListener("click", function(){
    document.querySelector('#categories').style.display = 'none';
    document.querySelector('#each_question').style.display = 'none';
    document.querySelector('#score-btn').style.display = 'none';
    document.querySelector('#back').style.display = 'none';
    document.querySelector('#leaderboarddiv').style.display = 'block';
  })

  fetch('/quiz_api/categories/')
  .then(response => response.json())
  .then(data => {
    console.log(data);   
      const container = document.querySelector('#categories');
      container.innerHTML = ``;
      

      const categoryDescriptions = {
      'geography': 'Прашања за држави, градови, реки и светски знаменитости.',
      'history': 'Прашања за древни империи, светски војни и историски личности.',
      'science': 'Прашања за физика, хемија, биологија и вселената.',
      'sport': 'Прашања за фудбал, кошарка, Олимписки игри и спортисти.'
};
      data.categories.forEach(u => {
        const myButton = document.createElement('button');
        myButton.classList.add('btn', 'btn-primary', 'mt-2', 'me-4');
        const desc = categoryDescriptions[u] || 'Квиз прашања од оваа категорија';
        myButton.innerHTML = `
          <div><strong>${u.toUpperCase()}</strong></div>
          <small style="display: block; font-size: 12px; font-weight: normal; margin-top: 4px;">
              ${desc}
          </small>
       `;

  
        container.appendChild(myButton);
        myButton.addEventListener('click', function() {
            document.querySelector('#categories').style.display = 'none';
            document.querySelector('#back').style.display = 'none';
            document.querySelector('#each_question').style.display = 'block';
            document.querySelector('#score-btn').style.display = 'block';
            document.querySelector('#leaderboarddiv').style.display = 'none';

        
            function one_question(){
            fetch(`/quiz_api/questions/${u}/`)
            .then(response => response.json())
            .then(data => {
              console.log(data);  
            const kanta = document.querySelector('#each_question')
            kanta.innerHTML = ``
            const prasanja = data.questions
             if (prasanja.length > 0 && index >= prasanja.length){
                    fetch('/quiz_api/leaderboard/', {
                      method:"POST",
                      headers: {
                      'Content-Type': 'application/json',
                      'X-CSRFToken': csrftoken},
                      body: JSON.stringify({
                        score: score,
                    })
                    })
                    .then(response => response.json())
                    .then(leader => {
                      console.log(leader)
                      const leaderboarddiv = document.querySelector('#leaderboarddiv');
                      leaderboarddiv.innerHTML = ``
                      const totals = {}

                      leader.leaderboard.forEach(l => {
                        if (totals[l.user]) {
                          totals[l.user] += l.points; 
                      } else {
                          totals[l.user] = l.points; 
                      }})
                        for (const user in totals){
                        leaderboarddiv.innerHTML+=`<p>user ${user}: ${totals[user]} points</p>`;
                    }

                    })
                    const poraka = document.createElement("h1")
                    poraka.innerHTML = `you scored ${score} out of ${prasanja.length}`
                    kanta.append(poraka)
                    if (score >= 1){
                      const winAudio = new Audio('/static/quiz_api/song-2.mp3');
                      winAudio.play();
                    confetti({
                      particleCount: 10000,
                      startVelocity: 100, // 🚀 Многу посилен истрел нагоре!
                      angle: 60,            // Агол кон десно
                      spread: 500,
                      origin: { x: 0 },     // Сосема лево
                      gravity: 1.5,         // Побавно паѓање (стандардно е 1)
                      scalar: 2           // Малку поголеми парчиња
                  });

                  // 2. Истрел од десната страна
                  confetti({
                      particleCount: 10000,
                      startVelocity:100,
                      angle: 60,           // Агол кон лево
                      spread: 500,
                      origin: { x: 1 },     // Сосема десно
                      gravity: 1.5,
                      scalar: 2
                  })}else{
                    document.body.classList.add('shake');
                    const sadAudio = new Audio('https://www.myinstants.com/media/sounds/sad-trombone.mp3');
                    sadAudio.play();
                  };
                    poraka.style.fontSize = '4rem'
                    document.querySelector('#score-btn').style.display = 'none';
                    const back = document.querySelector("#back")
                    back.innerHTML = 'back'
                    back.classList.add('btn', 'btn-lg', 'btn-primary', 'd-block', 'mx-auto', 'display-1', 'p-4', 'fw-bold', 'mb-3')
                    back.style.fontSize = '2.5rem' // 💡 Ова ќе го направи ОГРОМНО!
                    
                   back.onclick = function(e) {
                      e.stopPropagation(); // ⛔ Го запира кликот да не се пренесе на други елементи!
                      window.location.href = "/";
                  };
                    return;
                  }  
            const q = prasanja[index];
            const prasanje = document.createElement('h3')
            prasanje.classList.add('display-3', 'p-5', 'text-center', 'fw-bold', 'mb-3');
            prasanje.innerHTML = q.question
            kanta.appendChild(prasanje)
              const answers = [q.answer1, q.answer2, q.answer3, q.answer4];
              siteKopcinja = []
              answers.forEach((a, i) => {
                const yourButton = document.createElement('button')
                yourButton.classList.add('btn', 'btn-primary', 'me-2')
                yourButton.innerHTML = a
                siteKopcinja.push(yourButton);
                kanta.appendChild(yourButton)
                yourButton.addEventListener("click", function() {
                  siteKopcinja.forEach(btn => btn.disabled = true);
                  if (i + 1 === q.right_answer){
                    yourButton.classList.add('btn-success')
                    score++
                    document.querySelector('#score-btn').innerText = `Score: ${score}/10`;
                  } else{
                    const tocen = siteKopcinja[q.right_answer - 1]
                    tocen.classList.add('btn-success')
                    yourButton.classList.add('btn-danger')
                    tocen.classList.add('btn-success')
                  }      
                  setTimeout(function() {        
                  index++;
                  one_question();
                }, 1000);
                    })
              
            })
            })
          }
          one_question()
        })
  })
})
  .catch(error => console.error(error));

}



