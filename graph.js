var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("incidence_2000-2013.tsv", function(error, data) {
    if (error) throw error;

    // Coerce the data to numbers.
    data.forEach(function(d) {
        d.inc_rate = +d.inc_rate;
        d.year = +d.year;
        d.count = +d.count;
    });

    // Compute the scales’ domains.
    x.domain([d3.min(data, function(d){ return d.year; }), d3.max(data, function(d){ return d.year; })]);
    y.domain([0, d3.max(data, function(d){
        console.log(d.inc_rate);
        return d.inc_rate; })]);

    // Add the x-axis.
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.format("d")));

    // Add the y-axis.
    svg.append("g")
        .attr("class", "y axis")
        .call(d3.svg.axis().scale(y).orient("left"));

    // Add the points!
    svg.selectAll(".point")
        .data(data)
        .enter().append("circle")
        .attr("class", "point")
        .attr("r", 4.5)
        .attr("cx", function(d) { return x(d.year); })
        .attr("cy", function(d) { return y(d.inc_rate); });
});