// set the dimensions and margins of the graph
var margin4 = {top: 50, right: 30, bottom: 70, left: 330},
    width4 = 1000
    height4 = 600 

// append the svg object to the body of the page
var svg4 = d3.select("#barChart2")
	.append("svg")
    .attr("width", width4 + margin4.left + margin4.right)
    .attr("height", height4 + margin4.top + margin4.bottom)
	.append("g")
    .attr("transform",
          "translate(" + margin4.left + "," + margin4.top + ")");

// Parse the Data
d3.csv("Data/Pollution/Data4.csv", function(data) {

	function update4(year) {
        var dataFiltered = data.filter(function(d) {
            return d.year == year
			})
	
	// sort data
	dataFiltered.sort(function(b, a) {
		return a.value - b.value;
	});
	
	var categories = d3.map(dataFiltered, function(d){return(d.category)}).keys()

	// Add X axis
	var x = d3.scaleBand()
		.domain(categories)
		.range([0, width4])
		.padding([0.2])

	svg4.append("g")
		.attr("transform", "translate(0," + height4 + ")")
		.call(d3.axisBottom(x).tickSizeOuter(0))


	// Add Y axis
	var y = d3.scaleLinear()
		.domain([0, 1200000000])
		.range([ height4, 0 ]);
	
	svg4.append("g")
		.call(d3.axisLeft(y)
			.tickFormat(function(d){return d.toString()
								.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")+ " " + "t";}));
	
	// Show the bars
	svg4.append('g')
		.selectAll("myRects")
		.data(dataFiltered)
		.enter()
		.append("rect")
		.attr("x", function(d) { return x(d.category); })
		.attr("y", function(d) { return y(d.value); })
		.attr("width", x.bandwidth())
		.attr("height", function(d) { return height4 - y(d.value); })
		.attr("fill", "steelblue")
		.append("title")
        .text(function(d) {
			let str = d.value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.").slice(0,-2);
			return "Tons of CO2: " + str;});
	}	
	update4(2010);
	
	// When the button's content is changed, run the updateChart function
    d3.select("#selectButton3").on("change", function(d) {
        // recover the option that has been chosen
        var selectedYear = d3.select(this).property("value")
        // run the updateChart function with this selected option
        svg4.selectAll("g").remove();
        update4(selectedYear);
    })
})