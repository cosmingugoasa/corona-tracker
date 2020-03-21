$(document).ready( function() {
    $( "path" ).hover( function(){
        $(this).popover({
            title: $(this).attr('id'),
            content: "Number of infected",
            container: 'body'
        });
    });
});
