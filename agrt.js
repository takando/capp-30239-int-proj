  
  var width2 = 1000; // 
  var height2 = 500; //
  var margin2 = { "top": 30, "bottom": 60, "right": 150, "left": 60 };
 
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
  
  d3.select("#selectButton3")
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
  var axisy = d3.axisLeft(yScale).ticks(5)
                .tickSizeInner(-(width2-210));
 
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

  var lines = svg2
            .append('g')
            .attr("class", "lines");

  // var countries = d3.map(data, function(d){return(d.Country)}).keys()

  
  
  function drawChart(country, data) {

        var dataFilter = data.filter(function(d){return d.Country==country})

        // var dataFilter = countries.map(country => data.filter(function(d){return d.Country==country}))

        console.log(dataFilter[16])

        var t = d3.transition()
            .duration(2000)
            .ease(d3.easeLinear)
            .on("start", function(d){ console.log("transiton start") })
            .on("end", function(d){ console.log("transiton end") })

        lines.selectAll("."+country).data([dataFilter])
             .enter()
             .append("path")
             .attr("class", "line " + country)
             .attr("d", d3.line()
             .x(function(d) { return xScale(d.Year) })
             .y(function(d) { return yScale(+d.prop_ov65) })
            )
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-dasharray", function(d){ return this.getTotalLength() })
            .attr("stroke-dashoffset", function(d){ return this.getTotalLength() })
            .attr("stroke", function(d){ return myColor(country) })
            .style("stroke-width", 4)

        svg2.append("g").selectAll("text")
           .data([dataFilter[16]])
           .enter()
           .append("text")
           .attr("class", "countrylabel")
           .attr("x", function(d) { return xScale(d.Year) + 5 })
           .attr("y", function(d) { return yScale(d.prop_ov65) })
           .attr("fill", function(d){ return myColor(country) })
           .text(function(d) { return d.Country })
        
        lines.selectAll(".line").transition(t)
            .attr("stroke-dashoffset", 0)

    }

  // When the button is changed, run the drawChart function
    d3.select("#selectButton3").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        drawChart(selectedOption, data)

      });

    d3.select("#reset-button").on("click", function() {
        d3.selectAll(".line").remove() 
        d3.selectAll(".countrylabel").remove()


        // recover the option that has been chosen

      });
 

  });


//   .catch(function(error){
//   console.warn(error)
 
// });