var allEvents = [];
var allCategories = [];
var sidebarOpen = false;

$(document).ready(function () {
    getAllEvents();
    getAllCategories();


    $("#send").click(
        function addEvent() {

            var eventJSON = getInputData();

            var file = document.querySelector('input[type=file]').files[0];
            var reader = new FileReader();


            reader.addEventListener("load", function () {
                eventJSON["imagedata"] = reader.result;

                $.ajax({
                    type: "POST",
                    url: "https://dhbw.cheekbyte.de/calendar/claben/events",
                    data: JSON.stringify(eventJSON),
                    success: function () {
                        getAllEvents();
                        alert("Added Entry successfully");
                    },
                    error: function (xhr, status, error) { alert("Could not create a valid entry with your input.If allday is set to yes, your event must be from 00:00 AM to 23:59 PM on any days.") }
                });
            }, false);

            if (file) {
                reader.readAsDataURL(file);
            }
            else {
                $.ajax({
                    type: "POST",
                    url: "https://dhbw.cheekbyte.de/calendar/claben/events",
                    data: JSON.stringify(eventJSON),
                    success: function () {
                        getAllEvents();
                        alert("Added Entry successfully");
                    },
                    error: function (xhr, status, error) { alert("Could not create a valid entry with your input.If allday is set to yes, your event must be from 00:00 AM to 23:59 PM on any days.") }

                });
            }

        }
    );

    $("#addCategory").click(addCategory);
    $("#deleteCategory").click(deleteCategory);

});

//Gets all the available Categories from the server
function getAllCategories() {
    $.ajax({
        type: "GET",
        url: "https://dhbw.cheekbyte.de/calendar/claben/categories",
        success: function (result, status, xhr) {
            allCategories = result;

            $("#categories").empty();
            $("#categories").append("<option selected>None</option>");
            allCategories.forEach(element => {
                $("#categories").append("<option>" + element.name + "</option>")
            });
            $("#categories").append("<option>Add category</option>");
            $("#categories").append("<option>Delete category</option>");
        },
        error: function (xhr, status, error) { alert("fail " + xhr.status + xhr.statusText + error) }
    });

}

//gets all events saved for the user
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
                            if (element[key] != null) data[$("#" + key + "Out")[0].cellIndex] = "<img onclick='editImage()' height='80px' alt='No Image' src='" + element[key] + "'></img>";
                            else data[$("#" + key + "Out")[0].cellIndex] = "<img onclick='editImage()' height='80px' alt='No Image' src=''></img>";

                        }
                        else {
                            data[$("#" + key + "Out")[0].cellIndex] = element[key]
                        };
                    }

                };


                data[data.length] = "<button class='button' onclick='editEvent()'>Edit Entry</button> <button class='button' onclick='deleteImage()'>Delete Image</button> <button class='button' onclick='deleteEvent()'>Delete Entry</button>"
                let newRow = document.getElementById("resultTableBody").insertRow(-1);

                for (let i = 0; i < data.length; i++) {
                    let cell = newRow.insertCell(-1);
                    if (i == 9 || i == 11) cell.className = "noPrint"
                    if (data[i] == null || data[i] == "None") cell.innerHTML = "-";
                    else {
                        cell.innerHTML = data[i];
                    }
                }

            });

        },
        error: function (xhr, status, error) { alert("failed while retreving entries from server :  " + xhr.status + xhr.statusText + ".Please reload the site. If the error persists check your connection to the server") }
    });
}

/**
   * This function takes the inputs of the user and constructs a JSON object
   * that can be fed to the addEvent function
   * @returns JSON object in event format
   * 
   */
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
            console.log($("#allday")[0])
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

    if (input["categories"] == "None" || input["categories"] == "Delete category") {
        delete input["categories"];
    }

    else {
        input["categories"] = [allCategories[$("#categories")[0].selectedIndex - 1]];
    }

    return input;
}

//Adds a catagory to the server
function addCategory() {
    let category = '{"name":' + '"' + $("#newCategory")[0].value + '"}';
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

//Deletes a category from the server
function deleteCategory() {
    id = allCategories[$("#categories")[0].selectedIndex - 1].id;
    $.ajax({
        type: "DELETE",
        url: "https://dhbw.cheekbyte.de/calendar/claben/categories/" + id,
        success: function (result, status, xhr) {
            alert("Category deleted successfully")
            clearCategoryDialog();
            getAllCategories();
            getAllEvents();

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
    if ($(event.target)[0].value == "None" || $(event.target)[0].value == "Delete category") {
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

//Deletes image of corresponding event
function deleteImage() {
    var id = allEvents[$(event.target).closest("tr")[0].rowIndex - 1].id;
    $.ajax({
        type: "DELETE",
        url: "https://dhbw.cheekbyte.de/calendar/claben/images/" + id,
        success: function (result, status, xhr) {
            alert("Deleted Image");
            getAllEvents();
        },
        error: function (xhr, status, error) {
            alert("No Image to delete");
        }

    });
}

//resets the input fields
function resetInput() {
    $(".input").each(function (key, value) {
        if (key == 4) this.value = "Busy";
        else if (key == 6) {
            this.value = "None";
            clearCategoryDialog();
        }
        else this.value = "";
    });
}

//Rdit all fields with a corresponding input for an event
function editEvent() {
    data = allEvents[$(event.target).closest("tr")[0].rowIndex - 1];
    let input = getInputData();



    for (let key in input) {
        data[key] = input[key];
    }
    if ($("#categories")[0].selectedIndex == allCategories.length + 2) {
        data["categories"] = [];
    }

    var file = document.querySelector('input[type=file]').files[0];
    var reader = new FileReader();


    reader.addEventListener("load", function () {
        if (reader.result != null) data["imagedata"] = reader.result;


        $.ajax({
            type: "PUT",
            url: "https://dhbw.cheekbyte.de/calendar/claben/events/" + data.id,
            data: JSON.stringify(data),
            success: function () {
                alert("Event edited successfully");
                getAllEvents();
            },
            error: function (xhr, status, error) {
                console.log(xhr.status)
            }
        });
    });
    if (file) {
        reader.readAsDataURL(file);
    } else {
        $.ajax({
            type: "PUT",
            url: "https://dhbw.cheekbyte.de/calendar/claben/events/" + data.id,
            data: JSON.stringify(data),
            success: function () {
                alert("Event edited successfully");
                getAllEvents();
            },
            error: function (xhr, status, error) {
                console.log(xhr.status)
            }
        })
    }
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
    clearWeather();
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

//clears already existing weather windows
function clearWeather() {
    if ($("#wetter").find("iframe").tagName = "IFRAME") {
        $("#wetter").find("iframe").remove();
    }
}

/**
 * This function prints only the resulting table with all events
 * Printview coincides when pressing str+p
 */

function printResultTable() {
    window.print();
}

/** 
 * This functions toggles the visibility of the sidebar
 * 
*/
function toggleInput() {

    if (!sidebarOpen) {
        document.getElementById("inputSidebar").style.width = "28vw";
        document.getElementById("inputSidebar").style.minWidth = "300px";
        document.getElementById("main").style.marginLeft = "450px";
        document.getElementById("sidebarToggle").innerHTML = "Hide input fields"
    }
    else {
        document.getElementById("inputSidebar").style.width = "0";
        document.getElementById("inputSidebar").style.minWidth = "0";
        document.getElementById("main").style.marginLeft = "0";
        document.getElementById("sidebarToggle").innerHTML = "Show input fields"
    }
    sidebarOpen = !sidebarOpen;
}

