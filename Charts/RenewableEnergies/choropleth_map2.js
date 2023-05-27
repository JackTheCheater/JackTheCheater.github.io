// set the dimensions and margins of the graph
var margin6 = {top: 10, right: 30, bottom: 10, left: 80},
	width6 = 1450 
    height6 = 850 

// append the svg object to the body of the page
var svg6 = d3.select("#choroplethMap2")
	.append("svg")
    .attr("width", width6 + margin6.left + margin6.right)
    .attr("height", height6 + margin6.top + margin6.bottom)
	.append("g")
    .attr("transform",
          "translate(" + margin6.left + "," + margin6.top + ")");

// Map and projection
var projection2 = d3.geoMercator()
	.center([16,54])
    .scale(600)
    .translate([width6 / 2, height6 / 2])

// Data and colors
var data2 = d3.map();
var colorScale2 = d3.scaleThreshold()
	.domain([500000000, 2000000000, 4000000000, 6000000000, 8000000000])
	.range(["#E6EAFE", "#ACB9FE", "#5F7AFE", "#3557FE", "#010DBA", "#030A60"])
			
var colorNaN2 = d3.scaleOrdinal().domain([0]).range(["darkslategrey"])

var intervals2 = ["500000000", "2000000000", "4000000000", "6000000000", "8000000000"
				, ">= 8000000000", "Unknown"]
var labels2 = ["0 - 499.999.999 \u20AC", "500.000.000 - 1.999.999.999 \u20AC"
			, "2.000.000.000 - 3.999.999.999 \u20AC", "4.000.000.000 - 5.999.999.999 \u20AC"
			, "6.000.000.000 - 7.999.999.999 \u20AC", ">= 8.000.000.000 \u20AC", "Unknown"]
			
var colorBar2 = d3.scaleOrdinal()
	.domain(intervals2)
	.range(["#E6EAFE", "#ACB9FE", "#5F7AFE", "#3557FE", "#010DBA", "#030A60", "darkslategrey"])
	
// Load external data and boot

function update4(year){
	d3.queue()
		.defer(d3.json,"Data/RenewableEnergies/Europe.json")
		.defer(d3.csv,"Data/RenewableEnergies/Data6.csv", function(d) {
		
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
	svg6.append("g")
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
				+ "Hectares: unknown";}
			else{
				let str = d.total.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
				return "Country: " + d.properties.NAME + "\n" 
				+ "Euros invested: " + str +"\u20AC";}
			});
		
	// Colorbar
	var size = 20
	
	svg6.selectAll("myrects")
		.data(intervals2)
		.enter()
		.append("rect")
		.attr("x", 1220)
		.attr("y", function(d,i){ return 10 + i*(size+15)}) 
		.attr("width", size+5)
		.attr("height", size+15)
		.style("fill", function(d){ return colorBar2(d)})
		.style("stroke", "black" )

	svg6.selectAll("mylabels")
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
update4(2014);

// When the button's content is changed, run the updateChart function
d3.select("#selectButton4").on("change", function(d) {
	// recover the option that has been chosen
	var selectedYear = d3.select(this).property("value")
	svg6.selectAll("path").remove();
	update4(selectedYear);
		})