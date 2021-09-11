let DB;
const nombreInput = document.querySelector('#nombre');
const emailInput = document.querySelector('#email');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const observacionesInput = document.querySelector('#observaciones');

// Contenedor para las citas
const contenedorCitas = document.querySelector('#citas');

// Formulario nuevas citas
const formulario = document.querySelector('#nueva-cita')
formulario.addEventListener('submit', nuevaCita);

// Heading
const heading = document.querySelector('#administra');


let editando = false;

//cuando la ventana esta lista llamamos a CrearDB
window.onload = () =>{ //arrow function
    //registrar para llamar
    eventListeners();

    crearDB();

}



// Eventos
function eventListeners() {
    nombreInput.addEventListener('change', datosCita);
    emailInput.addEventListener('change', datosCita);
    telefonoInput.addEventListener('change', datosCita);
    fechaInput.addEventListener('change', datosCita);
    horaInput.addEventListener('change', datosCita);
    observacionesInput.addEventListener('change', datosCita);
}

const citaObj = {
    nombre: '',
    email: '',
    telefono: '',
    fecha: '',
    hora:'',
    observaciones: ''
}


function datosCita(e) {
    //  console.log(e.target.name) // Obtener el Input
     citaObj[e.target.name] = e.target.value;
}

// CLasses
class Citas {
    constructor() {
        this.citas = []
    }
    agregarCita(cita) {
        this.citas = [...this.citas, cita];
    }
    editarCita(citaActualizada) {
        this.citas = this.citas.map( cita => cita.id === citaActualizada.id ? citaActualizada : cita)
    }

    eliminarCita(id) {
        this.citas = this.citas.filter( cita => cita.id !== id);
    }
}

class UI {

    constructor({citas}) {
        this.textoHeading(citas);
    }

    imprimirAlerta(mensaje, tipo) {
        // Crea el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');
        
        // Si es de tipo error agrega una clase
        if(tipo === 'error') {
             divMensaje.classList.add('alert-danger');
        } else {
             divMensaje.classList.add('alert-success');
        }

        // Mensaje de error
        divMensaje.textContent = mensaje;

        // Insertar en el DOM
        document.querySelector('#contenido').insertBefore( divMensaje , document.querySelector('.agregar-cita'));

        // Quitar el alert despues de 3 segundos
        setTimeout( () => {
            divMensaje.remove();
        }, 3000);
   }

