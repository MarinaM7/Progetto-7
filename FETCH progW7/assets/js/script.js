//json-server --watch assets/data/data.json
var nome = document.getElementById('nome');
var cognome = document.getElementById('cognome');
var addBtn = document.getElementById('scrivi');
var elencoHTML = document.getElementById('elenco');
var errore = document.getElementById('errore');
var erroreElenco = document.getElementById('erroreElenco');

var elenco = [];
var fCheck;

window.addEventListener('DOMContentLoaded', init);

function init() {
    printData();
    eventHandler();
}

function eventHandler() {
    addBtn.addEventListener('click', function () {
        if (fCheck) {
            modifyData()
        } else {
            controlla();
        }
    })
}

function printData() {
    //se ad una fetch non viene passato nessun paramentro, quello standard è il metodo get
    //la fetch è una Promise e ogni then è una Promise che si esegue a cascata
    fetch('http://localhost:3000/elenco').then((response) => {
        return response.json(); //trasforma la stringa in un json 
    }).then((data) => {
        elenco = data; //nell'array vanno i dati che arrivano da response.json()
        if (elenco.length > 0) {
            errore.innerHTML = '';
            elencoHTML.innerHTML = '';
            elenco.map(function (element) {
                elencoHTML.innerHTML += `<li class="mb-1 d-flex justify-content-between align-items-center border rounded-3 border-2 ps-2 mb-2 shadow-sm"> <p class="m-1"> <i class="bi bi-person-circle"></i> ${element.nome} ${element.cognome} </p>
                <p class="m-1"><button id="modifica" type="button" class="btn btn-warning btn-sm rounded-3" onClick="modifica(${element.id})"> <i class="bi bi-pencil-square"></i> </button> <button type="button" class="btn btn-danger text-dark btn-sm me-1 rounded-3" onClick="elimina(${element.id})"> <i class="bi bi-trash-fill"></i> </button></p>
                </li>`;
            })
            document.getElementById('deleteAll').style.display = 'block';
        }
    })
}

function controlla() {
    if (nome.value != '' && cognome.value != '') {
        var data = {
            nome: nome.value,
            cognome: cognome.value
        };
        addData(data);
    } else {
        errore.innerHTML = 'Compilare correttamente tutti i campi!';
        return;
    }
}

async function addData(data) {
    let response = await fetch('http://localhost:3000/elenco', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(data),
    });
    clearForm();
}

function clearForm() {
    nome.value = '';
    cognome.value = '';
}

// NB la function printData() non viene mai richiamata perche contiene una fetch che è una promise, ovvero un observer ed è sempre in ascolto.
// dopo la funzione addData() viene modificato il json, e quindi la fetch osserva questo cambiamento e successivamente esegue printData()


async function elimina(element) {
    var answer = window.confirm("Sei sicuro? L'operazione è irreversibile!");
    if (answer) {
        try {
            let response = await fetch(`http://localhost:3000/elenco/${element}`, {
                method: "DELETE",
            });
        } catch (err) {
            document.getElementById('erroreElenco').innerHTML = err.message;
        }
    }
}

async function modifica(element) {
    var answer = window.confirm("Sei sicuro di voler modificare?");
    if (answer) {
        fetch(`http://localhost:3000/elenco/${element}`)
            .then((response) => {
                return response.json();
            }).then((data) => {
                elenco = data;
                nome.value = elenco.nome;
                cognome.value = elenco.cognome;
            });
    }
    fCheck = true;
}

async function modifyData(data) {
    var data = {
        nome: nome.value,
        cognome: cognome.value
    };
    fetch(`http://localhost:3000/elenco/${elenco.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(data),
    })
    clearForm();
    fCheck = false;
}

// async function deleteAll() {
// 	for(let i = 1; i <= elenco.length; i++ ){
//             try {
//                 let response = await fetch(`http://localhost:3000/elenco/${i}`, {
//                     method: "DELETE",
//                 });
//             } catch (err) {
//                 console.log(err)
//             }
// 	}
// }

async function deleteAll() {
	for(let i = 1; i <= elenco.length || i >= elenco.length; i++ ){
            try {
                let response = await fetch(`http://localhost:3000/elenco/${i}`, {
                    method: "DELETE",
                });
            } catch (err) {
                console.log(err)
            }
	}
}