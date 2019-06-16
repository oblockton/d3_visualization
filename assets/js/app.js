// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Set the inital axis data to display
var displayedYaxis = "poverty";
var displayedXaxis = "age"; //******************

// functions used for updating x & y scale var upon click on axis label
function yScale(data, displayedYaxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[displayedYaxis]) * .95, d3.max(data, d => d[displayedYaxis]) * 1.05 ])
    .range([height,0 ]);
  return yLinearScale;
};

function xScale(data, displayedXaxis) {              ///*******************
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d[displayedXaxis]))
    .range([0,width]);
  return xLinearScale;
};

// function used for updating yAxis var upon click on axis label
function renderYaxis(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
};

// function used for updating xAxis var upon click on axis label.
// Must render axis seperately to avoid unneccesary transitions of axis,
// Since both axis cant change simultaneously.
function renderXaxis(newXScale, xAxis) {            //******************
  var bttmAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bttmAxis);

  return xAxis;
};

// Render the circle in their new x or y location. Changing y or x value is determined by centerplane value.
// In the event handling for y-label clicks the centerplane is set to 'cy'
function renderCircles(circlesGroup,centerplane, newYScale, displayedYaxis) {
  console.log('circle center plane: ' + centerplane);
  circlesGroup.transition()
    .duration(1000)
    .attr(centerplane, d => newYScale(d[displayedYaxis]));
  // console.log(circlesGroup.data());
  return circlesGroup;
};

// Render the statelabels in their new x or y location. Changing y or x value is determined by plane value.
// In the event handling for y-label clicks the plane is set to 'y'.
function renderStatelabels(stateLabels, plane, newYScale, displayedYaxis) {
  console.log('state label point plane: ' + plane);
  stateLabels.transition()
    .duration(1000)
    .attr(plane, d => newYScale(d[displayedYaxis]));
  return stateLabels;
}

