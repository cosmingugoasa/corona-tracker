$(document).ready( () => {
    window.addEventListener("mousemove", function (e) {
        x_pos = e.clientX;
        y_pos = e.clientY;
    });

    $( "path" ).hover( () => {
        $( "path" ).popover({
            title: "Country Name.",
            content: "Number of infected.",
        });
    });
});
