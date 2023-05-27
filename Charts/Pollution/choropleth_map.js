// set the dimensions and margins of the graph
var margin3 = {top: 10, right: 30, bottom: 10, left: 80},
	width3 = 1450 
    height3 = 850 

// append the svg object to the body of the page
var svg3 = d3.select("#choroplethMap")
	.append("svg")
    .attr("width", width3 + margin3.left + margin3.right)
    .attr("height", height3 + margin3.top + margin3.bottom)
	.append("g")
    .attr("transform",
          "translate(" + margin3.left + "," + margin3.top + ")");

// Map and projection
var projection = d3.geoMercator()
	.center([16,54])
    .scale(600)
    .translate([width3 / 2, height3 / 2])

// Data and colors
var data = d3.map();
var colorScale = d3.scaleThreshold()
	.domain([100000000, 500000000, 1000000000, 2000000000, 3000000000, 4000000000])
	.range(["#D9E7FF", "#A7C7FF", "#76A8FF", "#4D8EFF", "#1B6EFF", "#003DA8", "#002360"])
			
var colorNaN = d3.scaleOrdinal().domain([0]).range(["darkslategrey"])

var intervals = ["100.000.000", "500.000.000", "1.000.000.000", "2.000.000.000", "3.000.000.000"
				, "4.000.000.000", ">= 4.000.000.000", "Unknown"]
				
var labels = ["0 - 99.999.999 \u20AC", "100.000.000 - 499.999.999 \u20AC"
			, "500.000.000 - 999.999.999 \u20AC", "1.000.000.000 - 1.999.999.999 \u20AC"
			, "2.000.000.000 - 2.999.999.999 \u20AC", "3.000.000.000 - 3.999.999.999 \u20AC"
			, ">= 4.000.000.000 \u20AC", "Unknown"]
			
var colorBar = d3.scaleOrdinal()
	.domain(intervals)
	.range(["#D9E7FF", "#A7C7FF", "#76A8FF", "#4D8EFF", "#1B6EFF", "#003DA8", "#002360"
			, "darkslategrey"])
	
// Load external data and boot

function update2(year){
	d3.queue()
		.defer(d3.json,"Data/Pollution/Europe.json")
		.defer(d3.csv,"Data/Pollution/Data3.csv", function(d) {
		
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
	svg3.append("g")
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
				+ "Economic loss: unknown";}
			else{
				let str = d.total.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
				return "Country: " + d.properties.NAME + "\n" 
				+ "Economic loss: " + str + "\u20AC";}
			});
		
	// Colorbar
	var size = 20
	
	svg3.selectAll("myrects")
		.data(intervals)
		.enter()
		.append("rect")
		.attr("x", 1220)
		.attr("y", function(d,i){ return 10 + i*(size+15)}) 
		.attr("width", size+5)
		.attr("height", size+15)
		.style("fill", function(d){ return colorBar(d)})
		.style("stroke", "black" )

	svg3.selectAll("mylabels")
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
update2(2004);

// When the button's content is changed, run the updateChart function
d3.select("#selectButton2").on("change", function(d) {
	// recover the option that has been chosen
	var selectedYear = d3.select(this).property("value")
	svg3.selectAll("path").remove();
	update2(selectedYear);
		})