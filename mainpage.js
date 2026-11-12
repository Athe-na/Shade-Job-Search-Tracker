// Authored by Athena O, Folake Oluewu, Elda Shatro, [add your name here if you work on this]

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

function filterApplicationsByStatusMatch(inputApplications, status) {
    return inputApplications.filter((application) => application.status == status);
}

/**
 * @param {Array[Application]} inputApplications - The applications to sort.
 * @param {boolean} bAscending - Whether to sort ascending or descending. True: Ascending, False: Descending.
 * @returns The applications array, sorted by status.
 */
/**
 * The current text in the search bar.
 */
var searchQuery = "";

/**
 * Returns true if the application matches every word in the search query.
 * Searches title, company, location, and where it was applied.
 * @param {Application} application
 * @param {string} query
 */
function applicationMatchesSearch(application, query) {
    var words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (words.length === 0) {
        return true;
    }
    var haystack = [
        application.positionTitle,
        application.company,
        application.location,
        application.appliedVia
    ].join(" ").toLowerCase();
    return words.every((word) => haystack.includes(word));
}

/**
 * Hooks up the search bar so the calendar updates as the user types.
 */
function setUpSearchBar() {
    var searchBox = document.getElementById("search-box");
    var searchInput = document.getElementById("search-input");
    var clearButton = document.getElementById("search-clear");

    function runSearch() {
        searchQuery = searchInput.value;
        searchBox.classList.toggle("has-query", searchQuery.length > 0);
        displayApplicationsOnCalendar();
    }

    function clearSearch() {
        searchInput.value = "";
        runSearch();
    }

    searchInput.addEventListener("input", runSearch);

    // Clicking anywhere on the pill focuses the input.
    searchBox.addEventListener("click", () => searchInput.focus());

    clearButton.addEventListener("click", (e) => {
        e.stopPropagation();
        clearSearch();
        searchInput.focus();
    });

    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            clearSearch();
            searchInput.blur();
        }
    });
}

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


// --- ANALYTICS FUNCTIONALITY ---

function updateAnalyticsPage() {
    // call all the component analytics update functions
    updateSummary();
    updateStatusBreakdown();
}

function updateSummary() {
    var summaries = document.getElementsByClassName("summary-number");
    summaries[0].innerHTML = applications.length; // Set the total number of applications.
    summaries[1].innerHTML = filterApplicationsByStatus(applications, 3, true).length; // Applications that reached interview.
    summaries[2].innerHTML = filterApplicationsByStatus(applications, 5, true).length; // Applications that were accepted.
    summaries[3].innerHTML = Math.round(filterApplicationsByStatus(applications, 2, true).length / applications.length * 100) + "%"; // Response rate.
}

function updateStatusBreakdown() {
    var stackedBar = document.getElementsByClassName("stacked-bar")[0].children;

    var appliedCount = filterApplicationsByStatusMatch(applications, 0).length;
    var reviewedCount = filterApplicationsByStatusMatch(applications, 1).length;
    var qaCount = filterApplicationsByStatusMatch(applications, 2).length;
    var interviewCount = filterApplicationsByStatusMatch(applications, 3).length;
    var declinedCount = filterApplicationsByStatusMatch(applications, 4).length;
    var acceptedCount = filterApplicationsByStatusMatch(applications, 5).length;

    stackedBar[0].style = toString("flex: " + appliedCount + "; backgroundColor: #7665d9");
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
        new Date(document.getElementsByName("dateApplied")[0].value + "T00:00"),
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
    document.getElementsByName("dateApplied")[0].value = isNaN(application.dateApplied) ? "" : toLocalDateString(application.dateApplied);
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
    colorScheme[0] = document.querySelector('input[name="color-applied"]:checked').value;
    colorScheme[1] = document.querySelector('input[name="color-review"]:checked').value;
    colorScheme[2] = document.querySelector('input[name="color-qa"]:checked').value;
    colorScheme[3] = document.querySelector('input[name="color-interview"]:checked').value;
    colorScheme[4] = document.querySelector('input[name="color-declined"]:checked').value;
    colorScheme[5] = document.querySelector('input[name="color-accepted"]:checked').value;
    saveColorSchemeToLocalStorage();
    closeSettingsPanel();
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
    displayApplicationsOnCalendar();
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
        document.getElementsByName("dateApplied")[0].value = toLocalDateString(new Date());
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
    displayApplicationsOnCalendar();
    document.getElementById("application-panel").hidden = true;
}

window.openAnalyticsPanel = function() {
    console.log("Opening analytics panel.");
    updateAnalyticsPage();
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

        console.log("Retrieved data from localStorage and passed it into the applications array.");
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
    localStorage.removeItem("applications");
    // Stringify the applications array and place it into storage.
    localStorage.setItem("applications", JSON.stringify(applications));
    console.log("Saved applications to localStorage.");
    return;
}

