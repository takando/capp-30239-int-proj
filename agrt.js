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

  // d3.select("#selectButton3")
  //   .selectAll("myOptions")
  //   .data(allGroup)
  //   .enter()
  //   .append("option")
  //   .text(function(d) {
  //     return d;
  //   }) // text showed in the menu
  //   .attr("value", function(d) {
  //     return d;
  //   }); // corresponding value returned by the button

  // var myColor = d3
  //   .scaleOrdinal()
  //   .domain(allGroup)
  //   .range(d3.schemeSet2);

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
  var axisx = d3.axisBottom(xScale).ticks(10);
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

  // const gradient = DOM.uid();

  // var linearGradient = svg2.append("defs")
  //                         .append("linearGradient")
  //                         .attr("id", "linear-gradient")
  //                         // .attr("gradientTransform", "rotate(90)");

  //     linearGradient.append("stop")
  //       .attr("offset", "0%")
  //       .attr("stop-color", "rgb(255, 0, 0)");

  //     linearGradient.append("stop")
  //       .attr("offset", "50%")
  //       .attr("stop-color", "rgb(128, 128, 128)");

  //     linearGradient.append("stop")
  //       .attr("offset", "100%")
  //       .attr("stop-color", "rgb(70, 130, 180)");

  var lines = svg2.append("g").attr("class", "lines");

  var countries = d3.map(data, function(d){return(d.country)}).keys()
  // let year = 1950
  var duration = 10000

  const local = d3.local();

  // var t = d3
  //     .transition()
  //     .duration(duration)
  //     .ease(d3.easeLinear)
  //     .on("start", function(d) {
  //       console.log("transiton start");
  //     })
  //     .on("end", function(d) {
  //       console.log("transiton end");
  //     });

  function drawChart(data) {
    // var dataFilter = data.filter(function(d) {
    //   return d.country == country;
    // });

    var dataFilter = countries.map(country => data.filter(function(d){return d.country==country}))

    console.log(dataFilter);

    // var t = d3
    //   .transition()
    //   .duration(30000)
    //   .ease(d3.easeLinear)
    //   .on("start", function(d) {
    //     console.log("transiton start");
    //   })
    //   .on("end", function(d) {
    //     console.log("transiton end");
    //   });

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
      .style("stroke-width", 1.4)
      .on("mouseover", function(d) {
        d3.select(this)
        .raise()
        .style("stroke-width", 4.0)
        // .style("stroke", "gold")

        tooltip
        .style("visibility", "visible")
        .html("Country : " + d[0].country +
         "<br>Year : " + xScale.invert(d3.event.pageX -120) +
         "<br>Ageing rate : " + yScale.invert(d3.event.pageY - 900));
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
        .style("stroke-width", 1.4)
        // .attr("stroke", "url(#svgGradient)")

        tooltip.style("visibility", "hidden");
      });

    //   lines.selectAll("points")
    //    .data(data)
    //    .enter()
    //    .append("circle")
    //    .attr("cx", function(d) { return xScale(d.year); })      
    //    .attr("cy", function(d) { return yScale(+d.rate_ov65); })    
    //    .attr("r", 1)
    //    .attr("class","point")
    //    .style("opacity", 1)

    //   lines.selectAll("circles")
    //    .data(data)
    //    .enter()
    //    .append("circle")
    //    .attr("cx", function(d) { return xScale(d.year); })      
    //    .attr("cy", function(d) { return yScale(+d.rate_ov65); })    
    //    .attr("r", 1)
    //    .attr("class","point")
    //    .style("opacity", 1)

    //    .on('mouseover', function(d) {
    //     tooltip.transition()
    // .duration(200)
    // .delay(30)
    // .style("opacity", 1);
    // })

    //    tooltip.html(d.country)
    // .style("left", (d3.event.pageX + 25) + "px")
    // .style("top", (d3.event.pageY) + "px")
    // .on("mouseout", function(d) {      
    // tooltip.transition()        
    // .duration(200)      
    // .style("opacity", 0);  });


    // svg2
    //   .append("g")
    //   .selectAll("text")
    //   .data(dataFilter)
    //   .enter()
    //   .append("text")
    //   .attr("class", "countrylabel")
    //   .attr("x", function(d) {
    //     return xScale(d.year) + 5;
    //   })
    //   .attr("y", function(d) {
    //     return yScale(d.rate_ov65);
    //   })
    //   // .attr("fill", function(d) {
    //   //   return myColor(d.country);
    //   // })
    //   .text(function(d) {
    //     return d.country;
    //   });

    // lines
    //   .selectAll(".line")
    //   .transition(t)
    //   .attr("stroke-dashoffset", 0);
  }

  // When the button is changed, run the drawChart function
  // d3.select("#selectButt3").on("change", function(d) {
  //   // recover the option that has been chosen
  //   // var selectedOption = d3.select(this).property("value");
  //   // run the updateChart function with this selected option
  //   drawChart(data);
  // });
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
      // .duration(function() {
      //   return duration * (local.get(this) / function(d) {
      //   return this.getTotalLength();
      // })
      // })
      .attr("stroke-dashoffset", 0)
      .on("interrupt", function() {
        local.set(this, +d3.select(this).attr("stroke-dashoffset"))
       })
    this.textContent = "Stop";
    moving = true;
    console.log(moving)
  }



    // lines
    //   .selectAll(".line")
    //   .transition(t)
    //   .attr("stroke-dashoffset", 0);
      
    // var button = d3.select(this);
    // var t2 = d3.timer(function(elapsed) {
    //   console.log(elapsed);
    //   // if (elapsed > 200) t2.stop();
    //   year = year + 0.05
    //   console.log(Math.floor(year))
    //    }, 500);

    // if (button.text() == "Pause") {
    //   moving = false;
    //   // clearInterval(timer);
    //   // timer = 0;
    //   button.text("Play");
    //   t2.stop()


    // } else {
    //   moving = true;
    //   // timer = setInterval(step, 100);
    //   button.text("Pause");
    //   // t2.restart()
      

    // }


    // drawChart(data);

    // recover the option that has been chosen
  });

  d3.select("#reset-button").on("click", function() {
    d3.selectAll(".line").remove();
    // d3.selectAll(".countrylabel").remove();
    drawChart(data);
    // var line = lines.selectAll(".line")

    // recover the option that has been chosen
  });


});

//   .catch(function(error){
//   console.warn(error)

// });
