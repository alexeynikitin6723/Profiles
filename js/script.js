const requestURL = 'https://api.randomuser.me/1.0/?results=50&nat=gb,us&inc=gender,name,location,email,phone,picture';

const xhr = new XMLHttpRequest();

let list = document.querySelector('.list__avatars');
let listPopup = document.querySelector('.list-popup');
let count = 0;

function sendRequest(method, url) {
	return new Promise((resolve, reject) => {
		xhr.open(method, url);
		xhr.responseType = 'json';
		xhr.onload = () => {
			if (xhr.status >= 400) {
				reject(xhr.response);
			}
			else {
				resolve(xhr.response);
			}
		}
		xhr.onerror = () => {
			reject(xhr.response);
		}
		xhr.send();
	})
}

sendRequest('GET', requestURL)
	.then(data => {
		data = data["results"];
		for (let key in data) {
			let name = data[key].name;
			list.innerHTML += `<li class="item__avatars avatar-item avatar-item-list" data-name="${name.first}" data-sort="${name.title}. ${name.first} ${name.last}">
			<div class="avatar-item__content">
				<div class="avatar-item__image">
					<img src="${data[key].picture.medium}" alt="medium">
				</div>
				<div class="avatar-item__text">
					<h4>${name.title}. ${name.first} ${name.last}</h4>
				</div>
			</div>
			</li>`
		}
		for (let key in data) {
			let name = data[key].name;
			let location = data[key].location;
			let phone = (data[key].phone).split(' ').join('');
			listPopup.innerHTML += `<li class="item__avatars avatar-item item-popup" data-name="${name.first}" data-sort="${name.title}. ${name.first} ${name.last}">
			<div class="popup-content">
				<div class="popup-header">
					<div class="avatar-item__name">
						<h4>${name.title}. ${name.first} ${name.last}</h4>
					</div>
					<div class="close">
						<span class="close">&times;</span>
					</div>
				</div>
				<div class="popup-body avatar-item">
					<div class="avatar-item__image">
						<img src="${data[key].picture.large}" alt="large">
					</div>
					<div class="avatar-item__contacts">
						<a href="#" class="avatar-item__contact avatar-item__contact_map">${location.street}, ${location.city}, ${location.state}
							${location.postcode}</a>
						<a href="tel:${phone}" class="avatar-item__contact avatar-item__contact_phone">${data[key].phone}</a>
						<a href="mailto:${data[key].email}"
							class="avatar-item__contact avatar-item__contact_email">${data[key].email}</a>
					</div>
				</div>
			</div>
			</li>`
		}
	})
	.catch(err => console.log(err));

function getSelectedIndex() {
	return document.querySelector('.select__current').innerText;
}


document.body.addEventListener('click', event => {
	if (event.target.classList.contains('sort-asc')) {
		mySort();
	}
});
function mySort() {
	//let list = document.querySelector('#list');
	if (getSelectedIndex() === 'Сортировка по алфавиту') {
		for (let i = 0; i < list.children.length; i++) {
			for (let j = i; j < list.children.length; j++) {
				if (list.children[i].getAttribute('data-name') > list.children[j].getAttribute('data-name')) {
					replaceNode = list.replaceChild(list.children[j], list.children[i]);
					insertAfter(replaceNode, list.children[i]);
				}
			}
		}
	}
	if (getSelectedIndex() === 'Обратная сортировка') {
		for (let i = 0; i < list.children.length; i++) {
			for (let j = i; j < list.children.length; j++) {
				if (list.children[i].getAttribute('data-name') < list.children[j].getAttribute('data-name')) {
					replaceNode = list.replaceChild(list.children[j], list.children[i]);
					insertAfter(replaceNode, list.children[i]);
				}
			}
		}
	}
}

function insertAfter(elem, refElem) {
	return refElem.parentNode.insertBefore(elem, refElem.nextSibling);
}

let popup = document.getElementById('mypopup');
let popupClose = document.querySelectorAll('.close');
document.body.addEventListener('click', event => {
	if (event.target.classList.contains('close')) {
		popup.style.display = "none";
		list.children[count].querySelector('.avatar-item__image').classList.remove('triangle');
	}
});
list.addEventListener('click', function (event) {
	if (event.target.closest('.avatar-item__content')) {
		popup.style.display = "block";
		outputOnDisplay(event);
	}
});
listPopup.addEventListener('click', function (event) {
	if (!event.target.closest('.popup-content')) {
		popup.style.display = "none";
		list.children[count].querySelector('.avatar-item__image').classList.remove('triangle');
	}
});

function outputOnDisplay(event) {
	for (let i = 0; i < listPopup.children.length; i++) {
		if (event.target.closest('li').getAttribute('data-sort') == listPopup.children[i].getAttribute('data-sort')) {
			listPopup.children[i].style.display = "block";
		}
		else {
			listPopup.children[i].style.display = "none";
		}
		if (event.target.closest('li').getAttribute('data-sort') == list.children[i].getAttribute('data-sort')) {
			list.children[i].querySelector('.avatar-item__image').classList.add('triangle');
			count = i;
		}
	}
}

////////////////////////////////////////////////////////

let select = function () {
	let selectHeader = document.querySelectorAll('.select__header');
	let selectItem = document.querySelectorAll('.select__item');

	selectHeader.forEach((event) => {
		event.addEventListener('click', selectToggle);
	});

	selectItem.forEach((event) => {
		event.addEventListener('click', selectChoose);
	});

	function selectToggle() {
		this.parentElement.classList.toggle('is-active');
	}
	function selectChoose() {
		let text = this.innerText;
		let select = this.closest('.select');
		let currentText = select.querySelector('.select__current');
		currentText.innerText = text;
		select.classList.remove('is-active');
	}
};
select();

