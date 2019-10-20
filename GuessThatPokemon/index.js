const pokedex = document.getElementById("pokedex");
//console.log(pokedex)
const modalRight = document.getElementById("right");
const fetchPokemon = async () => {
	const url = `https://pokeapi.co/api/v2/pokemon?limit=151`;
	const res = await fetch(url);
	const data = await res.json();
	const pokemon = data.results.map((result, index) => ({
		...result,
		name: result.name,
		id: index + 1,
		image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`

	}));
	//console.log(pokemon);
	displayPokemon(pokemon); 
};

const displayPokemon = (pokemon) => {
	//console.log(pokemon);
    const pokemonHTMLString = pokemon.map (
        (pokeman) => `
    <li class="pokeprofile" onclick="selectPokemon(${pokeman.id})">
		<img class="pokeprofile__image" src="${pokeman.image}"/>
    </li>
    `)
	.join('');
    pokedex.innerHTML = pokemonHTMLString;
};

const selectPokemon = async (id) => {
	const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
	const res = await fetch(url);
	const pokeman = await res.json();
	displayPopup(pokeman);
};

const displayPopup = (pokeman) => {
	const type = pokeman.types.map((type) => type.type.name).join(', ');
	const image = pokeman.sprites['front_default'];
	const speed = pokeman.stats[0].base_stat;
	const hp = pokeman.stats[5].base_stat;
	const attack = pokeman.stats[4].base_stat;
	const defense = pokeman.stats[3].base_stat;
	
	const htmlString = 
	`<div class="modal__right__img">
	<img id="pokemon" class="modal__right__img__image" src="${image}"></img>
	<div class="modal__right__info">
		<div class="modal__right__info__id">#${pokeman.id}</div>
		<span class="modal__right__info__name">${pokeman.name}</span>
		<div class="modal__right__info__hp">HP<span class="modal__right__info__number hp">${hp}</span></div>
		<div class="modal__right__info__speed">SPEED<span class="modal__right__info__number speed">${speed}</span></div>
		<div class="modal__right__info__attack">ATTACK<span class="modal__right__info__number attack">${attack}</span></div>
		<div class="modal__right__info__defense">DEFENSE<span class="modal__right__info__number defense">${defense}</span></div>
	</div>
</div>`;
	modalRight.innerHTML = htmlString;

	//let myPokemons = pokemon.filter(p => pokemonIds.includes(p.id))

};


fetchPokemon()

   



/* Guessing Game */

const guessValue = document.querySelector(".wrapper__label__input"),
	guessSubmit = document.querySelector(".wrapper__label__button"),
	pokeImage = document.querySelector(".wrapper__profile__pic");

let answer,
	data = null,
	xhr = new XMLHttpRequest();

xhr.addEventListener("readystatechange", function() {
	if (this.readyState === 4) {
		data = JSON.parse(this.responseText);
		//console.log(data.id);
		answer =  {id: data.id, name: data.name};
		pokeImage.setAttribute("src", data["sprites"]["front_default"]);
	}
});
xhr.open("GET", `https://pokeapi.co/api/v2/pokemon/${getRandomInt(1, 151)}/`);
xhr.send(data);

guessValue.addEventListener("keyup", e => {
	if (e.keyCode == 13) checkPokemon();
});
guessSubmit.addEventListener("click", checkPokemon);


function checkPokemon() {
	var guess = guessValue.value.toLowerCase();
	//console.log(answer, guess);
	if (answer.name === guess) {
		
		pokeImage.style.filter = "none";
		let pokemonIds = JSON.parse(window.localStorage.getItem("pokemonIds"));
		if (pokemonIds && pokemonIds.length >= 0){
			//console.log(pokemonIds);
			pokemonIds.push(answer.id);
			window.localStorage.setItem("pokemonIds", JSON.stringify(pokemonIds));
		}

		else{
			//console.log("store");
			window.localStorage.setItem("pokemonIds", JSON.stringify([answer.id]));
			
			
		}
		xhr.open("GET", `https://pokeapi.co/api/v2/pokemon/${getRandomInt(1, 151)}/`);
		xhr.send(data);

		toastr.success('Correct!');
		toastr.options = {
			"closeButton": true,
			"positionClass": "toast-top-left",
			"preventDuplicates": false,
			"onclick": null,
			"showDuration": "300",
			"hideDuration": "1000",
			"timeOut": "5000",
			"extendedTimeOut": "1000",
			"showEasing": "swing",
			"hideEasing": "linear",
			"showMethod": "fadeIn",
			"hideMethod": "fadeOut"
			};

		toastr.info("Pokemon added to pokedex!")
		toastr.options = {
			"closeButton": true,
			"positionClass": "toast-top-left",
			"preventDuplicates": false,
			"onclick": null,
			"showDuration": "300",
			"hideDuration": "1000",
			"timeOut": "5000",
			"extendedTimeOut": "1000",
			"showEasing": "swing",
			"hideEasing": "linear",
			"showMethod": "fadeIn",
			"hideMethod": "fadeOut"
			};
		 document.getElementById('input').value='';
	} else {
		shakePokemon();
		toastr.error('Incorrect, try again.');
		toastr.options = {
			"closeButton": true,
  			"positionClass": "toast-top-left",
  			"preventDuplicates": false,
  			"onclick": null,
  			"showDuration": "300",
  			"hideDuration": "1000",
  			"timeOut": "5000",
  			"extendedTimeOut": "1000",
  			"showEasing": "swing",
  			"hideEasing": "linear",
  			"showMethod": "fadeIn",
			"hideMethod": "fadeOut"
			};
		  document.getElementById('input').value='';
	};

	/* Counter for pokemon on card */
	let pokemonIds = JSON.parse(window.localStorage.getItem("pokemonIds"));

		if (pokemonIds) {
			//console.log(pokemonIds);
			let pokemonCount = document.getElementById('pokemonCcount');
			pokemonCount.innerHTML = pokemonIds.length;
			};
};
function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
}
function shakePokemon() {
	let i = 1;
	while (i < 5) {
		let timer = 75 * i,
			leftVal = timer % 2 ? "5px" : "-5px";

		setTimeout(() => {
			pokeImage.style.left = leftVal;
		}, timer);
		i++;
	}
}



/* MODAL */

const wrapperContainer = document.querySelector('.wrapper')

wrapperContainer.addEventListener('click', e => {
    //console.log(e);
    e.preventDefault();

const modalToggle = e.target.closest('.wrapper__pokedexbtn')
    //console.log(modalToggle)
    if ( ! modalToggle) return

    const modal = modalToggle.parentNode.nextElementSibling
    const closeButton = modal.querySelector('.modal-close')

    const modalOpen = _ => {
        modal.classList.add('is-open')
        modal.style.animation = 'modalIn 500ms forwards'
		
		/* Counter for pokemon on pokedex */
		let pokemonIds = JSON.parse(window.localStorage.getItem("pokemonIds"));

		if (pokemonIds) {
			//console.log(pokemonIds);
			let pokemonCount = document.getElementById('pokemonCount');
			pokemonCount.innerHTML = pokemonIds.length;
			};
    };
    
    const modalClose = _ => {
        modal.classList.remove('is-open')
        modal.removeEventListener('animationend', modalClose)
    };

    closeButton.addEventListener('click', _ => {
        modal.style.animation = 'modalOut 500ms forwards'
        modal.addEventListener('animationend', modalClose)
    });

    document.addEventListener('keydown', e => {
        if (e.keyCode === 27) {
            modal.style.animation = 'modalOut 500ms forwards'
            modal.addEventListener('animationend', modalClose) 
        };
    });

    modalOpen();
	



});






/* Progress Bar */



//document.addEventListener("DOMContentLoaded", function(event) {
	/* DOM is ready, so we can query for its elements */
//	var progress = document.getElementById("progress").value = 0;
//	console.log(progress);
	
	/*additional code for comment*/
//	document.querySelector('.wrapper__label__button').addEventListener("click", function(event){
//	  document.getElementById("progress").value += 1;
//	});
//  });*/

/*function progressBarSim (al) {
	var bar = document.getElementById('progressBar');
	var status = document.getElementById('status');
	status.innerHTML = al + "%";
	bar.value = al;
	al++;
	var sim = setTimeout ("progressBarSim("+al+")",100);
	if (al == 151) {
		status.innerHTML = "100%";
		bar.value = 151;
		clearTimeout(sim);
	};
};
var amountLoaded = 0;
progressBarSim(amountLoaded);*/