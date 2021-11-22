const requestURL = 'https://api.randomuser.me/1.0/?results=50&nat=gb,us&inc=gender,name,location,email,phone,picture';

const xhr = new XMLHttpRequest();

let list = document.querySelector('.list__avatars');
let listPopup = document.querySelector('.list-popup');

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
			list.innerHTML += `<li class="item__avatars avatar-item avatar-item-list" data-name="${name.first}">
			<div class="avatar-item__content">
				<div class="avatar-item__image">
					<img src="${data[key].picture.medium}" alt="medium">
				</div>
				<div class="avatar-item__text">
					<h4>${name.title}. ${name.first} ${name.last}</h4>
				</div>
				<div>
					<select class="select" name="sorting" id="sorting" onchange="getSelectedIndex()">
						<option selected value="alph-sort">Сортировка по алфавиту</option>
						<option value="back-sort">Обратная сортировка</option>
					</select>
				</div>
				<button class="sort-asc">Отсортировать</button>
			</div>
			</li>`
		}
		for (let key in data) {
			let name = data[key].name;
			let location = data[key].location;
			let phone = (data[key].phone).split(' ').join('');
			listPopup.innerHTML += `<li class="item__avatars avatar-item item-popup" data-name="${name.first}">
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
						<a href="#" class="avatar-item__contacts avatar-item__contacts_map">${location.street}, ${location.city}, ${location.state}
							${location.postcode}</a>
						<a href="tel:${phone}" class="avatar-item__contacts avatar-item__contacts_phone">${data[key].phone}</a>
						<a href="mailto:${data[key].email}"
							class="avatar-item__contacts avatar-item__contacts_email">${data[key].email}</a>
					</div>
				</div>
			</div>
			</li>`
		}
	})
	.catch(err => console.log(err));

function getSelectedIndex() {
	return document.getElementById('sorting').selectedIndex;
}

document.body.addEventListener('click', event => {
	if (event.target.classList.contains('sort-asc')) {
		mySort();
	}
});
function mySort() {
	let nav = document.querySelector('#nav');
	if (getSelectedIndex() === 0) {
		for (let i = 0; i < nav.children.length; i++) {
			for (let j = i; j < nav.children.length; j++) {
				if (nav.children[i].getAttribute('data-name') > nav.children[j].getAttribute('data-name')) {
					replaceNode = nav.replaceChild(nav.children[j], nav.children[i]);
					insertAfter(replaceNode, nav.children[i]);
				}
			}
		}
	}
	if (getSelectedIndex() === 1) {
		for (let i = 0; i < nav.children.length; i++) {
			for (let j = i; j < nav.children.length; j++) {
				if (nav.children[i].getAttribute('data-name') < nav.children[j].getAttribute('data-name')) {
					replaceNode = nav.replaceChild(nav.children[j], nav.children[i]);
					insertAfter(replaceNode, nav.children[i]);
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
	}
});
list.addEventListener('click', function (event) {
	if (event.target.closest('.avatar-item__content') && !event.target.classList.contains('sort-asc') && !event.target.classList.contains('select')) {
		popup.style.display = "block";
		console.log(list.children[2].getAttribute('data-name'));
	}
});
listPopup.addEventListener('click', function (event) {
	if (!event.target.closest('.popup-content')) {
		popup.style.display = "none";
	}
});

