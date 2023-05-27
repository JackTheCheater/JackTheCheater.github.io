// set the dimensions and margins of the graph
var margin2 = {top: 10, right: 30, bottom: 10, left: 80},
	width2 = 1400 
    height2 = 850 

// append the svg object to the body of the page
var svg2 = d3.select("#choroplethMap2")
	.append("svg")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom)
	.append("g")
    .attr("transform",
          "translate(" + margin2.left + "," + margin2.top + ")");

// Map and projection
var projection2 = d3.geoMercator()
	.center([16,54])
    .scale(600)
    .translate([width2 / 2, height2 / 2])

// Data and colors
var data2 = d3.map();
var colorScale2 = d3.scaleThreshold()
	.domain([100000, 500000, 1000000, 2500000, 5000000, 8000000])
	.range(["#D9E7FF", "#A7C7FF", "#76A8FF", "#4D8EFF", "#1B6EFF", "#003DA8", "#002360"])
			
var colorNaN2 = d3.scaleOrdinal().domain([0]).range(["darkslategrey"])

var intervals2 = ["100.000", "500.000", "1.000.000", "2.500.000", "5.000.000", "8.000.000"
				, ">= 8.000.000", "Unknown"]
var labels2 = ["0 - 99.999 ha", "100.000 - 499.999 ha", "500.000 - 999.999 ha"
				, "1.000.000 - 2.499.999 ha", "2.500.000 - 4.999.999 ha"
				, "5.000.000 - 7.999.999 ha", ">= 8.000.000 ha", "Unknown"]
var colorBar2 = d3.scaleOrdinal()
	.domain(intervals2)
	.range(["#D9E7FF", "#A7C7FF", "#76A8FF", "#4D8EFF", "#1B6EFF", "#003DA8", "#002360"
			, "darkslategrey"])
	
// Load external data and boot

function update2(year, intensity){
	d3.queue()
		.defer(d3.json,"Data/GreenAreas/Europe.json")
		.defer(d3.csv,"Data/GreenAreas/Data2.csv", function(d) {
		if(d.year==year && d.input==intensity){
			data2.set(d.country, +d.value);}	

	})
	.await(ready);

function ready(error, topo) {

	let mouseOver2 = function(d) {
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

	let mouseLeave2 = function(d) {
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
	svg2.append("g")
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
		.on("mouseover", mouseOver2 )
		.on("mouseleave", mouseLeave2 )
		.append("title")
		.text(function(d) {
			d.total = data2.get(d.properties.ID) || 0;
			if (d.total==0){
				return "Country: " + d.properties.NAME + "\n" 
				+ "Hectares: unknown";}
			else{
				let str = d.total.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
				return "Country: " + d.properties.NAME + "\n" 
				+ "Hectares: " + str;}
			});
		
	// Colorbar
	var size2 = 20
	
	svg2.selectAll("myrects")
		.data(intervals2)
		.enter()
		.append("rect")
		.attr("x", 1220)
		.attr("y", function(d,i){ return 10 + i*(size2+15)}) 
		.attr("width", size2+5)
		.attr("height", size2+15)
		.style("fill", function(d){ return colorBar2(d)})
		.style("stroke", "black" )

	svg2.selectAll("mylabels")
		.data(labels2)
		.enter()
		.append("text")
		.attr("x", 1250)
		.attr("y", function(d,i){ return 25 + i*(size2+15)}) 
		.style("fill", "black")
		.text(function(d){ return d;})
		.attr("text-anchor", "left")
		.style("alignment-baseline", "middle")
	
    }
}

update2(2010, "low");
var selectedYear=2010;
var selectedIntensity="low";

// When the button's content is changed, run the updateChart function
d3.select("#selectButton2").on("change", function(d) {
	// recover the option that has been chosen
	selectedYear = d3.select(this).property("value")
	svg2.selectAll("path").remove();
	update2(selectedYear, selectedIntensity)
	})
	
// When the button's content is changed, run the updateChart function
d3.select("#selectButton3").on("change", function(d) {
	// recover the option that has been chosen
	selectedIntensity = d3.select(this).property("value")
	svg2.selectAll("path").remove();
	update2(selectedYear, selectedIntensity)
	})
