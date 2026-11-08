// Authored by Athena Osborne, Elda Shatro[add your name here if you work on this]
window.openSettingsPanel = function() {
    console.log("Opening settings panel.");
    document.getElementById("settings-panel").hidden = false;
}

window.closeSettingsPanel = function() {
    console.log("Closing the settings panel.");
    document.getElementById("settings-panel").hidden = true;
}

window.openApplicationPanel = function() {
    console.log("Opening the application panel.");
    document.getElementById("application-panel").hidden = false;
}

window.closeApplicationPanel = function() {
    console.log("Closing the application panel.");
    document.getElementById("application-panel").hidden = true;
}

window.openDeleteConfirm = function() {
    document.getElementById("delete-confirm").hidden = false;
}

window.closeDeleteConfirm = function() {
    document.getElementById("delete-confirm").hidden = true;
}