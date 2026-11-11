// Authored by Athena Osborne, Folake Oluewu, Elda Shatro, [add your name here if you work on this]

class Application {

    /**
     * Creates and returns an Application object.
     * @param {string} positionTitle 
     * @param {string} company 
     * @param {string} location 
     * @param {string} applicationLink 
     * @param {Date} dateApplied - The date applied. Pass a date object.
     * @param {string} appliedVia 
     * @param {int} status - The status of the application. Ranges from 0 to 5. 0: Applied. 1: Under Review. 2: QA. 3: Interview. 4: Accepted. 5: Rejected.
     * 
     */
    constructor(positionTitle, company, location, applicationLink, dateApplied, appliedVia, status) {
        this.positionTitle = positionTitle; // String
        this.company = company; // String
        this.location = location; // String
        this.applicationLink = applicationLink; // String
        this.dateApplied = dateApplied; // Date
        this.appliedVia = appliedVia;
        this.status = status; // Int
        return this;
    }

    /**
     * Compares the dates of the calling Application and the the passed in Application.
     * @param {Application} other - The other application to be compared to the calling object.
     * @returns {boolean} True if caller date >= passed date. False if caller date < passed date.
     */
    compareDateApplied(other) {
        return this.dateApplied.getTime() >= other.dateApplied.getTime();
    }
}


// --- APPLICATION DATA MANIPULATION ---

/**
 * The array of ALL applications the user has created.
 */
var applications = [];

/**
 * The array of applications which will be currently displayed.
 */
var currentlyDisplayedApplications = [];

/**
 * The array of values representing user preferred color scheme.
 */
var colorScheme = [
    "status-purple",
    "status-blue",
    "status-yellow",
    "status-orange",
    "status-green",
    "status-red"
];

/**
 * Filtering function for the applications array by date.
 * @param {Array[Application]} inputApplications - The applications to filter.
 * @param {Date} date - The date to use as the cutoff. Inclusive.
 * @param {boolean} bAfter - Whether to filter by applications before or after the date. True: After, False: Before.
 * @returns Array of applications fitting the filter.
 */
function filterApplicationsByDate(inputApplications, date, bAfter) {
    return inputApplications.filter((application) => bAfter ? application.dateApplied.getTime() >= date.getTime() : application.dateApplied.getTime() <= date.getTime());
}

/**
 * Filtering function for the applications array by status.
 * @param {Array[Application]} inputApplications - The applications to filter.
 * @param {int} status - The status of the application to use as the cutoff. Inclusive.
 * @param {boolean} bAfter - Whetther to filter by statuses higher or lower the input. True: After, False: Before.
 * @returns Array of applications fitting the filter.
 */
function filterApplicationsByStatus(inputApplications, status, bAfter) {
    return inputApplications.filter((application) => bAfter ? application.status >= status : application.status <= status);
}

/**
 * @param {Array[Application]} inputApplications - The applications to sort.
 * @param {boolean} bAscending - Whether to sort ascending or descending. True: Ascending, False: Descending.
 * @returns The applications array, sorted by status.
 */
function sortApplicationsByStatus(inputApplications, bAscending) {
    return inputApplications.toSorted((a, b) => bAscending ? a.status - b.status : b.status - a.status);
}

function refreshHomePageFromCurrentlyDisplayedApplications() {
    // TODO: Implement behavior for reading currentlyDisplayedApplications to the home page.
}

/**
 * Calculates and sets the values for the 'Your Search' side widget.
 */
function refreshYourSearchSummary() {
    // Grab fields
    var totalApplicationsField = document.querySelector("#total-applications");
    var reachedInterviewField = document.querySelector("#total-interviews");
    var declinedField = document.querySelector("#total-declined");

    // Fill in info
    totalApplicationsField.innerHTML = applications.length;
    reachedInterviewField.innerHTML = filterApplicationsByStatus(applications, 3, true).length;
    declinedField.innerHTML = filterApplicationsByStatus(applications, 5, true).length;
}


