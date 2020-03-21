d3.csv(
  "https://docs.google.com/spreadsheets/d/1dtEPDzs3qSEHoAMrhPkm_zQlKCYNuGf3YxY77uopGzU/export?format=csv&gid=167986238"
).then(function(data) {
  console.log(data);

  data.forEach(function(d) {
    d.age = +d.age;
    d.year = +d.year;
    d.pop = +d.pop;
  });

  var nest = d3
    .nest()
    .key(function(d) {
      return d.country;
    })
    .key(function(d) {
      return d.year;
    })
    .entries(data);

  var margin = { top: 10, right: 10, bottom: 10, left: 10 },
    width = 1260 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    gutter = 30,
    pyramid_h = height - 105,
    dom_age = d3.extent(data, d => d.age),
    dom_year = d3.extent(data, d => d.year),
    dom_value = d3.extent(data, d => d.pop),
    formatter = d3.format(",d"),
    barheight = pyramid_h / (dom_age[1] - dom_age[0]) + 10,
    cx = width / 2;
  var svg = d3
    .select("#pop_pyramid")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // .attr( 'transform', `translate(${margin.left},${margin.top})` )

  // year axis
  var s_year = d3
    .scaleLinear()
    .domain(dom_year)
    .range([0, 400])
    .clamp(true);

  var ax_year = d3
    .axisBottom()
    .scale(s_year)
    .ticks(8)
    .tickFormat(String);

  // age axis1
  var s_age = d3
    .scaleLinear()
    .domain(dom_age.concat().reverse())
    .range([0, pyramid_h]);

  var ax_age_l = d3
    .axisLeft()
    .scale(s_age)
    .tickFormat(d => (s_age(d) ? "" + d : ""));

  var ax_age_svg = svg
    .append("g")
    .attr("class", "axis age")
    .attr("transform", "translate(" + (cx + gutter / 2 - 300 + 10) + ",0)")
    .call(ax_age_l);

  ax_age_svg
    .append("text")
    .attr("dy", ".32em")
    .text("Age");

  ax_age_svg
    .selectAll("text")
    .attr("x", -gutter / 2 - 10)
    .style("text-anchor", "middle");

  var ax_age_r = d3
    .axisRight()
    .scale(s_age)
    .tickFormat(d => "");

  svg
    .append("g")
    .attr("class", "axis age")
    .attr("transform", "translate(" + (cx - gutter / 2 - 300 - 10) + ",0)")
    .call(ax_age_r);

  // age axis2
  var ax_age_svg2 = svg
    .append("g")
    .attr("class", "axis age")
    .attr("transform", "translate(" + (cx + gutter / 2 + 300 + 10) + ",0)")
    .call(ax_age_l);

  ax_age_svg2
    .append("text")
    .attr("dy", ".32em")
    .text("Age");

  ax_age_svg2
    .selectAll("text")
    .attr("x", -gutter / 2 - 10)
    .style("text-anchor", "middle");

  var ax_age_r2 = d3
    .axisRight()
    .scale(s_age)
    .tickFormat(d => "");

  svg
    .append("g")
    .attr("class", "axis age")
    .attr("transform", "translate(" + (cx - gutter / 2 + 300 - 10) + ",0)")
    .call(ax_age_r);

  // population axen1
  var s_value = d3
    .scaleLinear()
    .domain([0, 20])
    .range([0, 220]);

  // male population axis
  var s_male = d3
    .scaleLinear()
    .domain([0, 20].reverse())
    .range([0, 220]);

  var ax_male = d3
    .axisBottom()
    .scale(s_male)
    .ticks(5)
    .tickFormat(formatter);

  // ax male1
  svg
    .append("g")
    .attr("class", "axis population male")
    .attr(
      "transform",
      "translate(" + (cx - 300 - 220 - gutter) + "," + (pyramid_h + 5) + ")"
    )
    .call(ax_male);

  // ax male2
  svg
    .append("g")
    .attr("class", "axis population male")
    .attr(
      "transform",
      "translate(" + (cx + 300 - 220 - gutter) + "," + (pyramid_h + 5) + ")"
    )
    .call(ax_male);

  // female population axis
  var ax_female = d3
    .axisBottom()
    .scale(s_value)
    .ticks(5)
    .tickFormat(formatter);

  // ax female 1
  svg
    .append("g")
    .attr("class", "axis population female")
    .attr(
      "transform",
      "translate(" + (cx - 300 + gutter) + "," + (pyramid_h + 5) + ")"
    )
    .call(ax_female);

  // ax female 2
  svg
    .append("g")
    .attr("class", "axis population female")
    .attr(
      "transform",
      "translate(" + (cx + 300 + gutter) + "," + (pyramid_h + 5) + ")"
    )
    .call(ax_female);

  svg
    .append("text")
    .attr("x", cx + gutter / 2 + 270 + 5)
    .attr("y", 0)
    .attr("class", "axislabel")
    .text("Age");

  svg
    .append("text")
    .attr("x", cx + gutter / 2 - 330 + 5)
    .attr("y", 0)
    .attr("class", "axislabel")
    .text("Age");

  svg
    .append("text")
    .attr("x", cx - 200 + gutter)
    .attr("y", pyramid_h + 40)
    .attr("class", "axislabel")
    .text("Population rate(%)");

  svg
    .append("text")
    .attr("x", cx + 400 + gutter)
    .attr("y", pyramid_h + 40)
    .attr("class", "axislabel")
    .text("Population rate(%)");

  // Dropdown list
  var count_menu1 = d3.select("#selectButton1");
  count_menu1
    .selectAll("option")
    .data(nest)
    .enter()
    .append("option")
    .text(function(d) {
      return d.key;
    })
    .attr("value", function(d) {
      return d.key;
    });

  var count_menu2 = d3.select("#selectButton2");
  count_menu2
    .selectAll("option")
    .data(nest)
    .enter()
    .append("option")
    .text(function(d) {
      return d.key;
    })
    .attr("value", function(d) {
      return d.key;
    });

  // slider

  var moving = false;
  var currentValue = 0;
  var targetValue = width;

  var playButton = d3.select("#play-button");

  // var playButton = d3.select("#play-button")
  // .attr("transform", "translate(" +  (cx-440) +  "," + (pyramid_h+85) + ")");

  var x = d3
    .scaleLinear()
    .domain(dom_year)
    .range([0, targetValue - 400])
    .clamp(true);

  var slider = svg
    .append("g")
    .attr("class", "slider")
    .attr(
      "transform",
      "translate(" + (cx - 450) + "," + (pyramid_h + 85) + ")"
    );

  slider
    .append("line")
    .attr("class", "track")
    .attr("x1", x.range()[0])
    .attr("x2", x.range()[1])
    .select(function() {
      return this.parentNode.appendChild(this.cloneNode(true));
    })
    .attr("class", "track-inset")
    .select(function() {
      return this.parentNode.appendChild(this.cloneNode(true));
    })
    .attr("class", "track-overlay")
    .call(
      d3
        .drag()
        .on("start.interrupt", function() {
          slider.interrupt();
        })
        .on("start drag", function() {
          currentValue = d3.event.x;
          updateyear(x.invert(currentValue));
        })
    );

  slider
    .insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")")
    .selectAll("text")
    .data(x.ticks(8))
    .enter()
    .append("text")
    .attr("x", x)
    .attr("y", 10)
    .attr("text-anchor", "middle")
    .text(function(d) {
      return d;
    });

  var handle = slider
    .insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9);

  var label = slider
    .append("text")
    .attr("class", "label")
    .attr("text-anchor", "middle")
    .text(dom_year[0])
    .attr("transform", "translate(0," + -25 + ")");

  var initialGraph = function(country, year) {
    // Filter the data to include only fruit of interest
    var selectcountry = nest.filter(function(d) {
      return d.key == country;
    });

    var selectyear = selectcountry[0].values.filter(function(d) {
      return d.key == year;
    });

    _data = selectyear[0];

    var pyramid1 = svg
      .selectAll(".pyramid1")
      .data(selectyear, function(d) {
        return d ? d.key : this.key;
      })
      .enter()
      .append("g")
      .attr("class", "pyramid1");

    var pyramid2 = svg
      .selectAll(".pyramid2")
      .data(selectyear, function(d) {
        return d ? d.key : this.key;
      })
      .enter()
      .append("g")
      .attr("class", "pyramid2");

    var isMale = d => d.sex === "male";
    var total = d3.sum(_data.values, d => d.pop);
    var m_total = d3.sum(_data.values, d => (isMale(d) ? d.pop : 0));
    var f_total = total - m_total;
    var x_pos1 = d => {
      return isMale(d)
        ? cx - 300 - gutter - s_value((d.pop / m_total) * 100)
        : cx - 300 + gutter;
    };
    var x_pos2 = d => {
      return isMale(d)
        ? cx + 300 - gutter - s_value((d.pop / m_total) * 100)
        : cx + 300 + gutter;
    };

    // var bars = countyeargroups.append('g')
    //   .attr('class', 'pyramid');

    var bar1 = pyramid1.selectAll(".bar1").data(function(d) {
      return d.values;
    });
    var bar2 = pyramid2.selectAll(".bar2").data(function(d) {
      return d.values;
    });

    // _data.values

    bar1
      .enter()
      .append("rect")
      .attr("class", d => "bar1 " + d.sex)
      .attr("height", barheight)
      .attr("width", d =>
        isMale(d)
          ? s_value((d.pop / m_total) * 100)
          : s_value((d.pop / f_total) * 100)
      )
      // .attr( 'width', d => s_value( d.pop ) )
      .attr("x", x_pos1)
      .attr("y", d => s_age(d.age) - barheight / 2 - 10);

    bar2
      .enter()
      .append("rect")
      .attr("class", d => "bar2 " + d.sex)
      .attr("height", barheight)
      .attr("width", d =>
        isMale(d)
          ? s_value((d.pop / m_total) * 100)
          : s_value((d.pop / f_total) * 100)
      )
      // .attr( 'width', d => s_value( d.pop ) )
      .attr("x", x_pos2)
      .attr("y", d => s_age(d.age) - barheight / 2 - 10);

    svg
      .append("g")
      .attr("id", "current_country1")
      .attr("value", country);

    svg
      .append("g")
      .attr("id", "current_country2")
      .attr("value", country);
  };

  initialGraph("Argentina", 1950);

  // // population bars
  // var bars = svg.append('g')
  //     .attr('class', 'pyramid');

  count_menu1.on("change", function() {
    var selectedcountry = d3.select(this).property("value");

    var other_country = d3.select("#current_country2").attr("value");

    // Run update function with the selected fruit
    updatecountry(selectedcountry, other_country, 1950);
  });

  count_menu2.on("change", function() {
    var selectedcountry = d3.select(this).property("value");

    var other_country = d3.select("#current_country1").attr("value");

    // Run update function with the selected fruit
    updatecountry(other_country, selectedcountry, 1950);
  });

  var updatecountry = function(country1, country2, year) {
    // Filter the data to include only fruit of interest
    var selectcountry1 = nest.filter(function(d) {
      return d.key == country1;
    });

    var selectyear1 = selectcountry1[0].values.filter(function(d) {
      return d.key == year;
    });

    var selectcountry2 = nest.filter(function(d) {
      return d.key == country2;
    });

    var selectyear2 = selectcountry2[0].values.filter(function(d) {
      return d.key == year;
    });

    _data1 = selectyear1[0];
    _data2 = selectyear2[0];

    var isMale = d => d.sex === "male";
    var total1 = d3.sum(_data1.values, d => d.pop);
    var total2 = d3.sum(_data2.values, d => d.pop);
    var m_total1 = d3.sum(_data1.values, d => (isMale(d) ? d.pop : 0));
    var m_total2 = d3.sum(_data2.values, d => (isMale(d) ? d.pop : 0));
    var f_total1 = total1 - m_total1;
    var f_total2 = total2 - m_total2;
    var x_pos1 = d => {
      return isMale(d)
        ? cx - 300 - gutter - s_value((d.pop / m_total1) * 100)
        : cx - 300 + gutter;
    };
    var x_pos2 = d => {
      return isMale(d)
        ? cx + 300 - gutter - s_value((d.pop / m_total2) * 100)
        : cx + 300 + gutter;
    };

    // Select all of the grouped elements and update the data
    var pyramid1 = svg.selectAll(".pyramid1").data(selectyear1);

    pyramid1
      .selectAll(".bar1")
      .data(function(d) {
        return d.values;
      })
      .transition()
      .duration(100)
      // .attr( 'class', d => 'bar')
      .attr("height", barheight)
      .attr("width", d =>
        isMale(d)
          ? s_value((d.pop / m_total1) * 100)
          : s_value((d.pop / f_total1) * 100)
      )
      // .attr( 'width', d => s_value( d.pop ) )
      .attr("x", x_pos1)
      .attr("y", d => s_age(d.age) - barheight / 2 - 10);

    var pyramid2 = svg.selectAll(".pyramid2").data(selectyear2);

    pyramid2
      .selectAll(".bar2")
      .data(function(d) {
        return d.values;
      })
      .transition()
      .duration(100)
      // .attr( 'class', d => 'bar')
      .attr("height", barheight)
      .attr("width", d =>
        isMale(d)
          ? s_value((d.pop / m_total2) * 100)
          : s_value((d.pop / f_total2) * 100)
      )
      // .attr( 'width', d => s_value( d.pop ) )
      .attr("x", x_pos2)
      .attr("y", d => s_age(d.age) - barheight / 2 - 10);

    d3.select("#current_country1").attr("value", country1);

    d3.select("#current_country2").attr("value", country2);
  };

  playButton.on("click", function() {
    var button = d3.select(this);
    if (button.text() == "Pause") {
      moving = false;
      clearInterval(timer);
      // timer = 0;
      button.text("Play");
    } else {
      moving = true;
      timer = setInterval(step, 100);
      button.text("Pause");
    }
    console.log("Slider moving: " + moving);
  });

  function step() {
    updateyear(x.invert(currentValue));
    currentValue = currentValue + targetValue / 151;
    if (currentValue > targetValue) {
      moving = false;
      currentValue = 0;
      clearInterval(timer);
      // timer = 0;
      playButton.text("Play");
      console.log("Slider moving: " + moving);
    }
  }

  function updateyear(h) {
    // update position and text of label according to slider scale
    handle.attr("cx", x(h));
    label.attr("x", x(h)).text(Math.floor(h));

    var current_country1 = d3.select("#current_country1").attr("value");

    var current_country2 = d3.select("#current_country2").attr("value");

    console.log(current_country1);

    updatecountry(current_country1, current_country2, Math.floor(h));
  }

  d3.select("#reset-button").on("click", function() {

    var current_country1 = d3.select("#current_country1").attr("value");

    var current_country2 = d3.select("#current_country2").attr("value");

    updatecountry(current_country1, current_country2, 1950);
    currentValue=0;
    handle.attr("cx", x(x.invert(currentValue)));
    label.attr("x", x(x.invert(currentValue))).text(Math.floor(x.invert(currentValue)));
  });

});
