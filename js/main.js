// cargar todos el contenido del DOM antes de iniciar function para los menus desplegables

document.addEventListener('DOMContentLoaded', function() {
	// nav menu
	const menus = document.querySelectorAll('.side-menu');
	M.Sidenav.init(menus, {edge: 'left'});
	// add contact form
	const forms = document.querySelectorAll('.side-form');
	M.Sidenav.init(forms, {edge: 'right'});
});

// Lee datos
// Para verificar rápidamente que agregaste datos a Cloud Firestore, usa el visor de datos de Firebase console.

// También puedes utilizar el método “get” para recuperar toda la colección.

// db.collection('contacts').get().then((querySnapshot) => {
//     querySnapshot.forEach((doc) => {
//         console.log(`${doc.id} => ${doc.data().name}`);
//     });
// });


// implementar the renderContact 
const contacts = document.querySelector('.contacts');

const renderContact = (data, id) => {
	const html = `
		<div class="contactName grey-text text-darken-1" data-id="${id}">
			<div class="contact-image">
				<img src="icons/72x72.png" alt="contant thumbnail">
			</div>
			<div class="contact-details">
				<div class="contact-title">${data.name}</div>
				<div class="contact-number">${data.number}</div>
			</div>
			<div class="contact-options">
				<i class="material-icons" data-id="${id}"> delete_outline </i>
			</div>
		</div>
		`;

		contacts.innerHTML += html;
}

//  remove contact from DOM
const removeContact = (id) => {
	const cont = document.querySelector(`.contactName[data-id=${id}]`);
	cont.remove();
};