// --- BUTTON FUNCTIONALITY --- 

/**
 * Index (in the applications array) of the application currently open in the panel.
 * null means the panel is creating a new application.
 */
var editingApplicationIndex = null;

/**
 * Reads the application panel's fields into a new Application object.
 */
function readApplicationForm() {
    var checkedStatus = document.querySelector('#application-form input[name="status"]:checked');
    return new Application(
        document.getElementsByName("positionTitle")[0].value,
        document.getElementsByName("company")[0].value,
        document.getElementsByName("location")[0].value,
        document.getElementsByName("applicationLink")[0].value,
        new Date(document.getElementsByName("dateApplied")[0].value),
        document.getElementsByName("appliedVia")[0].value,
        checkedStatus ? parseInt(checkedStatus.value) : 0,
    );
}

/**
 * Fills the application panel's fields with the details of an application.
 * @param {Application} application
 */
function fillApplicationForm(application) {
    document.getElementsByName("positionTitle")[0].value = application.positionTitle || "";
    document.getElementsByName("company")[0].value = application.company || "";
    document.getElementsByName("location")[0].value = application.location || "";
    document.getElementsByName("applicationLink")[0].value = application.applicationLink || "";
    document.getElementsByName("dateApplied")[0].value = isNaN(application.dateApplied) ? "" : application.dateApplied.toISOString().slice(0, 10);
    document.getElementsByName("appliedVia")[0].value = application.appliedVia || "";

    var statusRadio = document.querySelector('#application-form input[name="status"][value="' + application.status + '"]');
    if (statusRadio) {
        statusRadio.checked = true;
    }
}

/**
 * Saves the application panel. Updates the open application if one was clicked,
 * otherwise creates a new application and pushes it to the applications array.
 */
window.saveCurrentApplication = function() {
    console.log("Saving current application.");
    var application = readApplicationForm();
    if (editingApplicationIndex === null) {
        applications.push(application);
    } else {
        applications[editingApplicationIndex] = application;
    }
    displayApplicationsOnCalendar();
    closeApplicationPanel();
    refreshYourSearchSummary();
    saveApplicationsToLocalStorage();
}

/**
 * Opens the application panel showing the details of an existing application.
 * @param {int} index - Index of the application in the applications array.
 */
window.openApplicationDetails = function(index) {
    var application = applications[index];
    console.log("Opening details for application:", application);
    openApplicationPanel(index);
}

/**
 * Deletes the application currently open in the panel.
 */
window.deleteCurrentApplication = function() {
    if (editingApplicationIndex !== null) {
        applications.splice(editingApplicationIndex, 1);
        displayApplicationsOnCalendar();
        refreshYourSearchSummary();
        saveApplicationsToLocalStorage();
    }
    closeDeleteConfirm();
    closeApplicationPanel();
}

window.saveApplications = function() {
    saveApplicationsToLocalStorage();
}

window.displayApplicationsInConsole = function() {
    console.log("Applications: ");
    console.log(applications);
}

window.clearAllApplicationsEverywhere = function() {
    clearApplicationsInLocalStorage();
    applications = [];
    currentlyDisplayedApplications = [];
}

window.saveSettings = function() {
    console.log("Saving settings.");
    settings = [

    ];
}

window.openSettingsPanel = function() {
    console.log("Opening settings panel.");
    removeHomeKeyboardEventListeners();
    addSettingsKeyboardEventListeners();
    document.getElementById("settings-panel").hidden = false;
}

window.closeSettingsPanel = function() {
    console.log("Closing the settings panel.");
    removeSettingsKeyboardEventListeners();
    addHomeKeyboardEventListeners();
    document.getElementById("settings-panel").hidden = true;
}

window.changeColorScheme = function(itemIndex, colorIndex) {
    var colorClass = [
        "status-purple",
        "status-blue",
        "status-yellow",
        "status-orange",
        "status-red",
        "status-green",
        "status-teal"
    ];

    colorScheme[itemIndex] = colorClass[colorIndex];
}

