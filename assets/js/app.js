// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
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

// function used for updating x-scale var upon click on axis label
function yScale(data, initYaxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[displayedYaxis]) * .95, d3.max(data, d => d[displayedYaxis]) * 1.05 ])
    .range([0,height]);
  return yLinearScale;
};

// function used for updating yAxis var upon click on axis label
function renderAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return yAxis;
};


d3.csv("assets/data/data.csv")
  .then((data) => {
    // Parse Data
    data.forEach((entry) => {
      entry.abbr = entry.abbr,
      entry.state = entry.state,
      entry.poverty = +entry.poverty,
      entry.age = +entry.age,
      entry.income = +entry.income,
      entry.healthcare = +entry.healthcare,
      entry.obesity = +entry.obesity,
      entry.smokes = +entry.smokes

      // Step 2: Create scale functions
      // ==============================

      var xScale_age = d3.scaleLinear()
      .domain(d3.extent(data, entry => entry.age))
      .range([0,width]);

      var yLinearScale = yScale(data, displayedYaxis);



      // Step 6: Create Axes
      // =============================================
      var bttmAxis_age = d3.axisBottom(xScale_age);
      var leftAxis = d3.axisLeft(yLinearScale);


      // Step 4: Append Axes to the chart
      // ==============================

      var xAxis = chartGroup.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(bttmAxis_age);


      var yAxis = chartGroup.append('g')
      .call(leftAxis);
  //
      // Step 5: Create Circles
      // ==============================
       var circlesGroup = chartGroup.selectAll('circle')
       .data(data)
       .enter()
       .append('circle')
       .attr('cx', d => xScale_age(d.age))
       .attr('cy', d => yLinearScale(d.displayedYaxis))
       .attr('r','10')
       .attr('fill','red')
       .attr('stroke-width', '1')
       .attr('stroke','black');

       // Create group for  multiple y- axis labels
       var labelsGroup = chartGroup.append("g");


       var yPovlabel = labelsGroup.append('text')
       .attr("transform", "rotate(-90)")
       .attr("y", -60)
       .attr("x", 0 - (height/2))
       .attr("value", "poverty") // value to grab for event listener
       .classed("active", true)
       .text("In Poverty(%)");

       var yInclabel = labelsGroup.append('text')
       .attr("transform", "rotate(-90)")
       .attr("y", -80)
       .attr("x", 0- (height/2))
       // .attr("dy", "1em")
       .attr("value", "income") // value to grab for event listener
       .classed("inactive", true)
       .text("Income(Baller Units)");

       chartGroup.append('text')
       .attr('x', `${width/2}`)
       .attr('y',`${height + 40}`)
       .classed('axis-text', true)
       .text('age(In Personal Opinion)');

       // x axis labels event listener
       labelsGroup.selectAll("text")
         .on("click", function() {
           // get value of selection
           var value = d3.select(this).attr("value");
           if (value !== displayedYaxis) {

             // replaces chosenXaxis with value
             displayedYaxis = value;

             // console.log(chosenXAxis)

             // functions here found above csv import
             // updates x scale for new data
             yLinearScale = yScale(data, displayedYaxis);

             // updates x axis with transition
             yAxis = renderAxes(yLinearScale, yAxis);

             // updates circles with new x values
             circlesGroup = renderCircles(circlesGroup, yLinearScale, displayedYaxis);

             // updates tooltips with new info
             circlesGroup = updateToolTip(displayedYaxis, circlesGroup);

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
         });





    })// End data.foreach(entry){}
  }) // End csv.then(data){}
