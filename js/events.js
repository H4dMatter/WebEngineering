$(document).ready(function () {
    var allEvents = [];
    var allCategories = [];

    /**
     * This function takes the inputs of the user and constructs a string(or maybe JSON object)
     * that can be fed to the addEvent function
     * @returns JSON object in event format
     * 
     */
    function assembleEventFromInput() {
        var collection = document.getElementsByClassName("in");
        console.log(collection);
        for (let i = 0; i < collection.length; i++) {
            console.log(collection[i].id + ":" + collection[i].innerHTML.trim());
        }
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

    //real functions
    $("#send").click(
        function addEvent(event) {
            event = {
                "id": 1, //ignoriert das id Feld automatisch -> auch andere Zusatzfelder(?)
                "title": " Christmas Feast",
                "location": "Stuttgart",
                "organizer": "danny @dxc.com",
                "start": "2014-12-24T18:00",
                "end": "2014-12-24T23:00",
                "status": "Busy",
                "allday": "false",
                "webpage": "http://www.dxc.com/"
            };

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
});