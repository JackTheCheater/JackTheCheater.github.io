// set the dimensions and margins of the graph
var margin5 = {top: 10, right: 30, bottom: 10, left: 80},
	width5 = 1450 
    height5 = 850 

// append the svg object to the body of the page
var svg5 = d3.select("#choroplethMap2")
	.append("svg")
    .attr("width", width5 + margin5.left + margin5.right)
    .attr("height", height5 + margin5.top + margin5.bottom)
	.append("g")
    .attr("transform",
          "translate(" + margin5.left + "," + margin5.top + ")");

// Map and projection
var projection2 = d3.geoMercator()
	.center([16,54])
    .scale(600)
    .translate([width5 / 2, height5 / 2])

// Data and colors
var data2 = d3.map();
var colorScale2 = d3.scaleThreshold()
	.domain([10000000, 30000000, 50000000, 70000000, 90000000, 105000000])
	.range(["#D9E7FF", "#A7C7FF", "#76A8FF", "#4D8EFF", "#1B6EFF", "#003DA8", "#002360"])
			
var colorNaN2 = d3.scaleOrdinal().domain([0]).range(["darkslategrey"])

var intervals2 = ["10.000.000", "30.000.000", "50.000.000", "70.000.000", "90.000.000"
				, "105.000.000", ">= 105.000.000", "Unknown"]
				
var labels2 = ["0 - 9.999.999 t", "10.000.000 - 29.999.999 t"
			, "30.000.000 - 49.999.999 t", "50.000.000 - 69.999.999 t"
			, "70.000.000 - 89.999.999 t", "90.000.000 - 104.999.999 t"
			, ">= 105.000.000 t", "Unknown"]
			
var colorBar2 = d3.scaleOrdinal()
	.domain(intervals2)
	.range(["#D9E7FF", "#A7C7FF", "#76A8FF", "#4D8EFF", "#1B6EFF", "#003DA8", "#002360"
			, "darkslategrey"])
	
// Load external data and boot

function update5(year){
	d3.queue()
		.defer(d3.json,"Data/Pollution/Europe.json")
		.defer(d3.csv,"Data/Pollution/Data5.csv", function(d) {
		
		if(year==d.year){
			data2.set(d.country, +d.value);}	

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
	svg5.append("g")
		.selectAll("path")
		.data(topo.features)
		.enter()
		.append("path")
		// draw each country
		.attr("d", d3.geoPath()
			.projection(projection2)
		)
		// set the color of each country
		.attr("fill", function (d) {
			d.total = data2.get(d.properties.ID) || 0;
			if(d.total==0){ return colorNaN2(d.total); }
			else{ return colorScale2(d.total);}
		})
		.style("stroke", "black")
		.attr("class", function(d){ return "Country" } )
		.style("opacity", 1)
		.on("mouseover", mouseOver )
		.on("mouseleave", mouseLeave )
		.append("title")
		.text(function(d) {
			d.total = data2.get(d.properties.ID) || 0;
			if (d.total==0){
				return "Country: " + d.properties.NAME + "\n" 
				+ "Energy produced: unknown";}
			else{
				let str = d.total.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
				return "Country: " + d.properties.NAME + "\n" 
				+ "Tons of equivalent oil: " + str;}
			});
		
	// Colorbar
	var size = 20
	
	svg5.selectAll("myrects")
		.data(intervals2)
		.enter()
		.append("rect")
		.attr("x", 1220)
		.attr("y", function(d,i){ return 10 + i*(size+15)}) 
		.attr("width", size+5)
		.attr("height", size+15)
		.style("fill", function(d){ return colorBar2(d)})
		.style("stroke", "black" )

	svg5.selectAll("mylabels")
		.data(labels2)
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
update5(2009);

// When the button's content is changed, run the updateChart function
d3.select("#selectButton4").on("change", function(d) {
	// recover the option that has been chosen
	var selectedYear = d3.select(this).property("value")
	svg5.selectAll("path").remove();
	update5(selectedYear);
		})