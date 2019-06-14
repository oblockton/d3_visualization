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

d3.csv("data.csv")
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

      var yScale_poverty = d3.scaleLinear()
      .domain(d3.extent(data, entry => entry.poverty))
      .range([0,height]);

      var ySCale_income = d3.scaleLinear()
      .domain(d3.extent(data, entry => entry.income))
      .range([0,height]);

      // Step 6: Create Axes
      // =============================================
      var xAxis_age = d3.axisBottom(xScale_age);
      var yAxis_poverty = d3.axisLeft(yScale_poverty);
      var yAxis_income = d3.axisLeft(ySCale_income);

      // Step 4: Append Axes to the chart
      // ==============================

      chartGroup.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis_age);

      chartGroup.append('g')
      .call(yAxis_poverty);

      chartGroup.append('g')
      .call(yAxis_poverty);

      // Step 5: Create Circles
      // ==============================
       var circlesGroup =chartGroup.selectAll('circle')
       .data(hairData)
       .enter()
       .append('circle')
       .attr('cx', d => xScale(d.hair_length))
       .attr('cy', d => yScale(d.num_hits))
       .attr('r','10')
       .attr('fill','red')
       .attr('stroke-width', '1')
       .attr('stroke','black');


    })// End data.foreach(entry){}
  }) // End csv.then(data){}
