// set the dimensions and margins of the graph
var margin = {top: 50, right: 30, bottom: 70, left: 300},
    width = 1300
    height = 600 

// append the svg object to the body of the page
var svg = d3.select("#percentageStackedBarChart")
	.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
	.append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("Data/Waste/Data.csv", function(data) {

	function update(year) {
        var dataFiltered = data.filter(function(d) {
            return d.year == year
			})

	// List of subgroups = header of the csv files = soil condition here
	var subgroups = Object.keys(dataFiltered[0]).slice(2)
	// List of groups = species here = value of the first column called group -> I show them on the X axis
	var groups = d3.map(dataFiltered, function(d){return(d.country)}).keys()

	// Add X axis
	var x = d3.scaleBand()
		.domain(groups)
		.range([0, width-300])
		.padding([0.2])
		
	svg.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x).tickSizeOuter(0));

	// Add Y axis
	var y = d3.scaleLinear()
		.domain([0, 100])
		.range([ height, 0 ]);
	
	svg.append("g")
		.call(d3.axisLeft(y).tickFormat(function(d){ return d.toString()+ " " + "%"}));

	// color palette = one color per subgroup
	var color = d3.scaleOrdinal()
		.domain(subgroups)
		.range(["steelblue", "violet", "gold", "darkorange", "rosybrown", "maroon"])

	dataFiltered.forEach(function(d){
		// Compute the total
		tot = 0
		for (i in subgroups){ name=subgroups[i] ; tot += +d[name] }
		// Now normalize
		for (i in subgroups){ name=subgroups[i] ; d[name] = d[name] / tot * 100}
	})

  //stack the data? --> stack per subgroup
	var stackedData = d3.stack()
		.keys(subgroups)
		(dataFiltered)
		
	var tooltip = d3.select("#percentageStackedBarChart")
		.append("div")
		.style("opacity", 0)
		.style("background-color", "white")
		.style("border", "solid")
		.style("border-width", "1px")
		.style("border-radius", "5px")
		.style("padding", "10px")
		.style("width", "300px")
		.style("position", "absolute")

	// Three function that change the tooltip when user hover / move / leave a cell
	var mouseover = function(d) {
		var subgroupName = d3.select(this.parentNode).datum().key;
		var subgroupValue = d.data[subgroupName];
		// Reduce opacity of all rect to 0.2
		d3.selectAll(".myRect").style("opacity", 0.2)
		// Highlight all rects of this subgroup with opacity 0.8. It is possible to select them since they have a specific class = their name.
		d3.selectAll("."+subgroupName).style("opacity", 1)
		tooltip
		.html("Operation: " + subgroupName.replace(/_/g, " ") + "<br>" + "Value: " + subgroupValue.toFixed(2) + "%")
		.style("opacity", 1)
		.style("left", 900 + "px") 
		.style("top", 2000 + "px")
	}
  	
	var mouseleave = function(d) {
		d3.selectAll(".myRect").style("opacity",1)
		tooltip.style("opacity", 1)
	}

	// Show the bars
	svg.append("g")
		.selectAll("g")
		// Enter in the stack data = loop key per key = group per group
		.data(stackedData)
		.enter().append("g")
		.attr("fill", function(d) { return color(d.key); })
		.attr("class", function(d){ return "myRect " + d.key }) // Add a class to each subgroup: their name
		.selectAll("rect")
		// enter a second time = loop subgroup per subgroup to add all rectangles
		.data(function(d) { return d; })
		.enter().append("rect")
        .attr("x", function(d) { return x(d.data.country); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width",x.bandwidth())
		.on("mouseover", mouseover)
		.on("mouseleave", mouseleave)
	
	// Add one rect in the legend for each name.
	var size = 20
	svg.selectAll("myrects")
		.data(subgroups)
		.enter()
		.append("rect")
		.attr("x", 1050)
		.attr("y", function(d,i){ return 10 + i*(size+5)}) // 100 is where the first rect appears. 25 is the distance between dots
		.attr("width", size)
		.attr("height", size)
		.style("fill", function(d){ return color(d)})
		.style("stroke", "black" )

	svg.selectAll("mylabels")
		.data(subgroups)
		.enter()
		.append("text")
		.attr("x", 1085)
		.attr("y", function(d,i){ return 10 + i*(size+5) + (size/2)}) // 100 is where the first label appears. 25 is the distance between dots
		.style("fill", "black")
		.text(function(d){ return d.replace(/_/g, ' ')})
		.attr("text-anchor", "left")
		.style("alignment-baseline", "middle")
	}	
	update(2010);
	
	// When the button's content is changed, run the updateChart function
    d3.select("#selectButton").on("change", function(d) {
        // recover the option that has been chosen
        var selectedYear = d3.select(this).property("value")
        // run the updateChart function with this selected option
        svg.selectAll("rect").remove();
        update(selectedYear);
    })
})