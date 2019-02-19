let dataset;
let w = 600;
let h = 500;
let svg;
let xScale, yScale, cScale;
let xAxis, yAxis;
let xAxisGroup, yAxisGroup;

// axis offsets 
// --- based on the size of the <g> elements
var xAxisOff = 18.1; // based on the height of the <g> element
var yAxisOff = 20; //based on the width of the <g> element

//padding
let xMinPad = yAxisOff;
let yMinPad = xAxisOff;

let numDaysSlider = document.querySelector("#numDaysSlider");
let daysText = document.querySelector("#daysText");

let dataURL = "data.csv";

let parseDate = d3.timeParse('%Y-%m-%d'); // put code here for d3 date parsing  

let goodSleep = 7.5;

let key = (d) => d.date;  // put code here for key function to join data to visual elements 

let minDate = (data) => d3.min(data,(d) => d.date);
let maxDate = (data) => d3.timeDay.offset(d3.max(data,(d) => d.date),1);

function rowConverter(d) {
  // put code here for row conversion
  return{
    date: parseDate(d.date),
    hours_of_sleep: parseFloat(d.hours_of_sleep)
  };
}

function initGraph() {
  d3.csv(dataURL, rowConverter).then((data) => {
    // sort by date ascending
    data.sort((a,b) => a.date - b.date);

    dataset = data;

    console.log(dataset);
    
    //Creating graph
    //Init svg
    svg = d3.select("#chart")
      .attr('width',w)
      .attr('height',h);
    
    //Create scales
    xScale = d3.scaleTime()
      .domain([minDate(dataset),maxDate(dataset)])
      .range([xMinPad,w]); //Note: add padding?
    yScale = d3.scaleLinear()
      .domain([0,12])
      .range([0,h-yMinPad]); //Note: add padding?
    cScale = d3.scaleLinear()
      .domain([0,12])
      .range(['red','orange']);
    
    var defaultNum = 7;
    //Create bars
    svg
    /* I don't know why this doesn't work...
      .append('g')
      .attr('class','bars')
      .attr('transform',`scale(1,-1) tanslate(0,${h})`)
    */
      .selectAll('rect')
      .data(dataset,key)
      .enter()
      .append('rect')
      .attr('x',(d) => xScale(d.date))
      .attr('y',(d) => h - yScale(d.hours_of_sleep)-yMinPad)
      //.attr('y',yMinPad)
      .attr('width',w/defaultNum)
      .attr('height',(d) => yScale(d.hours_of_sleep))
      .attr('fill',(d) => cScale(d.hours_of_sleep));
    
    //Create axes
    xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat('%a'));
    yAxis = d3.axisLeft(yScale);
    
    //Display axis
    xAxisGroup = svg.append('g')
      .attr('class','axis')
      .attr('transform',`translate(0,${h-xAxisOff})`)
      .call(xAxis);
    yAxisGroup = svg.append('g')
      .attr('class','axis')
      .attr('transform',`translate(${yAxisOff},0)`)
      .call(yAxis);
  })
}

function updateGraph() {
  let numDays = numDaysSlider.value;
  daysText.innerText = numDays;
  
  var newData = dataset.slice(7-numDays,7);
  console.dir(dataset);
  console.dir(newData);
  
  var barWidth = w/numDays;
  
  //Update scales
  xScale.domain([minDate(newData),maxDate(newData)]);
  
  //Update chart.
  var bars = svg.selectAll('rect')
    .data(newData,key);
  bars.enter()
    .append('rect')
    .attr('x',(d) => -1*barWidth)
    .attr('y',(d) => h - yScale(d.hours_of_sleep)-yMinPad)
    .attr('height',(d) => yScale(d.hours_of_sleep))
    .attr('fill',(d) => cScale(d.hours_of_sleep))
    .merge(bars)
    .transition('barsIn')
    .duration(1000)
    .attr('x',(d) => xScale(d.date))
    .attr('width',barWidth);
  bars.exit()
    .transition('barsOut')
    .duration(1000)
    .attr('x',(d) => -1*barWidth)
    .remove();
}

window.onload = function() {
  initGraph(); 
  numDaysSlider.addEventListener('change', updateGraph);
}
