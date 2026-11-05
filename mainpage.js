// Authored by Athena Osborne, [add your name here if you work on this]

class Application {

    /**
     * Creates and returns an Application object.
     * @param {string} positionTitle 
     * @param {string} company 
     * @param {string} location 
     * @param {string} applicationLink 
     * @param {int} dateApplied - The date applied. Formatted as a yymmdd integer for easy comparison.
     * @param {string} appliedVia 
     * @param {int} status - The status of the application. Ranges from 0 to 5. 0: Applied. 1: Under Review. 2: QA. 3: Interview. 4: Accepted. 5: Rejected.
     * 
     */
    constructor(positionTitle, company, location, applicationLink, dateApplied, appliedVia, status) {
        this.positionTitle = positionTitle; // String
        this.company = company; // String
        this.location = location; // String
        this.applicationLink = applicationLink; // String
        this.dateApplied = dateApplied; // Int
        this.appliedVia = appliedVia;
        this.status = status;
        return this;
    }

    /**
     * Compares the dates of the calling Application and the the passed in Application.
     * @param {Application} other - The other application to be compared to the calling object.
     * @returns {boolean} True if caller date >= passed date. False if caller date < passed date.
     */
    compareDateApplied(other) {
        return this.dateApplied >= other.dateApplied;
    }
}

// Global applications array used as primary data structure in the backend.
var applications = [];

window.openAnalyticsPanel = function() {
    console.log("Opening analytics panel")
}

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

window.saveApplications = function() {
    saveApplicationsToLocalStorage();
}

window.displayApplicationsInConsole = function() {
    console.log("Applications: ");
    console.log(applications);
}

window.clearApplications = function() {
    clearApplicationsInLocalStorage();
    applications = [];
}

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

function initialize() {
    console.log("Initializing Shade.");

    // Perform startup taks.
    getDataFromLocalStorage();
    displayApplicationsInConsole();
    // Folake this would be a good place to create some test data.
}

window.onload = initialize();