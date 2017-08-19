/*
 * Please see the included README.md file for license terms and conditions.
 */


// This file is a suggested starting place for your code.
// It is completely optional and not required.
// Note the reference that includes it in the index.html file.


/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false app:false, dev:false, cordova:false */



// This file contains your event handlers, the center of your application.
// NOTE: see app.initEvents() in init-app.js for event handler initialization code.

function myEventHandler() {
    "use strict" ;

    var ua = navigator.userAgent ;
    var str ;

    if( window.Cordova && dev.isDeviceReady.c_cordova_ready__ ) {
            str = "It worked! Cordova device ready detected at " + dev.isDeviceReady.c_cordova_ready__ + " milliseconds!" ;
    }
    else if( window.intel && intel.xdk && dev.isDeviceReady.d_xdk_ready______ ) {
            str = "It worked! Intel XDK device ready detected at " + dev.isDeviceReady.d_xdk_ready______ + " milliseconds!" ;
    }
    else {
        str = "Bad device ready, or none available because we're running in a browser." ;
    }

    alert(str) ;
}


function onDeviceReady() 
{
    console.log("Dispositivo listo");
    var db = window.openDatabase("EQF.db", "1.0", "EQF", 200000);
    console.log("Se abrio base");
    db.transaction(function(transaction) {
        transaction.executeSql('CREATE TABLE IF NOT EXISTS tbl_Cuentas (cue_Descripcion VARCHAR(30), cue_Tipo CHAR(1))', [],
            function(tx, result) {
                console.log("Table created successfully");
            },
            function(error) {
                alert("Ocurrió un error al inicializar la base de datos");
            });
    }); 
} //onDeviceReady

//***Funciones correspondientes a la administración de cuentas***

/*function consultarCuentas()
{
    console.log("Entro consultar");
    var db = window.openDatabase("EQF.db", "1.0", "EQF", 200000);
    db.transaction(function(transaction) {
        transaction.executeSql('SELECT * FROM tbl_Cuentas', [], function (tx, results) {
            var len = results.rows.length, i;
            for (i = 0; i < len; i++){
                document.writeln(results.rows.item(i).cue_Descripcion+" "+results.rows.item(i).cue_Tipo);
            }
        }, null);
    });
}*/ //consultarCuentas


function guardarCuenta()
{
    console.log("Entro guardarCuenta");
    var stDescripcion = document.getElementById("txtDescripcion").value;
    var stTipo = opcion;
    var db = window.openDatabase("EQF.db", "1.0", "EQF", 200000);
    console.log("Se abrio base");
    db.transaction(function(transaction) {
        var executeQuery = "INSERT INTO tbl_Cuentas (cue_Descripcion, cue_Tipo) VALUES (?,?)";
        transaction.executeSql(executeQuery, [stDescripcion, stTipo], function(tx, result) {
            alert('Se registró la cuenta');
            //Reinicio de los campos
            document.getElementById("txtDescripcion").value = "";
            opcion = "T";
            cambiar_opcion("efectivo");
        },
        function(error){
            alert('Ocurrió un error al intentar registrar la cuenta');
        });
    });    
    //Se muestra la información de la nueva cuenta (**PENDIENTE**)

} //guardarCuenta

function borrarCuenta(inCuenta)
{
    console.log("Entro borrarCuentas");
    console.log(inCuenta);
    if (confirm("¿Confirma que quiere borrar la cuenta?"))
    {
        var db = window.openDatabase("EQF.db", "1.0", "EQF", 200000);
        db.transaction(function(transaction) {
            var executeQuery = "DELETE FROM tbl_cuentas WHERE rowid = ?";
            transaction.executeSql(executeQuery, [inCuenta], function(tx, result) {
                console.log("Entro a borrar");
                alert("Cuenta borrada");
                listarCuentas();
            //console.log(registro);
            },
            function(error){
                alert('Ocurrió un error al intentar listar las cuentas');
            });
        });
    }
} //borrarCuenta

function listarCuentas()
{
    console.log("entro listarCuentas");
    var db = window.openDatabase("EQF.db", "1.0", "EQF", 200000);
    var tablaCuentas = document.getElementById("listaDeCuentas");
    tablaCuentas.innerHTML = "";
    var registro = "<table width='100%'>";
    db.transaction(function(transaction) {
        var executeQuery = "SELECT rowid, * FROM tbl_Cuentas";
        transaction.executeSql(executeQuery, [], function(tx, result) {
            console.log("Entro a listar");
            for (var x=0; x<result.rows.length; x++)
            {
                registro = registro + "<tr><td width='80%'>" + result.rows.item(x).cue_Descripcion + "</td><td width='10%'>" + result.rows.item(x).cue_Tipo+ "</td><td width='10%' onclick='borrarCuenta(" + result.rows.item(x).rowid + ");'><i class='fa fa-trash-o'></i></td></tr>";
            }
            tablaCuentas.innerHTML = registro + "</table>";
            //console.log(registro);
        },
        function(error){
            alert('Ocurrió un error al intentar listar las cuentas');
        });
    });
} //listarCuentas

function cambiar_opcion(opcion1)
{
    var divTarjeta = document.getElementById("tarjeta");
    var divEfectivo =  document.getElementById("efectivo");
            
    if (opcion1=="efectivo" && opcion=="T")
    {
        divEfectivo.classList.remove("opcion-no-seleccionada");
        divEfectivo.classList.add("opcion-seleccionada");
        divTarjeta.classList.remove("opcion-seleccionada");
        divTarjeta.classList.add("opcion-no-seleccionada");
        opcion = "E";
                
    }
    else if (opcion1=="tarjeta" && opcion=="E")
    {
        divEfectivo.classList.remove("opcion-seleccionada");
        divEfectivo.classList.add("opcion-no-seleccionada");
        divTarjeta.classList.remove("opcion-no-seleccionada");
        divTarjeta.classList.add("opcion-seleccionada");
        opcion = "T";
    }
} //cambiar_opcion
        
var opcion = "E";
//***Fin de funciones de administración de cuentas

//Funcion para cambiar de pagina
function activarPagina(pag)
{
    //Primero ocultamos todas las páginas
    document.getElementById("contenedorPrincipal").style.display = "none";
    document.getElementById("contenedorCuentas").style.display = "none";
    //Se muestra la pagina solicitada
    document.getElementById(pag).style.display = "block";
    if (pag == "contenedorCuentas") //Si se va a mostrar la pagina de cuentas, que liste las registradas
    {
        listarCuentas();    
    }
} // activarPagina


document.addEventListener("deviceready", onDeviceReady, false);
