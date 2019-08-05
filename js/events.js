var allEvents = [];
var allCategories = [];

$(document).ready(function () {
    getAllEvents();
    getAllCategories();

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
            if ($("#allday")[0].checked) {
                console.log(eventJSON["start"].substring(0, eventJSON["start"].indexOf('T')))
                //eventJSON["start"] = eventJSON["start"].substring(0, eventJSON["start"].indexOf('T'))
            }
            if (eventJSON["categories"] = "None") {
                delete eventJSON["categories"];
            }
            console.log(eventJSON);
            //return eventJSON;
        }
    );



    /**
    * This function takes the inputs of the user and constructs a string(or maybe JSON object)
    * that can be fed to the addEvent function
    * @returns JSON object in event format
    * 
    */
    $("#send").click(
        function addEvent() {

            var eventJSON = getInputData();

            var file = document.querySelector('input[type=file]').files[0];//$("#imageurl")[0].files[0];
            var reader = new FileReader();


            reader.addEventListener("load", function () {
                eventJSON["imagedata"] = reader.result;
                console.log(eventJSON);

                var inputFields = JSON.stringify(eventJSON);

                $.ajax({
                    type: "POST",
                    url: "https://dhbw.cheekbyte.de/calendar/claben/events",
                    data: inputFields,
                    success: function () {
                        getAllEvents();
                        alert("Added Entry successfully");
                    },
                    error: function (xhr, status, error) { alert("fail " + xhr.status + xhr.statusText + error) }
                });
            }, false);

            if (file) {
                reader.readAsDataURL(file);
            }



        }
    );

    $("#click").click(getAllEvents);
    $("#addCategory").click(addCategory);
    $("#deleteCategory").click(deleteCategory);


    $("#test").click(test);
});

function getAllCategories() {
    $.ajax({
        type: "GET",
        url: "https://dhbw.cheekbyte.de/calendar/claben/categories",
        success: function (result, status, xhr) {
            allCategories = result;
            console.log(allCategories);
            $("#categories").empty();
            $("#categories").append("<option selected>None</option>");
            allCategories.forEach(element => {
                $("#categories").append("<option>" + element.name + "</option>")
            });
            $("#categories").append("<option>Add category</option>");
        },
        error: function (xhr, status, error) { alert("fail " + xhr.status + xhr.statusText + error) }
    });

}

function getAllEvents() {
    allEvents = [];

    $("#resultTableBody").empty();


    $.ajax({
        type: "GET",
        url: "https://dhbw.cheekbyte.de/calendar/claben/events",
        success: function (result, status, xhr) {
            console.log(" Calendar was loaded successfully");
            allEvents = result;

            result.forEach(element => {
                var data = [];
                console.log(element)
                for (let key in element) {
                    if ($("#" + key + "Out")[0] != null) {
                        if (key == "start" || key == "end") data[$("#" + key + "Out")[0].cellIndex] = element[key].replace("T", " ").replace(new RegExp("-", 'g'), "/");
                        else if (key == "categories") {
                            if (element[key].length != 0) {
                                data[$("#" + key + "Out")[0].cellIndex] = "";
                                element[key].forEach(cat => {
                                    data[$("#" + key + "Out")[0].cellIndex] += cat.name + "\n";
                                })

                            }
                            else {
                                data[$("#" + key + "Out")[0].cellIndex] = "None"
                            }
                        }
                        else if (key == "imageurl") {
                            data[$("#" + key + "Out")[0].cellIndex] = "<img height='80px' alt='No Image' src='" + element[key] + "'></img>";
                        }
                        else {
                            data[$("#" + key + "Out")[0].cellIndex] = element[key]
                        };
                    }

                };


                data[data.length] = "<button class='editButton' onclick='editEvent()'>Edit</button> <button class='deleteButton' onclick='deleteEvent()'>Delete</button>"
                let newRow = document.getElementById("resultTableBody").insertRow(-1);

                for (let i = 0; i < data.length; i++) {
                    let cell = newRow.insertCell(-1);
                    if (data[i] == null) cell.innerHTML = "-";
                    else {
                        cell.innerHTML = data[i];
                    }
                }

            });

        },
        error: function (xhr, status, error) { alert("fail " + xhr.status + xhr.statusText + error) }
    });
}
function getInputData() {
    let input = {};
    $(".input").each(function (key, value) {
        if (this.value != "") {
            input[this.id] = this.value;
        }
    });
    input["allday"] = $("#allday")[0].checked;
    if ($("#allday")[0].checked) {
        if (input["start"] == null) {
            let help = new Date(Date.now());
            help.setUTCHours(0, 0, 0, 0);
            input["start"] = help.toISOString().substring(0, 16);

        }
        if (input["end"] == null) {
            let help = new Date(Date.now());
            help.setUTCHours(23, 59, 0, 0);
            input["end"] = help.toISOString().substring(0, 16);

        }
    }

    if (input["categories"] == "None") {
        delete input["categories"];
    }
    else {
        input["categories"] = [allCategories[$("#categories")[0].selectedIndex - 1]];
    }
    console.log(input);
    return input;
}

