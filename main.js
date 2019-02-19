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
