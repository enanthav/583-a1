var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Set ranges
var x = d3.scale.linear()
    .range([0, width]);
var y = d3.scale.linear()
    .range([height, 0]);

// Define the line
var incidenceLine = d3.svg.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.inc_rate); });

// Create SVG canvas
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("incidence.tsv", function(error, data) {
    if (error) throw error;
    // Coerce the data to numbers.
    data.forEach(function(d) {
        d.inc_rate = +d["Age-Adjusted Rate"];
        d.year = +d.Year;
        d.count = +d.Count;
    });
    // Group data by cancer
    var dataGroup = d3.nest()
        .key(function(d) {
            return d["Leading Cancer Sites"];
        })
        .entries(data);

    dataGroup.forEach(function(d, i) {
        console.log(dataGroup[i]);
    });


    // Compute the scales’ domains.
    x.domain([d3.min(data, function(d){ return d.year; }), d3.max(data, function(d){ return d.year; })]);
    y.domain([0, d3.max(data, function(d){
        //console.log(d.inc_rate);
        return d.inc_rate; })]);

    legendSpace = width/dataGroup.length;
    var color = d3.scale.category20();

    dataGroup.forEach(function(d, i) {
        console.log(d.values[i]);
        svg.append("path")
            .attr("class", "line")
            .style("stroke", function() {
                return d.color = color(d.key); })
            .attr("id", 'tag'+d.key.replace(/\s+/g, '')) // assign ID **
            .attr("d", incidenceLine(d.values));


        // Add the Legend
        svg.append("text")                                    // *******
            .attr("x", (legendSpace/2)+i*legendSpace) // spacing // ****
            .attr("y", height + (margin.bottom/2)+ 5)         // *******
            .attr("class", "legend")    // style the legend   // *******
            .style("fill", function() { // dynamic colours    // *******
                return d.color = color(d.key); })             // *******
            .on("click", function(){                     // ************
                // Determine if current line is visible
                var active   = d.active ? false : true,  // ************
                    newOpacity = active ? 0 : 1;             // ************
                // Hide or show the elements based on the ID
                d3.select("#tag"+d.key.replace(/\s+/g, '')) // *********
                    .transition().duration(100)          // ************
                    .style("opacity", newOpacity);       // ************
                // Update whether or not the elements are active
                d.active = active;                       // ************
            })                                       // ************
            .text(d.key);
    });

/*    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);*/
    // Add the x-axis.
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.format("d")));

    // Add the y-axis.
    svg.append("g")
        .attr("class", "y axis")
        .call(d3.svg.axis().scale(y).orient("left"));

/*    // Add the points!
    svg.selectAll(".point")
        .data(data)
        .enter().append("circle")
        .attr("class", "point")
        .attr("r", 4.5)
        .attr("cx", function(d) { return x(d.year); })
        .attr("cy", function(d) { return y(d.inc_rate); });*/
});