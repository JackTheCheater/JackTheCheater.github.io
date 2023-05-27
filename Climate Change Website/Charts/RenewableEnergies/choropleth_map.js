// set the dimensions and margins of the graph
var margin5 = {top: 10, right: 30, bottom: 10, left: 80},
	width5 = 1400 
    height5 = 850 

// append the svg object to the body of the page
var svg5 = d3.select("#choroplethMap")
	.append("svg")
    .attr("width", width5 + margin5.left + margin5.right)
    .attr("height", height5 + margin5.top + margin5.bottom)
	.append("g")
    .attr("transform",
          "translate(" + margin5.left + "," + margin5.top + ")");

// Map and projection
var projection = d3.geoMercator()
	.center([16,54])
    .scale(600)
    .translate([width5 / 2, height5 / 2])

// Data and colors
var data = d3.map();
var colorScale = d3.scaleThreshold()
	.domain([20, 40, 55, 70, 85])
	.range(["#E6EAFE", "#ACB9FE", "#5F7AFE", "#3557FE", "#010DBA", "#030A60"])
			
var colorNaN = d3.scaleOrdinal().domain([0]).range(["darkslategrey"])

var intervals = ["20", "40", "55", "70", "85", ">= 85", "Unknown"]
var labels = ["0 - 19 %", "20 - 39 %", "40 - 54 %", "55 - 69 %", "70 - 84 %", ">= 85 %"
			, "Unknown"]
			
var colorBar = d3.scaleOrdinal()
	.domain(intervals)
	.range(["#E6EAFE", "#ACB9FE", "#5F7AFE", "#3557FE", "#010DBA", "#030A60", "darkslategrey"])
	
// Load external data and boot

function update3(year){
	d3.queue()
		.defer(d3.json,"Data/RenewableEnergies/Europe.json")
		.defer(d3.csv,"Data/RenewableEnergies/Data5.csv", function(d) {
		
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
	svg5.append("g")
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
				+ "Share of renewable energies: " + str + "%";}
			});
		
	// Colorbar
	var size = 20
	
	svg5.selectAll("myrects")
		.data(intervals)
		.enter()
		.append("rect")
		.attr("x", 1220)
		.attr("y", function(d,i){ return 10 + i*(size+15)}) 
		.attr("width", size+5)
		.attr("height", size+15)
		.style("fill", function(d){ return colorBar(d)})
		.style("stroke", "black" )

	svg5.selectAll("mylabels")
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
update3(2004);

// When the button's content is changed, run the updateChart function
d3.select("#selectButton3").on("change", function(d) {
	// recover the option that has been chosen
	var selectedYear = d3.select(this).property("value")
	svg5.selectAll("path").remove();
	update3(selectedYear);
		})