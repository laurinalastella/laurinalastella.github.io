d3.selectAll("body").on("change", updatePage);

function updatePage() {
    // d3.selectAll is an Event Listener for the option drop-down.
  var dropdownMenu = d3.selectAll("#selectOption").node();
  var dropdownMenuID = dropdownMenu.id;
  var selectedOption = dropdownMenu.value;

  console.log(dropdownMenuID);
  console.log(selectedOption);
};