function addCategory() {
    let category = '{"name":' + '"' + $("#newCategory")[0].value + '"}';
    console.log(category);
    $.ajax({
        type: "POST",
        url: "https://dhbw.cheekbyte.de/calendar/claben/categories",
        data: category,
        success: function (result, status, xhr) {
            alert("Category added successfully")

            getAllCategories();
            addCategoryDialog();
            clearCategoryDialog();
        },
        error: function (xhr, status, error) {
            if (xhr.status == 500) {
                alert("A category with this name already exists")
            }
        }
    });
}

function deleteCategory() {
    id = allCategories[$("#categories")[0].selectedIndex - 1].id;
    $.ajax({
        type: "DELETE",
        url: "https://dhbw.cheekbyte.de/calendar/claben/categories/" + id,
        success: function (result, status, xhr) {
            alert("Category deleted successfully")
            clearCategoryDialog();
            getAllCategories();

        },
        error: function (xhr, status, error) {
            if (xhr.status == 500) {
                alert("A category with this name doesnt exists on the server")
            }
        }
    });
}
function clearCategoryDialog() {
    $("#addCategory").prop("hidden", true);
    $("#deleteCategory").prop("hidden", true);
    $("#newCategory").prop("hidden", true);
}
function addCategoryDialog() {
    if ($(event.target)[0].value == "None") {
        clearCategoryDialog()
    }
    else {

        if ($(event.target)[0].value == "Add category") {
            $("#addCategory").prop("hidden", false);
            $("#deleteCategory").prop("hidden", true);
            $("#newCategory").prop("hidden", false);
        }
        else {
            $("#addCategory").prop("hidden", true);
            $("#deleteCategory").prop("hidden", false);
            $("#newCategory").prop("hidden", true);
        }
    }
}

function getImageData() {
    console.log(document.querySelector('input[type=file]').files[0]);
    var file = document.querySelector('input[type=file]').files[0];//$("#imageurl")[0].files[0];
    var reader = new FileReader();


    reader.addEventListener("load", function () {
        return reader.result;
    }, false);

    if (file) {
        reader.readAsDataURL(file);
    }
}

//Test functions
function test() {
    console.log(getImageData());
}

function editEvent() {
    data = allEvents[$(event.target).closest("tr")[0].rowIndex - 1];
    let input = getInputData();
    console.log(allEvents[$(event.target).closest("tr")[0].rowIndex - 1]);
    // $(".input").each(function (key, value) {
    //     if (this.value != "") {
    //         input[this.id] = this.value;
    //     }
    // });
    // console.log(input);
    // if (input["categories"] == "None") {
    //     delete input["categories"];
    // }
    // else {
    //     input["categories"] = [allCategories[$("#categories")[0].selectedIndex - 1]];
    // }

    for (let key in input) {
        data[key] = input[key];
    }
    console.log(input);
    $.ajax({
        type: "PUT",
        url: "https://dhbw.cheekbyte.de/calendar/claben/events/" + data.id,
        data: JSON.stringify(data),
        success: function () {
            alert("success");
            getAllEvents();
        },
        error: function (xhr, status, error) {
            console.log(xhr.status)
        }
    });
}

function deleteEvent() {
    console.log($(event.target).closest("tr")[0].rowIndex);

    id = allEvents[$(event.target).closest("tr")[0].rowIndex - 1].id;
    $.ajax({
        type: "DELETE",
        url: "https://dhbw.cheekbyte.de/calendar/claben/events/" + id,
        success: function () {
            console.log("deleted")
            getAllEvents();
        },
        error: function (xhr, status, error) { alert("fail " + xhr.status + xhr.statusText + error) }
    });
}






function getElementWidth() {
    var elmnt = document.getElementById("Zwo").offsetWidth;
    var txt = "";
    txt = elmnt + "px\t";
    return txt;
} //Function as control element internally used


/**
 * This function displays weather card (wetteronline) after inserting location 
 * When no location input: homepage-wetteronline
 */
function displayWeather() {

    try {
        var brk = document.createElement("br");
        var sibling = document.getElementById("InputWetter").value;
        var ifrm = document.createElement("iframe");
        ifrm.setAttribute("src", "https://www.wetteronline.de/" + sibling);
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

function printResultTable() {
    var printTable = document.getElementById("printZWO");
    var printTitle = document.getElementById("site"); // printing tag "title" possible but does not look nice 
    var printArea = window.open();
    printArea.document.write(printTable.innerHTML); // then: printArea.document.write(printTitle.innerHTML, printTable.innerHTML);
    printArea.print();
    printArea.close();
}