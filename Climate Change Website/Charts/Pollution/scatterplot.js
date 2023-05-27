// set the dimensions and margins of the graph
var margin6 = {top: 50, right: 30, bottom: 70, left: 300},
    width6 = 1200
    height6 = 600 

// append the svg object to the body of the page
var svg6 = d3.select("#scatterplot")
	.append("svg")
    .attr("width", width6 + margin6.left + margin6.right)
    .attr("height", height6 + margin6.top + margin6.bottom)
	.append("g")
    .attr("transform",
          "translate(" + margin6.left + "," + margin6.top + ")");

// Parse the Data
d3.csv("Data/Pollution/Data6.csv", function(data) {

	function update3(year) {
        var dataFiltered = data.filter(function(d) {
        return d.year == year
			})

	// Add X axis
	var x = d3.scaleLinear()
		.domain([0, 120000000])
		.range([ 0, width6-200]);
		
	svg6.append("g")
		.attr("transform", "translate(0," + height6 + ")")
		.call(d3.axisBottom(x)
				.tickFormat(function(d){ return d.toString()
				.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + " " + "t";}));

	// Add Y axis
	var y = d3.scaleLinear()
		.domain([0, 5000000000])
		.range([ height6, 0]);
	
	svg6.append("g")
		.call(d3.axisLeft(y)
				.tickFormat(function(d){ return d.toString()
					.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + " " + "\u20AC";}));

	var countries = d3.map(dataFiltered, function(d){return(d.country)}).keys()

	// Color scale: give me a specie name, I return a color
	var color = d3.scaleOrdinal()
		.domain(countries)
		.range(["thistle", "brown", "blueviolet", "deepskyblue", "darkorange", "grey"
				, "royalblue", "goldenrod", "deeppink", "chocolate", "gold", "cyan", "silver"])
	
	var tooltip = d3.select("#choroplethMap2")
		.append("div")
		.style("opacity", 0)
		.style("background-color", "white")
		.style("border", "solid")
		.style("border-width", "1px")
		.style("border-radius", "5px")
		.style("padding", "10px")
		.style("width", "300px")
		.style("position", "absolute")
	
	var mouseOver = function(d){
		svg6.selectAll("circle").style("opacity", function(e){return e.country===d.country ? 1 : 0.1 })
	}
	
	var mouseLeave = function(d){ 
		svg6.selectAll("circle").style("opacity", 1)
		}

	// Add dots
	svg6.append('g')
		.selectAll("dot")
		.data(dataFiltered)
		.enter()
		.append("circle")
		.attr("cx", function (d) { return x(d.nuclear); } )
		.attr("cy", function (d) { return y(d.loss); } )
		.attr("r", 5)
		.style("fill", function (d) { return color(d.country) } )
		.style("stroke", "black" )
		.style("opacity", 1)

	// Add one dot in the legend for each name.
	svg6.selectAll("dot")
		.data(dataFiltered)
		.enter()
		.append("circle")
		.attr("cx", 1080)
		.attr("cy", function(d,i){ return 20 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
		.attr("r", 7)
		.style("fill", function(d){ return color(d.country)})
		.style("stroke", "black" )
		.on("mouseover", mouseOver)
		.on("mouseleave", mouseLeave)
		.append("title")
		.text(function(d){
			let loss = d.loss.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + " " + "\u20AC";
			let nuclear = d.nuclear.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.").slice(0, -2);
			return "Economic loss: " + loss + "\n" + "Tons of equivalent oil: " + nuclear;})

	svg6.selectAll("mylabels")
		.data(countries)
		.enter()
		.append("text")
		.attr("x", 1100)
		.attr("y", function(d,i){ return 20 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
		.style("fill", "black")
		.text(function(d){ return d})
		.attr("text-anchor", "left")
		.style("alignment-baseline", "middle")

	}
	update3(2010);
	
	// When the button's content is changed, run the updateChart function
    d3.select("#selectButton5").on("change", function(d) {
        // recover the option that has been chosen
        var selectedYear = d3.select(this).property("value")
        // run the updateChart function with this selected option
        svg6.selectAll("circle").remove();
        update3(selectedYear);
    })
})