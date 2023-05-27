// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 10, left: 80},
	width = 1400 
    height = 850 

// append the svg object to the body of the page
var svg = d3.select("#choroplethMap")
	.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
	.append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Map and projection
var projection = d3.geoMercator()
	.center([16,54])
    .scale(600)
    .translate([width / 2, height / 2])

// Data and colors
var data = d3.map();
var colorScale = d3.scaleThreshold()
	.domain([4000000, 8000000, 12000000, 18000000, 24000000, 30000000])
	.range(["#D9E7FF", "#A7C7FF", "#76A8FF", "#4D8EFF", "#1B6EFF", "#003DA8", "#002360"])
			
var colorNaN = d3.scaleOrdinal().domain([0]).range(["darkslategrey"])

var intervals = ["4.000.000", "8.000.000", "12.000.000", "18.000.000", "24.000.000", "30.000.000"
				, ">= 30.000.000", "Unknown"]
var labels = ["0 - 3.999.999 ha", "4.000.000 - 7.999.999 ha", "8.000.000 - 11.999.999 ha"
			, "12.000.000 - 17.999.999 ha", "18.000.000 - 23.999.999 ha"
			, "24.000.000 - 29.999.999 ha", ">= 30.000.000 ha", "Unknown"]
			
var colorBar = d3.scaleOrdinal()
	.domain(intervals)
	.range(["#D9E7FF", "#A7C7FF", "#76A8FF", "#4D8EFF", "#1B6EFF", "#003DA8", "#002360"
			, "darkslategrey"])
	
// Load external data and boot

function update(year){
	d3.queue()
		.defer(d3.json,"Data/GreenAreas/Europe.json")
		.defer(d3.csv,"Data/GreenAreas/Data.csv", function(d) {
		
		if(year==d.year){
			data.set(d.country, +d.value);}	

	})
	.await(ready);

function ready(error, topo) {

	let mouseOver = function(d) {
		d3.selectAll(".Country")
		.transition()
		.duration(200)
		.style("opacity", .5)
		d3.select(this)
		.transition()
		.duration(200)
		.style("opacity", 1)
		.style("stroke", "black")
	}

	let mouseLeave = function(d) {
		d3.selectAll(".Country")
		.transition()
		.duration(200)
		.style("opacity", 1)
		d3.select(this)
		.transition()
		.duration(200)
		.style("opacity", 1)
		.style("stroke", "black")
	}

	// Draw the map
	svg.append("g")
		.selectAll("path")
		.data(topo.features)
		.enter()
		.append("path")
		// draw each country
		.attr("d", d3.geoPath()
			.projection(projection)
		)
		// set the color of each country
		.attr("fill", function (d) {
			d.total = data.get(d.properties.ID) || 0;
			if(d.total==0){ return colorNaN(d.total); }
			else{ return colorScale(d.total);}
		})
		.style("stroke", "black")
		.attr("class", function(d){ return "Country" } )
		.style("opacity", 1)
		.on("mouseover", mouseOver )
		.on("mouseleave", mouseLeave )
		.append("title")
		.text(function(d) {
			d.total = data.get(d.properties.ID) || 0;
			if (d.total==0){
				return "Country: " + d.properties.NAME + "\n" 
				+ "Hectares: unknown";}
			else{
				let str = d.total.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
				return "Country: " + d.properties.NAME + "\n" 
				+ "Hectares: " + str;}
			});
		
	// Colorbar
	var size = 20
	
	svg.selectAll("myrects")
		.data(intervals)
		.enter()
		.append("rect")
		.attr("x", 1220)
		.attr("y", function(d,i){ return 10 + i*(size+15)}) 
		.attr("width", size+5)
		.attr("height", size+15)
		.style("fill", function(d){ return colorBar(d)})
		.style("stroke", "black" )

	svg.selectAll("mylabels")
		.data(labels)
		.enter()
		.append("text")
		.attr("x", 1250)
		.attr("y", function(d,i){ return 25 + i*(size+15)}) 
		.style("fill", "black")
		.text(function(d){ return d;})
		.attr("text-anchor", "left")
		.style("alignment-baseline", "middle")
	
    }
}
update(1990);

// When the button's content is changed, run the updateChart function
d3.select("#selectButton").on("change", function(d) {
	// recover the option that has been chosen
	var selectedYear = d3.select(this).property("value")
	svg.selectAll("path").remove();
	update(selectedYear);
		})