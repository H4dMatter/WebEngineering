var allEvents = [];
var allCategories = [];

$(document).ready(function () {

    $("#reset").click(
        function gatherData() {
            var eventJSON = {};
            var inputFields = $(".input");

            console.log($(".input"));
            console.log($("#allday")[0].checked)
            $(".input").each(function (key, value) {

                if (this.value != "") {
                    eventJSON[this.id] = this.value.trim();
                }
            });
            eventJSON["allday"] = $("#allday")[0].checked;
            if (eventJSON["categories"] = "None") {
                delete eventJSON["categories"];
            }
            console.log(eventJSON);
            //return eventJSON;
        }
    );


    //real functions
    $("#send").click(
        function addEvent(event) {

            var eventJSON = {};


            $(".input").each(function (key, value) {
                if (this.value != "") {
                    eventJSON[this.id] = this.value;
                }
            });
            eventJSON["allday"] = $("#allday")[0].checked;
            if (eventJSON["categories"] = "None") {
                delete eventJSON["categories"];
            }
            console.log(JSON.stringify(eventJSON));
            var inputFields = JSON.stringify(eventJSON);

            $.ajax({
                type: "POST",
                url: "https://dhbw.cheekbyte.de/calendar/claben/events",
                data: inputFields,
                success: function () { alert("success") },
                error: function (xhr, status, error) { alert("fail " + xhr.status + xhr.statusText + error) }
            });

        }
    );

    $("#click").click(
        function getAllEvents() {
            allEvents = [];

            $.ajax({
                type: "GET",
                url: "https://dhbw.cheekbyte.de/calendar/claben/events",
                success: function (result, status, xhr) {
                    alert(status);
                    console.log(result);
                    allEvents = result;

                    result.forEach(element => {
                        var data = [];
                        for (let key in element) {
                            if ($("#" + key + "Out")[0] != null) {
                                data[$("#" + key + "Out")[0].cellIndex] = element[key];
                            }
                        };
                        if (data[7].length == 0) data[7] = "None"
                        console.log(data);
                        let newRow = document.getElementById("resultTable").insertRow(-1);
                        for (let i = 0; i < data.length; i++) {
                            let cell = newRow.insertCell(-1);
                            if (data[i] == null) cell.innerHTML = "-";
                            else {
                                cell.innerHTML = data[i];
                            }
                        }
                        // for (let key in element) {
                        //     console.log(key);
                        //     if ($("#" + key + "Out")[0] != null) {
                        //         console.log("CELLINDEX: " + $("#" + key + "Out")[0].cellIndex)
                        //         console.log("#" + key + "Out")
                        //         console.log($("#resultTable > thead > tr")[0].cells)
                        //         console.log(newRow.cells);
                        //         //$("#resultTable > thead >tr")[0].cells[$("#" + key + "Out")[0].cellIndex].innerHTML = element[key];
                        //         //newRow.cells[$("#resultTable > thead >tr")[0].cells[$("#" + key + "Out")[0].cellIndex]].innerHTML = element[key];

                        //         // if (key == "extra" || key == "id") continue;
                        //         // console.log(key + ":" + element[key])
                        //         // let cell = newRow.insertCell(-1);
                        //         // cell.innerHTML = element[key];
                        //     }
                        // }
                    });

                },
                error: function (xhr, status, error) { alert("fail " + xhr.status + xhr.statusText + error) }
            });
        }
    );


});


function table() {
    let newRow = document.getElementById("resultTable").insertRow(-1);
    for (let i = 0; i < 9; i++)//TODO: replace with no hardcode
    {
        let cell = newRow.insertCell(i);
        cell.innerHTML = "New cell";
    }
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
    count = [];

    count[4] = "hi";
    console.log(count);
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
function getElementWidth() {
    var elmnt = document.getElementById("Zwo").offsetWidth;
    var txt = "";
    txt = elmnt + "px\t";
    return txt;
} //Diese Funktion soll eigentlich die Breite der Tabelle zrückgeben und in Funktion Design einfüge - klappt aber nocht nicht 

function displayWeather() {

    try {
        var sibling = document.getElementById("InputWetter").value;
        var ifrm = document.createElement("iframe");
        ifrm.setAttribute("src", "https://www.wetteronline.de/" + sibling);
        ifrm.style.width = "100%";
        ifrm.style.height = "450px";
        ifrm.style.borderRadius = "5px";
        ifrm.style.border = "1px solid #2f4f4f";
        document.getElementById("wetter").appendChild(ifrm);
        return "Done";
    } catch (Exception) {
        return "Unfortunately we couldn't get the weather-data. Please check the correct spelling of the city.";
    }

}