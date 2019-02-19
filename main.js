let dataset;
let w = 600;
let h = 500;
let svg;
let xScale, yScale, cScale;
let xAxis, yAxis;
let xAxisGroup, yAxisGroup;

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
      .range([0,w]); //Note: add padding?
    yScale = d3.scaleLinear()
      .domain([0,12])
      .range([0,h]); //Note: add padding?
    cScale = d3.scaleLinear()
      .domain([0,12])
      .range(['red','orange']);
    
    var defaultNum = 7;
    //Create bars
    svg.selectAll('rect')
      .data(dataset,key)
      .enter()
      .append('rect')
      .attr('x',(d) => xScale(d.date))
      .attr('y',(d) => h - yScale(d.hours_of_sleep))
      .attr('width',w/defaultNum)
      .attr('height',(d) => yScale(d.hours_of_sleep))
      .attr('fill',(d) => cScale(d.hours_of_sleep));
    //Create axes
    
  })
}

function updateGraph() {
  let numDays = numDaysSlider.value;
  daysText.innerText = numDays;
}

window.onload = function() {
  initGraph(); 
  numDaysSlider.addEventListener('change', updateGraph);
}
