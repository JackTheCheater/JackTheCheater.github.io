// set the dimensions and margins of the graph
var margin3 = {top: 50, right: 30, bottom: 70, left: 250},
    width3 = 1300
    height3 = 600 

// append the svg object to the body of the page
var svg3 = d3.select("#scatterplot2")
	.append("svg")
    .attr("width", width3 + margin3.left + margin3.right)
    .attr("height", height3 + margin3.top + margin3.bottom)
	.append("g")
    .attr("transform",
          "translate(" + margin3.left + "," + margin3.top + ")");

// Parse the Data
d3.csv("Data/GreenAreas/Data3.csv", function(data) {

	function update3(year) {
        dataFiltered = data.filter(function(d) {
        return d.year == year
			})

	// Add X axis
	var x = d3.scaleLinear()
		.domain([0, 28000000])
		.range([ 0, width3-200]);
		
	svg3.append("g")
		.attr("transform", "translate(0," + height3 + ")")
		.call(d3.axisBottom(x)
				.tickFormat(function(d){ return d.toString()
					.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + " " + "ha";}));

	// Add Y axis
	var y = d3.scaleLinear()
		.domain([0, 40000000])
		.range([ height3, 0]);
	
	svg3.append("g")
		.call(d3.axisLeft(y)
				.tickFormat(function(d){ return d.toString()
					.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + " " + "ha";}));

	var countries = d3.map(dataFiltered, function(d){return(d.country)}).keys()

	// Color scale: give me a specie name, I return a color
	var color3 = d3.scaleOrdinal()
		.domain(countries)
		.range(["plum", "brown", "blueviolet", "deepskyblue", "darkorange", "grey"
				, "royalblue", "goldenrod", "deeppink", "chocolate", "gold", "yellow"
				, "fuchsia", "darkkhaki", "lightgrey", "purple"])

	// Add dots
	svg3.append('g')
		.selectAll("dot")
		.data(dataFiltered)
		.enter()
		.append("circle")
		.attr("cx", function (d) { return x(d.agriculture); } )
		.attr("cy", function (d) { return y(d.wooded); } )
		.attr("r", 5)
		.style("fill", function (d) { return color3(d.country) } )
		.style("stroke", "black" )
		.append("title")
		.text(function(d) {
			let str = d.wooded.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
			let str1 = d.agriculture.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
			return "Country: " + d.country + "\n" + "Wooded hectares: " + str
					+ "\n" + "Agriculture hectares: " + str1;});
	
	// Add one dot in the legend for each name.
	svg3.selectAll("mydots")
		.data(countries)
		.enter()
		.append("circle")
		.attr("cx", 1180)
		.attr("cy", function(d,i){ return 20 + i*25}) 
		.attr("r", 7)
		.style("fill", function(d){ return color3(d)})
		.style("stroke", "black" )

	svg3.selectAll("mylabels")
		.data(countries)
		.enter()
		.append("text")
		.attr("x", 1200)
		.attr("y", function(d,i){ return 20 + i*25}) 
		.style("fill", "black")
		.text(function(d){ return d})
		.attr("text-anchor", "left")
		.style("alignment-baseline", "middle")
	
	}
	update3(2015);
	
	// When the button's content is changed, run the updateChart function
    d3.select("#selectButton4").on("change", function(d) {
        // recover the option that has been chosen
        var selectedYear = d3.select(this).property("value")
        // run the updateChart function with this selected option
        svg3.selectAll("circle").remove();
        update3(selectedYear);
    })
})