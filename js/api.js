const KEY = "8648faa77dfe4a48bab851398848a182";
const BASE_URL = "https://api.football-data.org/";

const LEAGUE_ID = 2021;
const ENDPOINT_DETAILS = `${BASE_URL}v2/teams/`;
const ENDPOINT_TEAMS = `${BASE_URL}v2/competitions/${LEAGUE_ID}/teams `;
const ENDPOINT_COMPETITION = `${BASE_URL}v2/competitions/${LEAGUE_ID}/standings`;

const fetchAPI = url => {
  return fetch(url, {
      headers: {
          'X-Auth-Token': KEY
      }
  })
      .then(res => {
        // Blok kode yang akan di panggil jika fetch berhasil
          if (res.status !== 200) {
              console.log("Error: " + res.status);
        // Method reject() akan membuat blok catch terpanggil
              return Promise.reject(new Error(res.statusText))
          } else { 
        // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
              return Promise.resolve(res)
          }
      })
      .then(res => res.json())
      .catch(err => {
          console.log(err)
      })
};


// Blok kode untuk melakukan request data json
function getTeams() {
  if ("caches" in window) {
    caches.match(ENDPOINT_TEAMS).then(function(response) {
      if (response) {
        response.json().then(function(data) {
          let teamsHTML = "";
          data.teams.forEach(function(team) {
            teamsHTML += `
                  <div class="card">
                    <a href="./team.html?id=${team.id}">
                      <div class="card-image waves-effect waves-block waves-light">
                        <img src="${team.crestUrl}" alt="Logo CLub" />
                      </div>
                    </a>
                    <div class="card-content">
                      <span class="card-title truncate">${team.name}</span>
                      <p>Alamat       : ${team.address}</p>
                      <p>No HP        : ${team.phone}</p>
                      <p>Website      : ${team.website}</p>
                      <p>Tahun Lahir  : ${team.founded}</p>
                      <p>Stadion      : ${team.venue}</p>
                    </div>
                  </div>
                `;
          });
          // Sisipkan komponen card ke dalam elemen dengan id #content
          document.getElementById("teams").innerHTML = teamsHTML;
        });
      }
    });
  }

  fetchAPI(ENDPOINT_TEAMS)
    .then(status)
    .then(function(data) {
      // Objek/array JavaScript dari response.json() masuk lewat data.

      // Menyusun komponen card artikel secara dinamis
      let teamsHTML = "";
      data.teams.forEach(function(team) {
        teamsHTML += `
              <div class="card">
                <a href="./team.html?id=${team.id}">
                  <div class="card-image waves-effect waves-block waves-light">
                    <img src="${team.crestUrl}" alt="Logo CLub" />
                  </div>
                </a>
                <div class="card-content">
                  <span class="card-title truncate">${team.name}</span>
                      <p>Alamat       : ${team.address}</p>
                      <p>No HP        : ${team.phone}</p>
                      <p>Website      : ${team.website}</p>
                      <p>Tahun Lahir  : ${team.founded}</p>
                      <p>Stadion      : ${team.venue}</p>
                </div>
              </div>
            `;
      });
      // Sisipkan komponen card ke dalam elemen dengan id #content
      document.getElementById("teams").innerHTML = teamsHTML;
    })
    .catch(error => {
      console.error('Terjadi Kesalahan', error)
    });
}

function getTeamById() {
  return new Promise(function(resolve, reject) {
    // Ambil nilai query parameter (?id=)
    let urlParams = new URLSearchParams(window.location.search);
    let idParam = urlParams.get("id");

    if ("caches" in window) {
      caches.match(ENDPOINT_DETAILS + idParam).then(function(response) {
        if (response) {
          response.json().then(function(data) {
            let teamHTML = `
            <div class="card">
              <div class="card-image waves-effect waves-block waves-light">
                <img src="${data.crestUrl}" alt="Logo CLub" />
              </div>
              <div class="card-content">
              <span class="card-title truncate">${data.name}</span>
                  <p>Alamat       : ${data.address}</p>
                  <p>No HP        : ${data.phone}</p>
                  <p>Website      : ${data.website}</p>
                  <p>Tahun Lahir  : ${data.founded}</p>
                  <p>Stadion      : ${data.venue}</p>
              </div>
            </div>
          `;
            // Sisipkan komponen card ke dalam elemen dengan id #content
            document.getElementById("body-content").innerHTML = teamHTML;

            // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
            resolve(data);
          });
        }
      });
    }

    fetchAPI(ENDPOINT_DETAILS + idParam)
      .then(status)
      .then(function(data) {
        // Objek JavaScript dari response.json() masuk lewat variabel data.
        // console.log(data);
        // Menyusun komponen card artikel secara dinamis
        let teamHTML = `
            <div class="card">
            <div class="card-image waves-effect waves-block waves-light">
              <img src="${data.crestUrl}" alt="Logo CLub" />
            </div>
            <div class="card-content">
            <span class="card-title truncate">${data.name}</span>
                <p>Alamat       : ${data.address}</p>
                <p>No HP        : ${data.phone}</p>
                <p>Website      : ${data.website}</p>
                <p>Tahun Lahir  : ${data.founded}</p>
                <p>Stadion      : ${data.venue}</p>
            </div>
          </div>
        `;
        // Sisipkan komponen card ke dalam elemen dengan id #content
        document.getElementById("body-content").innerHTML = teamHTML;
        // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
        resolve(data);
      });
  });
}

