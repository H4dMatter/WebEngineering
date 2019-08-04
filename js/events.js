var allEvents = [];
var allCategories = [];

$(document).ready(function () {


    function gatherData() {
        var eventJSON = {};
        var inputFields = $(".input");

        console.log($(".input"));
        console.log($("#allday")[0].checked)
        $(".input").each(function (key, value) {
            console.log(this.id + ":" + this.value);
            eventJSON[key] = value;
        });
        eventJSON["allday"] = $("#allday")[0].checked;
        console.log(eventJSON);
        return eventJSON;
    }

    $("#reset").click(
        gatherData()
    );


    //real functions
    $("#send").click(
        function addEvent(event) {
            event = gatherData();
            // event = {
            //     "id": 1, //ignoriert das id Feld automatisch -> auch andere Zusatzfelder(?)
            //     "title": " Christmas Feast",
            //     "location": "Stuttgart",
            //     "organizer": "danny @dxc.com",
            //     "start": "2014-12-24T18:00",
            //     "end": "2014-12-24T23:00",
            //     "status": "Busy",
            //     "allday": false,

            // };

            $.ajax({
                type: "POST",
                url: "https://dhbw.cheekbyte.de/calendar/claben/events",
                data: JSON.stringify(event),
                success: function () { alert("success") },
                error: function (xhr, status, error) { alert("fail " + xhr.status + xhr.statusText) }
            });
            // var xhttp = new XMLHttpRequest();

            // xhttp.open("POST", "https://dhbw.cheekbyte.de/calendar/claben/events", false);
            // xhttp.send(JSON.stringify(event));

        });


});


function getAllEvents() {
    allEvents = [];
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://dhbw.cheekbyte.de/calendar/claben/events", false);
    xhttp.send();

    let response = JSON.parse(xhttp.responseText);
    allEvents = response;
    console.log(response);
}

function getCategories() {
    allCategories = [];
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://dhbw.cheekbyte.de/calendar/claben/categories", false);
    xhttp.send();

    let response = JSON.parse(xhttp.responseText);
    allCategories = response;
    console.log(response);
}

function addCategory() {
    allCategories = [];
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://dhbw.cheekbyte.de/calendar/claben/categories", false);
    xhttp.send();

    let response = JSON.parse(xhttp.responseText);
    allCategories = response;
    console.log(response);
}
//Test functions
function test() {

    var string = "";
    for (let i = 0; i < allEvents.length; i++) {
        console.log(allEvents[i]);
        let element = allEvents[i];
        for (var key in element) {
            string += element[key] + " ";
        }
        console.log(string);
        string = "";
    }
}

/**
 * This function takes the inputs of the user and constructs a string(or maybe JSON object)
 * that can be fed to the addEvent function
 * @returns JSON object in event format
 * 
 */
function getInputData() {

    var collection = document.getElementsByClassName("input");
    console.log(collection);
}

function getElementWidth(){
    var elmnt = document.getElementById("Zwo").offsetWidth;
    var txt="";
    txt=elmnt +"px\t";
    return txt;
} //Function as control element internally used


/**
 * This function displays weather card (wetteronline) after inserting location 
 * When no location input: homepage-wetteronline
 */


function displayWeather (){

    try{
        var brk=document.createElement("br");
        var sibling=document.getElementById("InputWetter").value;
        var ifrm = document.createElement("iframe");
        ifrm.setAttribute("src", "https://www.wetteronline.de/"+sibling);
        ifrm.style.width = "100%";
        ifrm.style.height = "450px";
        ifrm.style.borderRadius = "5px";
        ifrm.style.border = "1px solid #2f4f4f";
        document.getElementById("wetter").appendChild(brk);
        document.getElementById("wetter").appendChild(ifrm);
    } catch (Exception) {
        alert("Unfortunately we couldn't get the weather-data. Please check the correct spelling of the city.");
    }

}

/**
 * This function prints only the resulting table with all events
 * Printview coincides when pressing str+p
 */

function printResultTable(){
        var printTable = document.getElementById("printZWO");
        var printTitle = document.getElementById("site"); // printing tag "title" possible but does not look nice 
        var printArea = window.open();
        printArea.document.write(printTable.innerHTML); // then: printArea.document.write(printTitle.innerHTML, printTable.innerHTML);
        printArea.print();
        printArea.close();
      }
