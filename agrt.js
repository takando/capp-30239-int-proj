  

  var width2 = 900; // 
  var height2 = 500; //
  var margin2 = { "top": 30, "bottom": 60, "right": 30, "left": 60 };
 
  // 
  var svg2 = d3.select("#age_rate")
               .append("svg")
               .attr("class", "svg2")
               .attr("width", width2)
               .attr("height", height2);
 
  d3.csv("ages_min.csv").then( function(data){

    data.forEach(function(d) {
    d.Year = +d.Year;
    d.prop_ov65 = +d.prop_ov65;
    });

  var allGroup = d3.map(data, function(d){return(d.Country)}).keys()
  
  console.log(allGroup)

  console.log(data);
  var dom_Year = d3.extent( data, d => d.Year ),
      dom_prop_ov65 = d3.extent( data, d => d.prop_ov65 );
  
  d3.select("#selectButton")
      .selectAll('myOptions')
      .data(allGroup)
      .enter()
      .append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button
  
  var myColor = d3.scaleOrdinal()
      .domain(allGroup)
      .range(d3.schemeSet2);

  // 
  var xScale = d3.scaleLinear()
    .domain(dom_Year)
    .range([margin2.left, width2 - margin2.right]);
 
  var yScale = d3.scaleLinear()
    .domain(dom_prop_ov65)
    .range([height2 - margin2.bottom, margin2.top]);
 
  // 
  var axisx = d3.axisBottom(xScale).ticks(10);
  var axisy = d3.axisLeft(yScale).ticks(5);
 
  svg2.append("g")
    .attr("transform", "translate(" + 0 + "," + (height2 - margin2.bottom) + ")")
    .call(axisx)
    .append("text")
    .attr("fill", "black")
    .attr("x", (width2 - margin2.left - margin2.right) / 2 + margin2.left)
    .attr("y", 35)
    .attr("text-anchor", "middle")
    .attr("font-size", "10pt")
    .attr("font-weight", "bold")
    .text("Year");
 
  svg2.append("g")
    .attr("transform", "translate(" + margin2.left + "," + 0 + ")")
    .call(axisy)
    .append("text")
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .attr("x", -(height2 - margin2.top - margin2.bottom) / 2 - margin2.top)
    .attr("y", -35)
    .attr("transform", "rotate(-90)")
    .attr("font-weight", "bold")
    .attr("font-size", "10pt")
    .text("Population proportion over age 65");
  
  var line = svg2
      .append('g')
      .append("path")
        .datum(data.filter(function(d){return d.Country==allGroup[0]}))
        .attr("d", d3.line()
          .x(function(d) { return xScale(d.Year) })
          .y(function(d) { return yScale(+d.prop_ov65) })
        )
        .attr("stroke", function(d){ return myColor("valueA") })
        .style("stroke-width", 4)
        .style("fill", "none")

  function update(selectedGroup) {

      // Create new data with the selection
      var dataFilter = data.filter(function(d){return d.Country==selectedGroup})

      // Give these new data to update line
      line
          .datum(dataFilter)
          .transition()
          .duration(1000)
          .attr("d", d3.line()
            .x(function(d) { return xScale(d.Year) })
            .y(function(d) { return yScale(+d.prop_ov65) })
          )
          .attr("stroke", function(d){ return myColor(selectedGroup) })
        }

  // When the button is changed, run the updateChart function
    d3.select("#selectButton").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update(selectedOption)

      });




  // svg2.append("path")
  //   .datum(data)
  //   .attr("fill", "none")
  //   .attr("stroke", "red")
  //   .attr("stroke-width", 1.5)
  //   .attr("d", d3.line()
  //     .x(function(d) { return xScale(d.Year); })
  //     .y(function(d) { return yScale(d.prop_ov65); }));
 

  });


//   .catch(function(error){
//   console.warn(error)
 
// });