/**
 * Opens the application panel.
 * @param {int} [index] - Index of an existing application to show. Leave out to create a new application.
 */
window.openApplicationPanel = function(index) {
    console.log("Opening the application panel.");
    var form = document.getElementById("application-form");
    var title = document.getElementById("application-panel-title");
    var deleteButton = document.getElementById("delete-btn");

    if (typeof index === "number" && applications[index]) {
        editingApplicationIndex = index;
        fillApplicationForm(applications[index]);
        title.textContent = "Edit application";
        deleteButton.hidden = false;
    } else {
        editingApplicationIndex = null;
        form.reset();
        document.getElementsByName("dateApplied")[0].value = new Date().toISOString().slice(0, 10);
        title.textContent = "New application";
        deleteButton.hidden = true;
    }

    removeHomeKeyboardEventListeners();
    addApplicationKeyboardEventListeners();
    document.getElementById("application-panel").hidden = false;
}

window.closeApplicationPanel = function() {
    console.log("Closing the application panel.");
    removeApplicationKeyboardEventListeners();
    addHomeKeyboardEventListeners();
    document.getElementById("application-panel").hidden = true;
}

window.openAnalyticsPanel = function() {
    console.log("Opening analytics panel.");
    document.getElementById("analytics-panel").hidden = false;
}

window.closeAnalyticsPanel = function() {
    console.log("Closing the analytics panel.");
    document.getElementById("analytics-panel").hidden = true;
}

window.openDeleteConfirm = function() {
    if (editingApplicationIndex === null) {
        return;
    }
    var application = applications[editingApplicationIndex];
    document.getElementById("delete-confirm-desc").textContent = application.positionTitle + ", " + application.company;
    document.getElementById("delete-confirm").hidden = false;
}

window.closeDeleteConfirm = function() {
    document.getElementById("delete-confirm").hidden = true;
}


// --- STORAGE FUNCTIONALITY ---

/**
 * Attempts to retrieve the stored application data if it exists.
 */
function getDataFromLocalStorage() {
    // Check if there is data for "applications" in localStorage.
    var locallyStoredApplicationsJSON = localStorage.getItem("applications");
    if (locallyStoredApplicationsJSON) {
        // If so, pass it into the applications array.
        applications = JSON.parse(locallyStoredApplicationsJSON);

        // Convert saved date strings back into Date objects.
        applications.forEach((application) => {
            application.dateApplied = new Date(application.dateApplied);
        });

        console.log("Retrieved data from localStorage and passed it into the applications array.")
        return;
    }
    // If not, print a message to the console.
    console.log("No item to retrieve under \"applications\".");
}

/**
 * Stringifies the applications array as a JSON object and places it into localStorage, overriding the previous value.
 * Call this every time a change to an application is saved.
 */
function saveApplicationsToLocalStorage() {
    // Clear localstorage to make room for new object.
    localStorage.clear();
    // Stringify the applications array and place it into storage.
    localStorage.setItem("applications", JSON.stringify(applications));
    console.log("Saved applications to localStorage.");
    return true;
}

function clearApplicationsInLocalStorage() {
    localStorage.clear();
    console.log("Cleared localStorage successfully.");
}

// --- EVENT HANDLING ---

