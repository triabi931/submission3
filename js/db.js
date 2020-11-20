let dbPromised = idb.open("Teams", 1, function(upgradeDb) {
  let teamsObjectStore = upgradeDb.createObjectStore("teams", {
    keyPath: "id"
  });
  teamsObjectStore.createIndex("name", "name", {
    unique: false
  });
});

function saveForLater(team) {
  dbPromised
    .then(function(db) {
      let tx = db.transaction("teams", "readwrite");
      let store = tx.objectStore("teams");
      console.log(team);
      store.add(team);
      return tx.complete;
    })
    .then(function() {
      console.log("Data Tim berhasil di simpan.");
    });
}

function deleteFromSave(id) {
  dbPromised
  .then(function(db) {
    let tx = db.transaction('teams', 'readwrite');
    let store = tx.objectStore('teams');
    store.delete(id);
    return tx.complete;
  }).then(function() {
    console.log('Data Tim dihapus');
  });
}

function getAll() {
  return new Promise(function(resolve, reject) {
    dbPromised
      .then(function(db) {
        let tx = db.transaction("teams", "readonly");
        let store = tx.objectStore("teams");
        return store.getAll();
      })
      .then(function(teams) {
        resolve(teams);
      });
  });
}

function getAllByTitle(name) {
  dbPromised
    .then(function(db) {
      let tx = db.transaction("teams", "readonly");
      let store = tx.objectStore("teams");
      let titleIndex = store.index("name");
      let range = IDBKeyRange.bound(name, name + "\uffff");
      return titleIndex.getAll(range);
    })
    .then(function(teams) {
      console.log(teams);
    });
}

function getById(id) {
  
  return new Promise(function(resolve, reject) {
    dbPromised
      .then(function(db) {
        let tx = db.transaction("teams", "readonly");
        let store = tx.objectStore("teams");
        return store.get(id);
      })
      .then(function(team) {
        resolve(team);
      });
  });
}
