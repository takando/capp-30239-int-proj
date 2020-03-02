// var margin = {top: 30, right: 180, bottom: 40, left:40};
// var width = 900 - margin.left - margin.right;
// var height = 500 - margin.top - margin.bottom;

// var svg = d3.select('body')
// 	.append('svg')
// 	.attr('width', width + margin.left + margin.right)
// 	.attr('height', height + margin.top + margin.bottom)
// 	.append('g')
// 	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// svg.append('text')
// 	.attr('x', width -20)
// 	.attr('y', height )
// 	.attr('text-anchor', 'end')
// 	.attr('class', 'label')
// 	.text('Hello world');

// var dim_handlers = {
//   'Ár': {
//     'parser': d => +d
//   , 'label': 'year'
//   , 'select': d => true
//   }
// , 'Aldur': {
//     'parser': d => /^\d+/.test( d ) ? parseInt( d, 10 ) : 0
//   , 'label': 'age'
//   , 'select': d => !/^\s*Alls\s*$/i.test( d )
//   }
// , 'Kyn': {
//     'parser': d => d === 'Karlar' ? 'male' : 'female'
//   , 'label': 'sex'
//   , 'select': d => !/^\s*Alls\s*$/i.test( d )
//   }
// };

d3.csv("population.csv").then( function(data){

	data.forEach(function(d) {
    d.age = +d.age;
    d.year = +d.year;
    d.people = +d.people;
    });

	console.log(data)

    var margin = { top: 10, right: 10, bottom: 10, left: 10 }
      , width = 960 - margin.left - margin.right
      , height = 500 - margin.top - margin.bottom
      , gutter = 30
      , pyramid_h = height - 105
      , dom_age = d3.extent( data, d => d.age )
      , dom_year = d3.extent( data, d => d.year )
      , dom_value = d3.extent( data, d => d.people )
      , formatter = d3.format( ',d' )
      , barheight = ( pyramid_h / ( dom_age[1] - dom_age[0] ) ) - 0.5
      , cx = width / 2
      ;


    var svg = d3.select('#pop_pyramid').append('svg')
        .attr('width', width + margin.left + margin.right )
        .attr( 'height', height + margin.top + margin.bottom )
      .append( 'g' )
        .attr( 'transform', 'translate('+ margin.left + ',' + margin.top + ')' );

        // .attr( 'transform', `translate(${margin.left},${margin.top})` )

    var svg_text_m = svg.append( 'text' )
      .attr( 'transform', 'translate(' + (cx-250) + ', 10)' )
      .style( 'font', '15px sans-serif' )
      .attr( 'text-anchor', 'start' );

    var svg_text_f = svg.append( 'text' )
      .attr( 'transform', 'translate('  + (cx+250) + ',10)' )
      .style( 'font', '15px sans-serif' )
      .attr( 'text-anchor', 'end' );

    var svg_text_t = svg.append( 'text' )
      .attr( 'transform', 'translate(' + cx + ',' + (pyramid_h+55) + ')' )
      .style( 'font', '15px sans-serif' )
      .attr( 'text-anchor', 'middle' );

    // function uptext ( root, lines ) {
    //   var lines = this.selectAll( 'tspan' ).data( this.datum() );
    //   lines.text( d => d );
    //   lines.exit().remove();
    //   lines.enter().append( 'tspan' )
    //     .attr( 'x', 0 )
    //     .attr( 'dy', (d,i) => ( i * 1.2 ) + 'em' )
    //     .text( d => d );
    //   return this;
    // };

    // year axis
    var s_year = d3.scaleLinear()
        .domain(dom_year)
        .range([ 0, 400 ])
        .clamp( true );

    var ax_year = d3.axisBottom()
        .scale( s_year )
        .ticks( 8 )
        .tickFormat( String );

    var svg_axis_year = svg.append( 'g' )
        .attr( 'class', 'axis year' )
        .attr( 'transform', 'translate(' + (cx-200) + ','  + (pyramid_h+85) + ')' )
        .call( ax_year );

    // age axis
    var s_age = d3.scaleLinear()
        .domain( dom_age.concat().reverse() )
        .range([0, pyramid_h]);

    var ax_age_l = d3.axisLeft()
        .scale( s_age )
        .tickFormat( d => s_age( d ) ? '' + d : '' );

    var ax_age_svg = svg.append( 'g' )
        .attr('class', 'axis age')
        .attr('transform', 'translate(' + (cx+gutter/2+10) + ',0)')
        .call( ax_age_l );

    ax_age_svg.append( 'text' )
        .attr( 'dy', '.32em' )
        .text('Age');

    ax_age_svg.selectAll( 'text' )
        .attr('x', -gutter/2-10)
        .style('text-anchor', 'middle');

    var ax_age_r = d3.axisRight()
        .scale(s_age)
        .tickFormat( d => '' );

    svg.append( 'g' )
        .attr( 'class', 'axis age' )
        .attr( 'transform', 'translate(' + (cx-gutter/2-10) + ',0)')
        .call( ax_age_r );

    // population axen
    var s_value = d3.scaleLinear()
        .domain( dom_value )
        .range([ 0, 250 ]);

    // male population axis
    var s_male = d3.scaleLinear()
        .domain( dom_value.reverse() )
        .range([ 0, 250 ]);

    var ax_male = d3.axisBottom()
        .scale(s_male)
        .ticks(5)
        .tickFormat(formatter);

    svg.append('g')
        .attr('class', 'axis population male')
        .attr('transform',
              'translate(' + (cx-250-gutter) + ',' + (pyramid_h+5) + ')')
        .call(ax_male);

    // female population axis
    var ax_female = d3.axisBottom()
        .scale( s_value )
        .ticks( 5 )
        .tickFormat( formatter );

    svg.append( 'g' )
        .attr( 'class', 'axis population female' )
        .attr( 'transform', 'translate(' + (cx+gutter) + ',' + (pyramid_h+5) + ')')
        .call( ax_female );

    // population bars
    var bars = svg.append('g')
        .attr('class', 'pyramid');

    function update (current_year, animate) {

      var _data = data.filter( d => d.year === current_year )
        , isMale = d => d.sex ==="M"
        , x_pos = d => {
            return isMale( d )
              ? cx - gutter - s_value( d.people )
              : cx + gutter;
          }
        , total = d3.sum(_data, d => d.people)
        , m_total = d3.sum(_data, d => isMale( d ) ? d.people : 0)
        ;
        console.log(total);
        console.log(m_total);


      // svg_text_m.datum(['Males', formatter( m_total )])
      //       .call(uptext);

      // svg_text_f.datum([ 'Females', formatter( total - m_total ) ])
      //       .call( uptext );

      // svg_text_t.datum([ `Total population of Iceland in
      //       ${current_year} was ${formatter(total)}` ])
      //       .call( uptext );

      var bar = bars.selectAll( '.bar' ).data( _data );

      // bar.transition().duration( animate ? 450 : 0 )
      //     .attr( 'width', d => s_value( d.value ) )
      //     .attr( 'x', x_pos );

      // bar.exit().remove();

      bar.enter().append( 'rect' )
          .attr( 'class', d => 'bar' + d.sex )
          .attr( 'height', barheight )
          .attr( 'width', d => s_value( d.people ) )
          .attr( 'x', x_pos )
          .attr( 'y', d => s_age( d.age ) - barheight/2 );
    }

    // current year
    var curr_point = d3.symbol()
        .type(d3.symbolTriangle)
        .size( 100 );

    var brush = d3.brushX()
        // .x( s_year )
        .extent([[0, 0],[ dom_year[ 1 ], dom_year[ 0 ] ]]);
        // .on( 'brush', onbrush );

    var slider = svg_axis_year.append( 'g' )
        .attr( 'class', 'slider' )
        .call( brush );

    slider.selectAll( '.extent,.resize' ).remove();

    slider.select( '.background' )
        .attr( 'y', -20 )
        .attr( 'height', 40 );

    var handle = slider.append( 'path' )
        .attr( 'class', 'handle' )
        .attr( 'd', curr_point );
    
    // var round = d3.format(".1");

    // function onbrush () {
    //   var value = brush.extent()[ 0 ]
    //     , animate = true;
    //   if ( d3.event && d3.event.sourceEvent ) {
    //     if ( d3.event.sourceEvent.type === 'mousemove' ) {
    //       animate = false;
    //     }
    //     value = parseInt(d3.format("d")(s_year.invert( d3.mouse( this )[ 0 ] ) ), 10);
    //     brush.extent([ value, value ]);
    //   }
    //   handle.attr( 'transform', `translate(${s_year(value)},-10)` );
    //   update( value, animate );
    // };

    // onbrush();

    update(2000, true);

  });

 