function clearApplicationsInLocalStorage() {
    localStorage.clear();
    console.log("Cleared localStorage successfully.");
}

/**
 * Attempts to retrieve the stored colorScheme if it exists.
 */
function getColorSchemeFromLocalStorage() {
    // Check if there is data for "colorScheme" in localStorage
    var locallyStoredColorSchemeJSON = localStorage.getItem("colorScheme");
    if (locallyStoredColorSchemeJSON) {
        // If so, pass it into the applications array.
        colorScheme = JSON.parse(locallyStoredColorSchemeJSON);

        console.log("Retrieved color scheme data from localStorage and passed it into the applications array.");
        return;
    }
    // If not, print a message to the console.
    console.log("No item to retreive under \"colorScheme\".");
}

/**
 * Stringifies the colorScheme array as a JSON object and places it into localStorage, overriding the previous value.
 * Call this every time a change to the color scheme is saved.
 */
function saveColorSchemeToLocalStorage() {
    // Clear localstorage to make room for new object.
    localStorage.removeItem("colorScheme");
    // Stringify the applications array and place it into storage.
    localStorage.setItem("colorScheme", JSON.stringify(colorScheme));
    console.log("Saved colorScheme to localStorage.");
    return;
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

// --- CALENDAR (YEAR VIEW) ---

var MONTH_NAMES = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

/**
 * The year currently shown on the calendar. Starts on the current year.
 */
var selectedYear = new Date().getFullYear();

/**
 * Draws all twelve months of selectedYear as columns and places each application
 * in its month. Keeps the user's scroll position so saving or searching doesn't jump.
 */
function displayApplicationsOnCalendar() {
    var calendar = document.getElementById("calendar");
    var previousScroll = calendar.scrollLeft;
    calendar.innerHTML = "";

    var today = new Date();
    var isThisYear = selectedYear === today.getFullYear();
    document.getElementById("calendar-year").textContent = selectedYear;

    // Create the twelve month columns.
    var monthSections = MONTH_NAMES.map((name, monthIndex) => {
        var monthSection = document.createElement("section");
        monthSection.classList.add("month");
        monthSection.dataset.month = monthIndex;
        monthSection.setAttribute("aria-label", name + " " + selectedYear);

        var monthHeading = document.createElement("h3");
        monthHeading.textContent = name + " " + selectedYear;

        if (isThisYear && monthIndex === today.getMonth()) {
            monthSection.classList.add("current");
            var badge = document.createElement("span");
            badge.classList.add("now-badge");
            badge.textContent = "This month";
            monthHeading.appendChild(badge);
        }

        monthSection.appendChild(monthHeading);
        calendar.appendChild(monthSection);
        return monthSection;
    });

    var matchCount = 0;
    var monthCounts = new Array(12).fill(0);

    // Add each application from the selected year to its month.
    applications.forEach((application, index) => {
        if (application.dateApplied.getFullYear() !== selectedYear) {
            return;
        }

        // Skip applications that don't match the search bar.
        if (!applicationMatchesSearch(application, searchQuery)) {
            return;
        }
        matchCount++;

        var monthIndex = application.dateApplied.getMonth();
        monthCounts[monthIndex]++;

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

        monthSections[monthIndex].appendChild(jobCard);
    });

    // Show how many results the search found.
    var searchCount = document.getElementById("search-count");
    if (searchCount) {
        searchCount.textContent = searchQuery.trim()
            ? (matchCount === 0 ? "No results" : matchCount + (matchCount === 1 ? " result" : " results"))
            : "";
        searchCount.classList.toggle("no-results", searchQuery.trim() !== "" && matchCount === 0);
    }

    // Empty months: say why they're empty, and offer a quick add when not searching.
    monthSections.forEach((monthSection, monthIndex) => {
        if (monthCounts[monthIndex] > 0) {
            return;
        }
        if (searchQuery.trim()) {
            var empty = document.createElement("p");
            empty.classList.add("search-empty");
            empty.textContent = "No matches";
            monthSection.appendChild(empty);
            return;
        }

        // One dashed box: "No applications" with a "+ Add" action inside.
        var addButton = document.createElement("button");
        addButton.type = "button";
        addButton.classList.add("month-add");
        addButton.innerHTML = "<span>No applications</span><strong>+ Add</strong>";
        addButton.setAttribute("aria-label", "Add application in " + MONTH_NAMES[monthIndex]);
        addButton.addEventListener("click", () => openApplicationPanelForMonth(monthIndex));
        monthSection.appendChild(addButton);
    });

    calendar.scrollLeft = previousScroll;
    updateScrollArrows();
}

/**
 * Opens a new application with its date set inside the chosen month
 * (today if it's the current month, otherwise the 1st).
 */
function openApplicationPanelForMonth(monthIndex) {
    openApplicationPanel();
    var today = new Date();
    var date = (selectedYear === today.getFullYear() && monthIndex === today.getMonth())
        ? today
        : new Date(selectedYear, monthIndex, 1);
    document.getElementsByName("dateApplied")[0].value = toLocalDateString(date);
}

/**
 * Formats a Date as YYYY-MM-DD in local time (for date inputs).
 */
function toLocalDateString(date) {
    var month = String(date.getMonth() + 1).padStart(2, "0");
    var day = String(date.getDate()).padStart(2, "0");
    return date.getFullYear() + "-" + month + "-" + day;
}

/**
 * Shows the left/right scroll arrows only when there are more months in that direction.
 */
function updateScrollArrows() {
    var calendar = document.getElementById("calendar");
    var maxScroll = calendar.scrollWidth - calendar.clientWidth;
    document.getElementById("scroll-left").hidden = calendar.scrollLeft <= 2;
    document.getElementById("scroll-right").hidden = calendar.scrollLeft >= maxScroll - 2;
}

/**
 * Scrolls the calendar to the given month.
 * alignEnd: true puts the month as the last visible column (past months to its left);
 * false puts it as the first visible column.
 */
function scrollToMonth(monthIndex, smooth = true, alignEnd = false) {
    var calendar = document.getElementById("calendar");
    var monthSection = calendar.children[monthIndex];
    if (!monthSection) {
        return;
    }
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var left = alignEnd
        ? monthSection.offsetLeft + monthSection.offsetWidth - calendar.clientWidth
        : monthSection.offsetLeft;
    calendar.scrollTo({
        left: Math.max(0, left),
        behavior: smooth && !reduceMotion ? "smooth" : "auto"
    });
}

/**
 * Scrolls the calendar by one month column. direction: -1 (back) or 1 (forward).
 */
function scrollByMonth(direction) {
    var calendar = document.getElementById("calendar");
    var monthWidth = calendar.children[0] ? calendar.children[0].offsetWidth + 12 : calendar.clientWidth / 4;
    calendar.scrollBy({ left: direction * monthWidth, behavior: "smooth" });
}

/**
 * Switches the calendar to a different year.
 */
function changeYear(delta) {
    selectedYear += delta;
    displayApplicationsOnCalendar();
    scrollToMonth(0, false);
}

/**
 * Jumps back to the current year and scrolls to the current month.
 */
function goToToday() {
    var today = new Date();
    if (selectedYear !== today.getFullYear()) {
        selectedYear = today.getFullYear();
        displayApplicationsOnCalendar();
    }
    scrollToMonth(today.getMonth(), true, true);
}

/**
 * Hooks up the year arrows, Today button, and scroll tracking.
 */
function setUpCalendarNavigation() {
    document.getElementById("year-prev").addEventListener("click", () => changeYear(-1));
    document.getElementById("year-next").addEventListener("click", () => changeYear(1));
    document.getElementById("today-btn").addEventListener("click", goToToday);
    document.getElementById("scroll-left").addEventListener("click", () => scrollByMonth(-1));
    document.getElementById("scroll-right").addEventListener("click", () => scrollByMonth(1));
    document.getElementById("calendar").addEventListener("scroll", updateScrollArrows, { passive: true });
    window.addEventListener("resize", updateScrollArrows);
}

function homeKeyboardEventListeners(e) {
    // "/" focuses the search bar (unless the user is already typing somewhere).
    if (e.key == "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
        e.preventDefault();
        document.getElementById("search-input").focus();
        return;
    }
    // Arrow keys scroll months; T jumps to today (when not typing or focused on a control).
    var typing = ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName);
    if (!typing && !e.altKey && !e.ctrlKey && !e.metaKey) {
        if (e.key == "ArrowLeft" || e.key == "ArrowRight") {
            e.preventDefault();
            scrollByMonth(e.key == "ArrowLeft" ? -1 : 1);
            return;
        }
        if (e.key == "t" || e.key == "T") {
            goToToday();
            return;
        }
    }
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
    getColorSchemeFromLocalStorage();

    // Only create test data if no applications exist.
    if (applications.length === 0) {
        createTestData();
        saveApplicationsToLocalStorage();
    }

    // Set the applications that should currently be displayed.
    currentlyDisplayedApplications = applications;

    setUpSearchBar();
    setUpCalendarNavigation();
    displayApplicationsOnCalendar();
    scrollToMonth(new Date().getMonth(), false, true);
    displayApplicationsInConsole();
    addHomeKeyboardEventListeners();
    addDebugResetKey();
    refreshYourSearchSummary();
    // Folake this would be a good place to create some test data.
}

window.onload = initialize;
//window.applications = applications;