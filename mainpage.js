// Authored by Athena Osborne, [add your name here if you work on this]

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

window.setStatusFilter = function(status) {
    // TODO: Implement behavior for changing the visually active status filter, changing the currentlyDisplayedApplications, and refreshing the home page from the currently displayed applications.

    refreshHomePageFromCurrentlyDisplayedApplications();
}

window.openAnalyticsPanel = function() {
    console.log("Opening analytics panel.");
    // TODO: Make the analytics panel visible, (optionally) play the opening animation, and defocus the home page.
}

window.closeAnalyticsPanel = function() {
    console.log("Closing the analytics panel.");
    // TODO: Hide the analytics panel, (optionally) play the closing animation, and refocus the home page.
}

window.openSettingsPanel = function() {
    console.log("Opening settings panel.");
    // TODO: Make the settings panel visible, (optionally) play the opening animation, and defocus the home page.
}

window.closeSettingsPanel = function() {
    console.log("Closing the settings panel.");
    // TODO: Hide the settings panel, (optionally) play the closing animation, and refocus the home page.
}

window.openApplicationPanel = function() {
    console.log("Opening the application panel.");
    // TODO: Make the application panel visible, (optionally) play tthe opening animation, and defocus the home page.
}

window.closeApplicationPanel = function() {
    console.log("Closing the application panel.");
    // TODO: Hide the application panel, (optionally) play the closing animation, and refocus the home page.
}

/**
 * NOT CURRENTLY IN USE.
 */
window.createNewApplication = function() {
    console.log("Creating a new application.");
    var testApplication = new Application(
        "Night Guard",
        "Freddy Fazbear's Pizza",
        "Chicago, IL",
        "https://freddys.com",
        "261105",
        "Indeed",
        1);
    applications.push(testApplication);
}

window.saveCurrentApplication = function(positionTitle = "", company = "", location = "", applicationLink = "", dateApplied = new Date(), appliedVia = "", status = 0) {
    applications.push(new Application());
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

/**
 * Adds event listeners for the keyboard shortcuts supported by Shade.
 */
function addKeyboardEventListeners() {
    window.addEventListener("keydown", function (e)
    {
        if (e.key == "q" && e.altKey) {
            console.log("Keyboard shortcut: Creating new application.");
            window.openApplicationPanel();
            createNewApplication();
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
            window.openAnalyticsPanel();
        }
        if (e.key == "Tab") {
            console.log("Keyboard shortcut: Advance field.");
            // TODO: Implement function with defined behavior for field advancing. 
        }
        // if (e.key == "O") {
        //     console.log("Debug keyboard shortcut: clearing localStorage.");
        //     clearApplications();
        // }
    });
}

// --- INITIALIZATION ---

function initialize() {
    console.log("Initializing Shade.");

    // Perform startup taks.
    getDataFromLocalStorage();
    displayApplicationsInConsole();
    addKeyboardEventListeners();
    refreshYourSearchSummary();
    // Folake this would be a good place to create some test data.

    currentlyDisplayedApplications = applications;
}

window.onload = initialize();