function createTestData() {
    applications = [
        new Application(
            "UX Designer Intern",
            "Pinterest",
            "New York City, NY",
            "https://careers.pinterest.com",
            new Date("2026-08-18"),
            "Linkedin",
            0
        ),
        
        new Application(
            "Volleyball Coach",
            "Walt Disney Magnet School",
            "Chicago, IL",
            "https://careers.disney.com",
            new Date("2026-08-01"),
            "Handshake",
            1
        ),
        
        new Application(
            "Design Engineer",
            "CTA",
            "Chicago, IL",
            "https://careers.cta.com",
            new Date("2026-07-27"),
            "Linkedin",
            0
        ),
        
        new Application(
            "Fabrication Lab Aide",
            "Chicago Public Library",
            "Chicago, IL",
            "https://careers.fablab.com",
            new Date("2026-07-19"),
            "Indeed",
            2
        ),
       
        new Application(
            "Software Engineer Lead",
            "Google",
            "New York City, NY",
            "https://careers.google.com",
            new Date("2026-10-10"),
            "Linkedin",
            3
        ),
       
        new Application(
            "Product Manager",
            "Instagram",
            "Chicago, IL",
            "https://careers.instagram.com",
            new Date("2026-10-23"),
            "Handshake",
            4
        ),
      
        new Application(
            "Yoga Instructor",
            "Yoga Box",
            "New York City, NY",
            "https://careers.yogabox.com",
            new Date("2026-09-04"),
            "Indeed",
            5
        )
    ];
}

function displayApplicationsOnCalendar() {

    // Find the calendar on the webpage.
    var calendar = document.getElementsByClassName("calendar")[0];

    console.log("Calendar element:", calendar);

    // Clear existing calendar content.
    calendar.innerHTML = "";

    // Create the four month sections.
    var months = ["July", "August", "September", "October"];

    months.forEach((month) => {

        var monthSection = document.createElement("section");
        monthSection.classList.add("month");

        var monthHeading = document.createElement("h3");
        monthHeading.innerHTML = month + " 2026";

        monthSection.appendChild(monthHeading);

        calendar.appendChild(monthSection);
    });

    // Add each application to its corresponding month.
    applications.forEach((application, index) => {

        var monthIndex = application.dateApplied.getMonth();

        // Only display applications from July through October.
        if (monthIndex < 6 || monthIndex > 9) {
            return;
        }

        var monthSection = calendar.children[monthIndex - 6];

        var jobCard = document.createElement("div");

        // Match the application status to its CSS class. Uses the colorScheme array.
        jobCard.classList.add("job", colorScheme[application.status]);

        var titleElement = document.createElement("h4");
        titleElement.textContent = application.positionTitle;
        var companyElement = document.createElement("p");
        companyElement.textContent = application.company;
        jobCard.append(titleElement, companyElement);

        // Clicking (or pressing Enter/Space on) a card opens that application's details.
        jobCard.tabIndex = 0;
        jobCard.setAttribute("role", "button");
        jobCard.setAttribute("aria-label", "View " + application.positionTitle + " at " + application.company);
        jobCard.addEventListener("click", () => openApplicationDetails(index));
        jobCard.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openApplicationDetails(index);
            }
        });

        monthSection.appendChild(jobCard);
    });
}


// --- EVENT HANDLING ---

function homeKeyboardEventListeners(e) {
    if (e.key == "q" && e.altKey) {
        console.log("Keyboard shortcut: Creating new application.");
        window.openApplicationPanel();
        displayApplicationsInConsole();
        refreshYourSearchSummary();
    }
    if (e.key == "s" && e.altKey) {
        console.log("Keyboard shortcut: Sorting applications by status.");
        sortApplicationsByStatus(applications);
    }
    if (e.key == "a" && e.altKey) {
        console.log("Keyboard shortcut: Opening analytics panel.");
        window.openAnalyticsPanel();
    }
    if (e.key == "w" && e.altKey) {
        console.log("Keyboard shortcut: Opening settings panel.");
        window.openSettingsPanel();
    }
    if (e.key == "Tab") {
        console.log("Keyboard shortcut: Advance field.");
        // TODO: Implement function with defined behavior for field advancing. 
    }
    // if (e.key == "O") {
    //     console.log("Debug keyboard shortcut: clearing localStorage.");
    //     clearApplications();
    // }
}

/**
 * Adds event listeners for the keyboard shortcuts supported by Shade's home menu.
 */
function addHomeKeyboardEventListeners() {
    window.addEventListener("keydown", homeKeyboardEventListeners);
}

/**
 * Removes event listeners for the keyboard shortcuts supported by Shade's home menu. Called when a panel is opened.
 */