   imprimirCitas() {
       
        this.limpiarHTML();

        this.textoHeading(citas);
        
        //Leer el contenido de la base de datos
        const objectStore = DB.transaction('citas').objectStore('citas');

        const fnTextoHeading = this.textoHeading;

        const total = objectStore.count();
        total.onsuccess = function (){
            fnTextoHeading(total.result);
        }

        objectStore.openCursor().onsuccess = function(e){
            
            const cursor = e.target.result;

            if(cursor){
            const {nombre, email, telefono, fecha, hora, observaciones, id } = cursor.value;

            const divCita = document.createElement('div');
            divCita.classList.add('cita', 'p-3');
            divCita.dataset.id = id;

            // scRIPTING DE LOS ELEMENTOS...
            const nombreParrafo = document.createElement('h2');
            nombreParrafo.classList.add('card-title', 'font-weight-bolder');
            nombreParrafo.innerHTML = `${nombre}`;

            const emailParrafo = document.createElement('p');
            emailParrafo.innerHTML = `<span class="font-weight-bolder">Email: </span> ${email}`;

            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML = `<span class="font-weight-bolder">Teléfono: </span> ${telefono}`;

            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `<span class="font-weight-bolder">Fecha: </span> ${fecha}`;

            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `<span class="font-weight-bolder">Hora: </span> ${hora}`;

            const observacionesParrafo = document.createElement('p');
            observacionesParrafo.innerHTML = `<span class="font-weight-bolder">Observaciones: </span> ${observaciones}`;

            // Agregar un botón de eliminar...
            const btnEliminar = document.createElement('button');
            btnEliminar.onclick = () => eliminarCita(id); // añade la opción de eliminar
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
            btnEliminar.innerHTML = 'Eliminar <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'

            // Añade un botón de editar...
            const btnEditar = document.createElement('button');
            const cita = cursor.value;
            btnEditar.onclick = () => cargarEdicion(cita);

            btnEditar.classList.add('btn', 'btn-info');
            btnEditar.innerHTML = 'Editar <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>'

            // Agregar al HTML
            divCita.appendChild(nombreParrafo);
            divCita.appendChild(emailParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(observacionesParrafo);
            divCita.appendChild(btnEliminar)
            divCita.appendChild(btnEditar)

            contenedorCitas.appendChild(divCita);

            //Va al siguiente elemento
            cursor.continue();
            }
        }
   }

   textoHeading(resultado) {
        if(resultado > 0 ) {
            heading.textContent = 'Administra tus Citas '
        } else {
            heading.textContent = 'No hay Citas, comienza creando una'
        }
    }

   limpiarHTML() {
        while(contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
   }
}


const administrarCitas = new Citas();
const ui = new UI(administrarCitas);

function nuevaCita(e) {
    e.preventDefault();

    const {nombre, email, telefono, fecha, hora, observaciones } = citaObj;

    // Validar
    if( nombre === '' || email === '' || telefono === '' || fecha === ''  || hora === '' || observaciones === '' ) {
        ui.imprimirAlerta('Todos los mensajes son Obligatorios', 'error')

        return;
    }

    if(editando) {
        // Estamos editando
        administrarCitas.editarCita( {...citaObj} );

        //Edita en indexDB
        const transaction = DB.transaction(['citas'] , 'readwrite');
        const objectStore = transaction.objectStore('citas');

        //.put nos permite editar un registro en termino de rest
        objectStore.put(citaObj);

        transaction.oncomplete = () => {

            ui.imprimirAlerta('Guardado Correctamente');

            formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';

            editando = false;
        }

        transaction.onerror = () =>{
            console.log('error');
        }
        

    } else {
        // Nuevo Registro

        // Generar un ID único
        citaObj.id = Date.now();
        
        // Añade la nueva cita
        administrarCitas.agregarCita({...citaObj});

        //Insertar Registro en IndexDB
        const transaction = DB.transaction(['citas'], 'readwrite');

        //Habilitar objectStore
        const objectStore = transaction.objectStore('citas');

        //Insertar en la BD
        objectStore.add(citaObj);

        //Que fue correcto y se ejecuto bien
        transaction.oncomplete = function() {
            console.log('cita agregada');

        // Mostrar mensaje de que todo esta bien...
        ui.imprimirAlerta('Se agregó correctamente')
        }
    }


    // Imprimir el HTML de citas
    ui.imprimirCitas();

    // Reinicia el objeto para evitar futuros problemas de validación
    reiniciarObjeto();

    // Reiniciar Formulario
    formulario.reset();

}

function reiniciarObjeto() {
    // Reiniciar el objeto
    citaObj.nombre = '';
    citaObj.email = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.observaciones = '';
}


function eliminarCita(id) {
    
    const transaction = DB.transaction(['citas'], 'readwrite');
    const objectStore = transaction.objectStore('citas');

    objectStore.delete(id);

    transaction.oncomplete = () =>{
        console.log(`Cita ${id} eliminada`);
        ui.imprimirCitas();
    }

    transaction.onerror = () =>{
        console.log('error');
    }
}

function cargarEdicion(cita) {

    const {nombre, email, telefono, fecha, hora, observaciones, id } = cita;

    // Reiniciar el objeto
    citaObj.nombre = nombre;
    citaObj.email = email;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha
    citaObj.hora = hora;
    citaObj.observaciones = observaciones;
    citaObj.id = id;

    // Llenar los Inputs
    nombreInput.value = nombre;
    emailInput.value = email;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    observacionesInput.value = observaciones;

    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';

    editando = true;

}

function crearDB(){
    //crear la base de datos
    const crearDB = window.indexedDB.open('citas', 1);

    //si hay un error
    crearDB.onerror = function(){
        console.log('Error');
    }

    //si todo sale bien
    crearDB.onsuccess = function(){
        console.log('db creada');

        DB = crearDB.result;

        //Mostrar Citas al cargar con indexDB listo
        ui.imprimirCitas();
    }

    //Definir el schema
    crearDB.onupgradeneeded = function(e){
        const db = e.target.result;

        const objectStore = db.createObjectStore('citas',{
            keypath: 'id',
            autoIncrement: true
        });

        //Definir las columnas
        objectStore.createIndex('nombre','nombre', {unique: false});
        objectStore.createIndex('email','email', {unique: false});
        objectStore.createIndex('telefono','telefono', {unique: false});
        objectStore.createIndex('fecha','fecha', {unique: false});
        objectStore.createIndex('hora','hora', {unique: false});
        objectStore.createIndex('observacion','observacion', {unique: false});
        objectStore.createIndex('id','id', {unique: true});

        console.log('creada y lista');
    }

}