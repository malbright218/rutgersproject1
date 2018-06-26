$(document).ready(function (){



//========================================================================
//Rank,Name,Brewery,Style,Geo
for (var i = 0; i < data.length; i++) {

    $("tbody");
    // Create and save a reference to new empty table row
    var newrow = $("<tr></tr>");
    // Create and save references to 3 td elements containing the Title, Year, and Actors from the AJAX response object
    var title = data[i].rank;
    var titledata = ("<td>" + title + "</td>");
    //++++++++++++++++++++++++++++++++++++++++++
    var year = data[i].name;
    
    var yeardata = ("<td>" + year + "</td>");
    //++++++++++++++++++++++++++++++++++++++++++
    var genre = data[i].brewloc;
    
    var genredata = ("<td>" + genre + "</td>");
    //++++++++++++++++++++++++++++++++++++++++++
    var tomato = data[i].style;
    var style = tomato.toLowerCase();
    var tomatodata = ("<td>" + style + "</td>");
    //++++++++++++++++++++++++++++++++++++++++++

    // Append the td elements to the new table row
    $(newrow).append(titledata, yeardata, genredata, tomatodata);
    
    
    // Append the table row to the tbody element
    $("tbody").append(newrow);
    

    

}




      


});