function getAllStandings() {
  if ("caches" in window) {
      caches.match(ENDPOINT_COMPETITION).then(function (response) {
          if (response) {
              response.json().then(function (data) {
                  console.log("Competition Data: " + data);
                  showStanding(data);
              })
          }
      })
  }

  fetchAPI(ENDPOINT_COMPETITION)
      .then(data => {
          showStanding(data);
      })
      .catch(error => {
          console.log(error)
      })
}

function showStanding(data) {
  let standings = "";
  let standingElement =  document.getElementById("homeStandings");

  data.standings[0].table.forEach(function (standing) {
      standings += `
              <tr>
                  <td><img src="${standing.team.crestUrl.replace(/^http:\/\//i, 'https://')}" width="30px" alt="badge"/></td>
                  <td>${standing.team.name}</td>
                  <td>${standing.won}</td>
                  <td>${standing.draw}</td>
                  <td>${standing.lost}</td>
                  <td>${standing.points}</td>
                  <td>${standing.goalsFor}</td>
                  <td>${standing.goalsAgainst}</td>
                  <td>${standing.goalDifference}</td>
              </tr>
      `;
  });

   standingElement.innerHTML = `
              <div class="card" style="padding-left: 24px; padding-right: 24px; margin-top: 30px;">

              <table class="striped responsive-table">
                  <thead>
                      <tr>
                          <th></th>
                          <th>Team Name</th>
                          <th>W</th>
                          <th>D</th>
                          <th>L</th>
                          <th>P</th>
                          <th>GF</th>
                          <th>GA</th>
                          <th>GD</th>
                      </tr>
                   </thead>
                  <tbody id="standings">
                      ${standings}
                  </tbody>
              </table>
              
              </div>
  `;
}

function getSavedTeams() {
  getAll().then(function(teams) {
    console.log(teams);
    // Menyusun komponen card artikel secara dinamis
    let teamsHTML = "";
    teams.forEach(function(team) {
      let description = team.address.substring(0, 100);

      teamsHTML += `
                  <div class="card">
                    <a href="./team.html?id=${team.id}&saved=true">
                      <div class="card-image waves-effect waves-block waves-light">
                        <img src="${team.crestUrl}" alt="Logo CLub" />
                      </div>
                    </a>
                    <div class="card-content">
                    <span class="card-title truncate">${team.name}</span>
                        <p>Alamat       : ${team.address}</p>
                        <p>No HP        : ${team.phone}</p>
                        <p>Website      : ${team.website}</p>
                        <p>Tahun Lahir  : ${team.founded}</p>
                        <p>Stadion      : ${team.venue}</p>
                    </div>
                  </div>
                `;
    });
    // Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById("body-content").innerHTML = teamsHTML;
  });
}

function getSavedTeamById() {
  let urlParams = new URLSearchParams(window.location.search);
  let idParam = parseInt(urlParams.get("id"));
  
  teamHTML = '';
  getById(idParam).then(function(team) {
    let teamHTML = `
    <div class="card">
      <div class="card-image waves-effect waves-block waves-light">
        <img src="${team.crestUrl}" alt="Logo CLub" />
      </div>
      <div class="card-content">
      <span class="card-title truncate">${team.name}</span>
          <p>Alamat       : ${team.address}</p>
          <p>No HP        : ${team.phone}</p>
          <p>Website      : ${team.website}</p>
          <p>Tahun Lahir  : ${team.founded}</p>
          <p>Stadion      : ${team.venue}</p>
      </div>
    </div>
  `;
    // Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById("body-content").innerHTML = teamHTML;
  });
}

