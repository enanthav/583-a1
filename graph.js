/* Based off tutorial & code from http://www.d3noob.org/2014/07/d3js-multi-line-graph-with-automatic.html */
var margin = {top: 20, right: 20, bottom: 50, left: 40},
    width = 960 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

// Set ranges
var x = d3.scale.linear()
    .range([0, width]);
var y = d3.scale.linear()
    .range([height, 0]);

// Define the lines
var incidenceLine = d3.svg.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.inc_rate); });

var mortalityLine = d3.svg.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.mortality_rate); });

// Create SVG canvas
var svg = d3.select("#graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.tsv("incidence_10.tsv", function(error, data) {
    if (error) throw error;
    // Coerce the data to numbers.
    data.forEach(function(d) {
        d.inc_rate = +d["Age-Adjusted Rate"];
        d.year = +d.Year;
        d.count = +d.Count;
    });

    // Group data by cancer type
    var dataGroup = d3.nest()
        .key(function(d) {
            return d["Leading Cancer Sites"];
        })
        .entries(data);


    // Compute the scales’ domains.
    x.domain([d3.min(data, function(d){ return d.year; }), d3.max(data, function(d){ return d.year; })]);
    y.domain([0, d3.max(data, function(d){
        //console.log(d.inc_rate);
        return d.inc_rate; })]);

    legendSpace = width/dataGroup.length;
    var color = d3.scale.category10();


    // Add the paths
    dataGroup.forEach(function(d, i) {
 /*       console.log(i);
        console.log(d.values[i]);*/
        svg.append("path")
            .attr("class", "line")
            .style("stroke", function() {
                return d.color = color(d.key); })
            .attr("id", 'tag'+d.key.replace(/\s+/g, ''))
            .attr("d", incidenceLine(d.values));

        // Add the legend
        svg.append("rect")
            .attr("x", (legendSpace/2) + i*legendSpace)
            .attr("y", height + (margin.bottom/2)+ 1)
            .attr("width", 10)
            .attr("height", 10)
            .attr("class", "legend")    // style the legend
            .style("fill", function() { // dynamic colours
                return d.color = color(d.key); })
            .on("click", function(){
                // Determine if current line is visible
                var active   = d.active ? false : true,
                    newOpacity = active ? 0 : 1;
                // Hide or show the elements based on the ID
                d3.select("#tag"+d.key.replace(/\s+/g, ''))
                    .transition().duration(100)
                    .style("opacity", newOpacity);
                // Update whether or not the elements are active
                d.active = active;
            });

        svg.append("text")
            .attr("x", (legendSpace/2) + (i*legendSpace)+ 12)
            .attr("y", height + (margin.bottom/2)+ 10)
            .text(d.key);
    });

    // Add the x-axis.
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.format("d")));

    // Add the y-axis.
    svg.append("g")
        .attr("class", "y axis")
        .call(d3.svg.axis().scale(y).orient("left"));
});

    function updateData() {
        console.log("Update Data");
        // Get the data again
        d3.tsv("mortality_10.tsv", function (error, data) {
            if (error) throw error;
            // Coerce the data to numbers.
            data.forEach(function (d) {
                d.inc_rate = +d["Age-Adjusted Rate"];
                d.year = +d.Year;
                d.count = +d.Count;
            });

            // Group data by cancer type
            var cancers = d3.nest()
                .key(function (d) {
                    return d["Leading Cancer Sites"];
                })
                .entries(data);


            // Compute the scales’ domains.
            x.domain([d3.min(data, function (d) {
                return d.year;
            }), d3.max(data, function (d) {
                return d.year;
            })]);

            y.domain([0, d3.max(data, function (d) {
                //console.log(d.inc_rate);
                return d.inc_rate;
            })]);

            legendSpace = width / cancers.length;
            var color = d3.scale.category10();

            // Select the section we want to apply our changes to
            var svg = d3.select("#graph").transition();

            // forEach loops through the cancers array, but it only updates the path to breast for some reason??
            cancers.forEach(function(d, i){
                console.log(d.values[i]);
                console.log(i);
                svg.select(".line")
                    .duration(750)
                    .style("stroke", function () {
                        return d.color = color(d.key);
                    })
                    .attr("d", incidenceLine(d.values));
            });
            // Updating the axes works!
            // Update the x-axis.
            svg.select(".x.axis")
                .duration(750)
                .call(d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.format("d")));

            // Update the y-axis.
            svg.select(".y.axis")
                .duration(750)
                .call(d3.svg.axis().scale(y).orient("left"));

            console.log("axes updated");

        });}
/*

        function revertData() {
            console.log("Update Data");
            // Get the data again
            d3.tsv("incidence_10.tsv", function (error, data) {
                if (error) throw error;
                // Coerce the data to numbers.
                data.forEach(function (d) {
                    d.inc_rate = +d["Age-Adjusted Rate"];
                    d.year = +d.Year;
                    d.count = +d.Count;
                });

                // Group data by cancer type
                var cancers = d3.nest()
                    .key(function (d) {
                        return d["Leading Cancer Sites"];
                    })
                    .entries(data);


                // Compute the scales’ domains.
                x.domain([d3.min(data, function (d) {
                    return d.year;
                }), d3.max(data, function (d) {
                    return d.year;
                })]);

                y.domain([0, d3.max(data, function (d) {
                    //console.log(d.inc_rate);
                    return d.inc_rate;
                })]);

                legendSpace = width / cancers.length;
                var color = d3.scale.category10();

                // Select the section we want to apply our changes to
                var svg = d3.select("#graph").transition();

                // forEach loops through the cancers array, but it only updates the path to breast for some reason??
                cancers.forEach(function(d, i){
                    console.log(d.values[i]);
                    console.log(i);
                    svg.select(".line")
                        .duration(750)
                        .style("stroke", function () {
                            return d.color = color(d.key);
                        })
                        .attr("d", incidenceLine(d.values));
                });
                // Updating the axes works!
                // Update the x-axis.
                svg.select(".x.axis")
                    .duration(750)
                    .call(d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.format("d")));

                // Update the y-axis.
                svg.select(".y.axis")
                    .duration(750)
                    .call(d3.svg.axis().scale(y).orient("left"));

                console.log("axes updated");

            });}*/
