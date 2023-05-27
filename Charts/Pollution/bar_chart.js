// set the dimensions and margins of the graph
var margin2 = {top: 50, right: 30, bottom: 70, left: 200},
    width2 = 1350
    height2 = 600 

// append the svg object to the body of the page
var svg2 = d3.select("#barChart")
	.append("svg")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom)
	.append("g")
    .attr("transform",
          "translate(" + margin2.left + "," + margin2.top + ")");

// Parse the Data
d3.csv("Data/Pollution/Data2.csv", function(data) {

	function update(year) {
        var dataFiltered = data.filter(function(d) {
            return d.year == year
			})
	
	// sort data
	dataFiltered.sort(function(b, a) {
		return a.value - b.value;
	});
	
	var countries = d3.map(dataFiltered, function(d){return(d.country)}).keys()

	// Add X axis
	var x = d3.scaleBand()
		.domain(countries)
		.range([0, width2])
		.padding([0.2])
		
	svg2.append("g")
		.attr("transform", "translate(0," + height2 + ")")
		.call(d3.axisBottom(x).tickSizeOuter(0))


	// Add Y axis
	var y = d3.scaleLinear()
		.domain([0, 5000000000])
		.range([ height2, 0 ]);
	
	svg2.append("g")
		.call(d3.axisLeft(y)
			.tickFormat(function(d){return d.toString()
								.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")+ " " + "\u20AC";}));
	
	// Show the bars
	svg2.append('g')
		.selectAll("myRects")
		.data(dataFiltered)
		.enter()
		.append("rect")
		.attr("x", function(d) { return x(d.country); })
		.attr("y", function(d) { return y(d.value); })
		.attr("width", x.bandwidth())
		.attr("height", function(d) { return height2 - y(d.value); })
		.attr("fill", "steelblue")
		.append("title")
        .text(function(d) {
			let str = d.value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
			return "Economic loss: " + str + "\u20AC";});
	}	
	update(2004);
	
	// When the button's content is changed, run the updateChart function
    d3.select("#selectButton").on("change", function(d) {
        // recover the option that has been chosen
        var selectedYear = d3.select(this).property("value")
        // run the updateChart function with this selected option
        svg2.selectAll("g").remove();
        update(selectedYear);
    })
})