// set the dimensions and margins of the graph
var margin3 = {top: 50, right: 30, bottom: 70, left: 200},
    width3 = 1350
    height3 = 600 

// append the svg object to the body of the page
var svg3 = d3.select("#barChart")
	.append("svg")
    .attr("width", width3 + margin3.left + margin3.right)
    .attr("height", height3 + margin3.top + margin3.bottom)
	.append("g")
    .attr("transform",
          "translate(" + margin3.left + "," + margin3.top + ")");

// Parse the Data
d3.csv("Data/RenewableEnergies/Data3.csv", function(data) {

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
		.range([0, width3])
		.padding([0.2])
		
	svg3.append("g")
		.attr("transform", "translate(0," + height3 + ")")
		.call(d3.axisBottom(x).tickSizeOuter(0))


	// Add Y axis
	var y = d3.scaleLinear()
		.domain([0, 100])
		.range([ height3, 0 ]);
	
	svg3.append("g")
		.call(d3.axisLeft(y)
			.tickFormat(function(d){return d.toString()+ " " + "%"}));
	
	// Show the bars
	svg3.append('g')
		.selectAll("myRects")
		.data(dataFiltered)
		.enter()
		.append("rect")
		.attr("x", function(d) { return x(d.country); })
		.attr("y", function(d) { return y(d.value); })
		.attr("width", x.bandwidth())
		.attr("height", function(d) { return height3 - y(d.value); })
		.attr("fill", "steelblue")
		.append("title")
        .text(function(d) {
			return "Share of renewable energies: " + d.value + "%";});
	}	
	update(2004);
	
	// When the button's content is changed, run the updateChart function
    d3.select("#selectButton").on("change", function(d) {
        // recover the option that has been chosen
        var selectedYear = d3.select(this).property("value")
        // run the updateChart function with this selected option
        svg3.selectAll("g").remove();
        update(selectedYear);
    })
})