function removeHomeKeyboardEventListeners() {
    window.removeEventListener("keydown", homeKeyboardEventListeners);
}


function applicationKeyboardEventListeners(e) {
    if (e.key == "Tab") {
        console.log("Keyboard shortcut: Advance field.");
    }
    if (e.key == "ArrowRight") {
        console.log("Keyboard shortcut: Advance status.");
    }
    if (e.key == "ArrowLeft") {
        console.log("keyboard shortcut: Regress status.");
    }
    if (e.key == "s" && e.altKey) {
        console.log("Keyboard shortcut: Save application");
        saveCurrentApplication();
    }
    if (e.key == "d" && e.altKey) {
        console.log("Keyboard shortcut: Delete application");
        openDeleteConfirm();
    }
    if (e.key == "Escape") {
        console.log("Keyboard shortcut: Close application panel.");
        closeApplicationPanel();
    }
}

/**
 * Adds event listeners for the keyboard shortcuts supported by Shade's application panel.
 */
function addApplicationKeyboardEventListeners() {
    window.addEventListener("keydown", applicationKeyboardEventListeners);
}

/**
 * Removes event listeners for the keyboard shortucts supported by Shade's application panel. Called when the panel is closed.
 */
function removeApplicationKeyboardEventListeners() {
    window.removeEventListener("keydown", applicationKeyboardEventListeners);
}


function settingsKeyboardEventListeners(e) {
    if (e.key == "Tab") {
        console.log("Keyboard shortcut: Advance field.");
    }
    if (e.key == " ") {
        console.log("Keyboard shortcut: Select.");
    }
    if (e.key == "s" && e.altKey) {
        console.log("Keyboardd shortcut: Save settings.");
    }
    if (e.key == "Escape") {
        console.log("Keyboard shortcut: Close settings panel.");
        closeSettingsPanel();
    }
}

/**
 * Adds event listeners for the keyboard shortcuts supported by Shade's settings panel.
 */
function addSettingsKeyboardEventListeners() {
    window.addEventListener("keydown", settingsKeyboardEventListeners);
}

/**
 * Removes event listeners for the keyboard shortcuts supported by Shade's settings panel. Called when the panel is closed.
 */
function removeSettingsKeyboardEventListeners() {
    window.removeEventListener("keydown", settingsKeyboardEventListeners);
}


function analyticsKeyboardEventListeners(e) {
    // TODO: Port the keybindings on the analytics panel to this function.
}

/**
 * Adds event listeners for the keyboard shortcuts supported by Shade's analytics panel.
 */
function addAnalyticsKeyboardEventListeners() {
    window.addEventListener("keydown", analyticsKeyboardEventListeners);
}

/**
 * Removes event listeners for the keyboard shortcuts supported by Shade's analytics panel. Called when the panel is closed.
 */
function removeAnalyticsKeyboardEventListeners() {
    window.removeEventListener("keydown", analyticsKeyboardEventListeners);
}

/**
 * DEBUG: Adds a keybind to reset localstorage
 */
function addDebugResetKey() {
    window.addEventListener("keydown", (e) => {
        if (e.key == "9" && e.ctrlKey) {
            console.log("DEBUG Shortcut: Resetting localstorage");
            clearApplicationsInLocalStorage();
        }
    });
}


// --- INITIALIZATION ---

function initialize() {
    console.log("Initializing Shade.");

    // Perform startup taks.
    getDataFromLocalStorage();

    // Only create test data if no applications exist.
    if (applications.length === 0) {
        createTestData();
        saveApplicationsToLocalStorage();
    }

    // Set the applications that should currently be displayed.
    currentlyDisplayedApplications = applications;

    displayApplicationsOnCalendar();
    displayApplicationsInConsole();
    addHomeKeyboardEventListeners();
    addDebugResetKey();
    refreshYourSearchSummary();
    // Folake this would be a good place to create some test data.
}

window.onload = initialize;
//window.applications = applications;