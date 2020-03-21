var width2 = 1000; //
var height2 = 500; //
var margin2 = { top: 30, bottom: 60, right: 150, left: 60 };

var colorRange = ['red', 'gray', 'steelblue'];

var color = d3.scaleLinear().range(colorRange).domain([0.0, 0.50]);

const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    // .style("opacity", 0)
    // .style("position", "absolute");

//
var svg2 = d3
  .select("#age_rate")
  .append("svg")
  .attr("class", "svg2")
  .attr("width", width2)
  .attr("height", height2);

d3.csv("https://docs.google.com/spreadsheets/d/1ZUJCIIiZddKse91mnCAtbs1umJ7f3Zmllwt-QEdXpDc/export?format=csv&id=1835585753").then(function(data) {
  data.forEach(function(d) {
    d.country = d.country
    d.year = +d.year;
    d.rate_ov65 = +d.rate_ov65;
  });

  var allGroup = d3
    .map(data, function(d) {
      return d.country;
    })
    .keys();

  // console.log(allGroup);

  // console.log(data);
  var dom_year = d3.extent(data, d => d.year),
    dom_rate_ov65 = d3.extent(data, d => d.rate_ov65);

  //
  var xScale = d3
    .scaleLinear()
    .domain(dom_year)
    .range([margin2.left, width2 - margin2.right]);

  var yScale = d3
    .scaleLinear()
    .domain(dom_rate_ov65)
    .range([height2 - margin2.bottom, margin2.top]);

  //
  var axisx = d3.axisBottom(xScale)
    .ticks(10)
    .tickFormat(d3.format("d"));
  var axisy = d3
    .axisLeft(yScale)
    .ticks(5)
    .tickSizeInner(-(width2 - 210));

  var defs = svg2.append("defs");

  var gradient = defs.append("linearGradient")
   .attr("id", "svgGradient")
   .attr("x1", "0%")
   .attr("x2", "0%")
   .attr("y1", "0%")
   .attr("y2", "100%")
   .attr("gradientUnits", "userSpaceOnUse")
   // .attr("gradientTransform", "rotate(90)");

  gradient.append("stop")
   .attr('class', 'start')
   .attr("offset", "0%")
   .attr("stop-color", "red")
   .attr("stop-opacity", 1);

  gradient.append("stop")
   .attr('class', 'end')
   .attr("offset", "100%")
   .attr("stop-color", "steelblue")
   .attr("stop-opacity", 1);


  svg2
    .append("g")
    .attr(
      "transform",
      "translate(" + 0 + "," + (height2 - margin2.bottom) + ")"
    )
    .call(axisx)
    .append("text")
    .attr("fill", "black")
    .attr("x", (width2 - margin2.left - margin2.right) / 2 + margin2.left)
    .attr("y", 35)
    .attr("text-anchor", "middle")
    .attr("font-size", "10pt")
    .attr("font-weight", "bold")
    .text("Year");

  svg2
    .append("g")
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

  var colorScale = d3.scaleLinear()
    .domain(dom_rate_ov65.reverse())
    .range(["red","steelblue"]);

  var legend = d3.legendColor()
    .scale(colorScale)
    .title("Over65 rate");

  svg2.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(900,10)")
    .call(legend);

  var lines = svg2.append("g").attr("class", "lines");

  var countries = d3.map(data, function(d){return(d.country)}).keys()
  // let year = 1950
  var duration = 10000

  const local = d3.local();


  function drawChart(data) {

    var dataFilter = countries.map(country => data.filter(function(d){return d.country==country}))

    console.log(dataFilter);

    lines
      // .selectAll("." + country)
      .selectAll(".line")
      .data(dataFilter)
      .enter()
      .append("path")
      // .attr("class", "line " + country)
      .attr("class", "line")
      .attr("id", function(d){
        return d[0].country
      })

      .attr(
        "d",
        d3
          .line()
          .x(function(d) {
            return xScale(d.year);
          })
          .y(function(d) {
            return yScale(+d.rate_ov65);
          })
      )
      .attr("fill", "none")
      // .attr("stroke", "black")
      .attr("stroke-dasharray", function(d) {
        return this.getTotalLength();
      })
      .attr("stroke-dashoffset", function(d) {
        return this.getTotalLength();
      })
      // .attr("stroke", function(d) {
      //   return myColor(d.country);
      // })
      .attr("stroke", "url(#svgGradient)")
      .style("stroke-width", 1.5)
      .on("mouseover", function(d) {
　　　　　var element = document.getElementsByClassName("lines")[0];
        var coordinates = d3.mouse(element) ;
        mouse_x=coordinates[0]
        mouse_y=coordinates[1]

        d3.select(this)
        .raise()
        .style("stroke-width", 4.0)
        // .style("stroke", "gold")

        tooltip
        .style("visibility", "visible")
        .html("Country : " + d[0].country +
         "<br>Year : " + Math.floor(xScale.invert(mouse_x)) +
         "<br>Ageing rate : " + Number(Math.round(yScale.invert(mouse_y)+ 'e3') +'e-3'));
         
       })
      .on("mousemove", function(d) {
        d3.select(this)
        .raise()
        .style("stroke-width", 4.0)
        // .style("stroke", "gold")

        tooltip
        .style("top", (d3.event.pageY - 20) + "px")
        .style("left", (d3.event.pageX + 10) + "px");
      })
      .on("mouseout", function(d) {
        d3.select(this)
        .style("stroke-width", 1.5)
        // .attr("stroke", "url(#svgGradient)")

        tooltip.style("visibility", "hidden");
      });

  }

  drawChart(data);
  var moving = false
  var line = lines.selectAll(".line") 

  var playButton = d3.select("#play-button2");

  playButton.on("click", function() {
    var line = lines.selectAll(".line")

    if (moving==true) {
    line.interrupt();
    this.textContent = "Play";
    moving = false;
    console.log(moving)
  } else {
    line
      // .selectAll(".line")
      .transition()
      .ease(d3.easeLinear)
      .duration(duration)
      .attr("stroke-dashoffset", 0)
      .on("interrupt", function() {
        local.set(this, +d3.select(this).attr("stroke-dashoffset"))
       })
    this.textContent = "Stop";
    moving = true;
    console.log(moving)
  }

  });

  d3.select("#reset-button2").on("click", function() {
    d3.selectAll(".line").remove();
    // d3.selectAll(".countrylabel").remove();
    drawChart(data);
    // var line = lines.selectAll(".line")

    // recover the option that has been chosen
  });


});