// function used for updating circles group with new tooltip
function updateToolTip(displayedYaxis, displayedXaxis, circlesGroup) {

  if (displayedYaxis === "poverty") {
    var ylabel = "Percent in Poverty: ";
  }
  else {
    var ylabel = "Income in Dollars: ";
  }

  if (displayedXaxis === "age") {                  // ***************************
    var xlabel = "Median Age: ";
  }
  else {
    var xlabel = "Smokers %: ";
  }

  // var toolTip = d3.tip()
  //   .attr("class", "d3-tip")
  //   .offset([80, -60])
  //   .html(function(d) {
  //     return (`${d.state}<br>${ylabel} ${d[displayedYaxis]}`);
  //   });

  var toolTip = d3.tip()                                           //**********************
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${ylabel} ${d[displayedYaxis]}<br>${xlabel} ${d[displayedXaxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}


d3.csv("assets/data/data.csv")
  .then((data) => {
    // if (error) throw error;    // Parse Data
    // console.log(data);
    data.forEach((entry) => {
      entry.abbr = entry.abbr,
      entry.state = entry.state,
      entry.poverty = +entry.poverty,
      entry.age = +entry.age,
      entry.income = +entry.income,
      entry.healthcare = +entry.healthcare,
      entry.obesity = +entry.obesity,
      entry.smokes = +entry.smokes
      // console.log(entry);
    });// End data.foreach(entry){}

    // Step 2: Create scale functions
    // ==============================

    // var xScale_age = d3.scaleLinear()
    // .domain(d3.extent(data, d => d.age))
    // .range([0,width]);

    var xLinearScale= xScale(data, displayedXaxis)   //*********

    var yLinearScale = yScale(data, displayedYaxis);



    // Step 6: Create Axes
    // =============================================
    // var bttmAxis_age = d3.axisBottom(xScale_age);
    var bttmAxis = d3.axisBottom(xLinearScale);   //***********
    var leftAxis = d3.axisLeft(yLinearScale);


    // Step 4: Append Axes to the chart
    // ==============================

    // var xAxis = chartGroup.append('g')
    // .attr('transform', `translate(0,${height})`)
    // .call(bttmAxis_age);
    var xAxis = chartGroup.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(bttmAxis);                               //****************


    var yAxis = chartGroup.append('g')
    .call(leftAxis);

      //add state labels to nodes


    // Step 5: Create Circles
    // ==============================
     // var circlesGroup = chartGroup.selectAll('circle')
     // .data(data)
     // .enter()
     // .append('circle')
     // .attr('cx', d => xScale_age(d.age))
     // .attr('cy', d => yLinearScale(d[displayedYaxis]))
     // .attr('r',10)
     // .attr('fill','red')
     // .attr('stroke-width', '1')
     // .attr('stroke','black')
     // .attr('opacity', '.5');
     var circlesGroup = chartGroup.selectAll('circle')
     .data(data)
     .enter()
     .append('circle')
     .attr('cx', d => xLinearScale(d[displayedXaxis]))
     .attr('cy', d => yLinearScale(d[displayedYaxis]))
     .attr('r',10)
     .attr('fill','red')
     .attr('stroke-width', '1')
     .attr('stroke','black')
     .attr('opacity', '.5');                           //*****************

     var circleText = chartGroup.selectAll(null)
       .data(data)
       .enter()
       .append('text');

     // var stateLabels = circleText
     //   .attr('x', d => xScale_age(d.age))
     //   .attr('y', d => (yLinearScale(d[displayedYaxis])))
     //   .style('text-anchor', 'middle')
     //   .style('font-size', '9px')
     //   .style('font-weight', 'bold')
     //   .text(d => d.abbr);

     var stateLabels = circleText
       .attr('x', d => xLinearScale(d[displayedXaxis]))
       .attr('y', d => yLinearScale(d[displayedYaxis]))
       .style('text-anchor', 'middle')
       .style('font-size', '9px')
       .style('font-weight', 'bold')
       .text(d => d.abbr);                             //*******************


     // Create group for  multiple y- axis labels
     var labelsGroup = chartGroup.append("g");


     var yPovlabel = labelsGroup.append('text')
     .attr("transform", "rotate(-90)")
     .attr("y", -60)
     .attr("x", 0 - (height/2))
     .attr("dy", "1em")
     .attr("value", "poverty") // value to grab for event listener
     .classed("active", true)
     // .attr('class', 'active')
     .text("In Poverty(%)");

     var yInclabel = labelsGroup.append('text')
     .attr("transform", "rotate(-90)")
     .attr("y", -80)
     .attr("x", 0- (height/2))
     .attr("dy", "1em")
     .attr("value", "income") // value to grab for event listener
     // .attr('class', 'inactive')
     .classed("inactive", true)
     .text("Median Income($)");

     // chartGroup.append('text')
     // .attr('x', `${width/2}`)
     // .attr('y',`${height + 40}`)
     // .classed('axis-text', true)
     // .text('Median age(Years)');

     var xLabelsgroup = chartGroup.append('g'); //********

     var xAgelabel = xLabelsgroup.append('text')   //**********
     .attr('x', `${width/2}`)
     .attr('y',`${height + 40}`)
     .attr("dy", "1em")
     .attr("value", "age") // value to grab for event listener
     .classed("active", true)
     .text('Median age(Years)');

     var xSmokerlabel = xLabelsgroup.append('text')     //*************
     .attr('x', `${width/2}`)
     .attr('y',`${height + 60}`)
     .attr("dy", "1em")
     .attr("value", "smokes") // value to grab for event listener
     .classed("inactive", true)
     .text('Smokes(%)');



     // updateToolTip function above csv import
     var circlesGroup = updateToolTip(displayedYaxis,displayedXaxis, circlesGroup);    //***********


     // Y axis labels event listener
     labelsGroup.selectAll("text")
       .on("click", function() {
         // get value of selection
         var value = d3.select(this).attr("value");
         console.log('chosen Y axis: ' +value);
         console.log('prior Y axis: '+ displayedYaxis);
         if (value !== displayedYaxis) {

           // replaces displayedYaxis with value
           displayedYaxis = value;
           console.log('current Y axis: ' + displayedYaxis);
           // console.log(displayedYaxis)

           // functions here found above csv import
           // updates y scale for new data
           yLinearScale = yScale(data, displayedYaxis);

           // updates y axis with transition
           yAxis = renderYaxis(yLinearScale, yAxis);

           // updates circles with new y values
           var centerplane = 'cy';
           var plane = 'y'
           circlesGroup = renderCircles(circlesGroup,centerplane, yLinearScale, displayedYaxis);
           stateLabels = renderStatelabels(stateLabels, plane, yLinearScale, displayedYaxis);

           // updates tooltips with new info
           circlesGroup = updateToolTip(displayedYaxis, displayedXaxis, circlesGroup); ////*************

           // changes classes to change bold text
           if (displayedYaxis === "income") {
             yInclabel
               .classed("active", true)
               .classed("inactive", false);

             yPovlabel
               .classed("active", false)
               .classed("inactive", true);

           }
           else {
             yInclabel
               .classed("active", false)
               .classed("inactive", true);

             yPovlabel
               .classed("active", true)
               .classed("inactive", false);
           }
         }
       });// End 'on click event' for y axis.

       // X axis labels event listener                             *******************
       xLabelsgroup.selectAll("text")
         .on("click", function() {
           // get value of selection
           var value = d3.select(this).attr("value");
           console.log('chosen x axis: ' + value);
           console.log('prior x axis: '+ displayedXaxis);
           if (value !== displayedXaxis) {

             // replaces displayedXaxis with value
             displayedXaxis = value;
             console.log('current X axis: ' + displayedXaxis);
             // console.log(displayedXaxis)

             // functions here found above csv import
             // updates X scale for new data
             xLinearScale = xScale(data, displayedXaxis);

             // updates X axis with transition
             xAxis = renderXaxis(xLinearScale, xAxis);

             // updates circles with new X values
             var centerplane = 'cx';
             var plane = 'x'
             circlesGroup = renderCircles(circlesGroup,centerplane, xLinearScale, displayedXaxis);
             stateLabels = renderStatelabels(stateLabels, plane, xLinearScale, displayedXaxis);

             // updates tooltips with new info
             circlesGroup = updateToolTip(displayedYaxis, displayedXaxis, circlesGroup);

             // changes classes to change bold text
             if (displayedXaxis === "smokes") {
               xSmokerlabel
                 .classed("active", true)
                 .classed("inactive", false);

               xAgelabel
                 .classed("active", false)
                 .classed("inactive", true);

             }
             else {
               xSmokerlabel
                 .classed("active", false)
                 .classed("inactive", true);

               xAgelabel
                 .classed("active", true)
                 .classed("inactive", false);
             }
           }
         });// End 'on click event' for X axis.

  }) // End csv.then(data){}
