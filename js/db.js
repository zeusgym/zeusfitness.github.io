// script conectar a firebase database.

db.enablePersistence()
	.catch( err => {
		if (err.code == 'failed-precondition'){
			// varias tabs abiertas en navegador
			console.log('persistence failed');
		} else if (err.code == 'unimplemented'){
			console.log('persistence is not available');
		}
});

//  real-time listener
db.collection('contacts').onSnapshot((snapshot) => {
	snapshot.docChanges().forEach(change => {
		if(change.type === 'added'){
			renderContact(change.doc.data(), change.doc.id);
		}
		if (change.type === 'removed'){
			removeContact(change.doc.id);
		}
	});
});


// add new contact
const form = document.querySelector('form');

form.addEventListener('submit', evt => {
	
	evt.preventDefault();

	const contact = {
		name : form.name.value,
		number : form.number.value
	};

	db.collection('contacts').add(contact)
		.catch(err => console.log(err));

	form.name.value = '';
	form.number.value = '';

});

//  delete contact
const contactContainer = document.querySelector('.contacts');

contactContainer.addEventListener('click', evt => {
	// console.log(evt);

	if (evt.target.tagName === 'I') {
		const id = evt.target.getAttribute('data-id');
		db.collection('contacts').doc(id).delete();
	}
});

