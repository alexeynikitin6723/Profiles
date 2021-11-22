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
			list.innerHTML += `<li class="item__avatars avatar-item" data-name="${name.first}">
			<div class="avatar-item__content">
				<div class="avatar-item__image">
					<img src="${data[key].picture.medium}" alt="medium">
				</div>
				<div class="avatar-item__text">
					<h4 class="avatar-item__name">${name.title}. ${name.first} ${name.last}</h4>
				</div>
				<div>
					<select name="sorting" id="sorting" onchange="getSelectedIndex()">
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
			listPopup.innerHTML += `<li class="item__avatars avatar-item" data-name="${name.first}">
			<div class="popup-content">
				<div class="popup-header">
					<h4 class="avatar-item__name">${name.title}. ${name.first} ${name.last}</h4>
					<span class="close">&times;</span>
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
// let popupToggle = document.getElementById('myBtn');
let popupClose = document.querySelectorAll('.close');

// popupToggle.onclick = function () {
// 	popup.style.display = "block";
// };
popupClose.onclick = function () {
	popup.style.display = "none";
};
window.onclick = function (event) {
	if (event.target == popup) {
		popup.style.display = "none";
	}
}
document.body.addEventListener('click', event => {
	if (event.target.classList.contains('close')) {
		popup.style.display = "none";
	}
});
document.body.addEventListener('click', event => {
	if (event.target.classList.contains('avatar-item__content')) {
		popup.style.display = "block";
	}
});




