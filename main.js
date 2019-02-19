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
let xMaxPad = 10;
let yMaxPad = 4;

let numDaysSlider = document.querySelector("#numDaysSlider");
let daysText = document.querySelector("#daysText");

let dataURL = "data.csv";

let parseDate = d3.timeParse('%Y-%m-%d'); // put code here for d3 date parsing  

let goodSleep = 7.5;

let key = (d) => d.date;  // put code here for key function to join data to visual elements 

let minDate = (data) => d3.min(data,(d) => d.date);
let maxDate = (data) => d3.timeDay.offset(d3.max(data,(d) => d.date),1);

//Reusable function for bar width
function barWidth(numBars){
  return (w-(xMinPad+xMaxPad))/numBars;
}

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
      .range([xMinPad,w-xMaxPad]);
    yScale = d3.scaleLinear()
      .domain([0,12])
      .range([h-(yMinPad+yMaxPad),0]);
    cScale = d3.scaleLinear()
      .domain([0,12])
      .range(['red','orange']);
    
    var defaultNum = 7;
    //Create bars
    svg
      .selectAll('rect')
      .data(dataset,key)
      .enter()
      .append('rect')
      .attr('x',(d) => xScale(d.date))
      .attr('y',(d) => yScale(d.hours_of_sleep)-yMinPad)
      .attr('width',barWidth(defaultNum))
      .attr('height',(d) => h-yScale(d.hours_of_sleep))
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
      .attr('transform',`translate(${yAxisOff},${yMaxPad})`)
      .call(yAxis);
  })
}

function updateGraph() {
  let numDays = numDaysSlider.value;
  daysText.innerText = numDays;
  
  var newData = dataset.slice(7-numDays,7);
  
  //Update scales
  xScale.domain([minDate(newData),maxDate(newData)]);
  
  //Update chart.
  var bars = svg.selectAll('rect')
    .data(newData,key);
  bars.enter()
    .append('rect')
    .attr('x',(d) => -1*barWidth(numDays))
    .attr('y',(d) => h - yScale(d.hours_of_sleep)-yMinPad)
    .attr('height',(d) => yScale(d.hours_of_sleep))
    .attr('fill',(d) => cScale(d.hours_of_sleep))
    .merge(bars)
    .transition('barsIn')
    .duration(500)
    .attr('x',(d) => xScale(d.date))
    .attr('width',barWidth(numDays));
  bars.exit()
    .transition('barsOut')
    .duration(500)
    .attr('x',(d) => -1*barWidth(numDays))
    .remove();
  
  xAxisGroup
    .transition('xAxis')
    .duration(500)
    .call(xAxis);
  
}

window.onload = function() {
  initGraph(); 
  numDaysSlider.addEventListener('change', updateGraph);
}
