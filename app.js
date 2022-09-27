const covid = axios.create({
  baseURL: 'https://api.covid19api.com/',
  timeout: 10000
});

var countryName = [];
var slug = [];
var newConfirmed = [];
var totalConfirmed = [];
var newDeaths = [];
var totalDeaths = [];
var newRecovered = [];
var totalRecovered = [];
var totalConfirmedCount = 0;
var totalDeathsCount = 0;
var totalRecoveredCount = 0;
var todayDate;
var chart = new CanvasJS.Chart("chartContainer", {
	animationEnabled: true,
	title:{
		text: "Statistic of Covid-19"
	},
	axisX: {
		valueFormatString: "DD MMM,YY"
	},
	axisY: {
		title: "Population (in people)",
		includeZero: true,
		suffix: " people"
	},
	legend:{
		cursor: "pointer",
		fontSize: 12,
		itemclick: toggleDataSeries
	},
	toolTip:{
		shared: true
	},
  backgroundColor: "#F5DEB3",
	data: []
});
  
function toggleDataSeries(e){
	if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
		e.dataSeries.visible = false;
	}
	else{
		e.dataSeries.visible = true;
	}
	chart.render();
}

covid.get('summary')
  .then(function (res) {
    // handle success
    /* parsing data */
    let countryData = res.data.Countries;
    for(let i = 0; i < countryData.length; i++){
      let value = Object.values(countryData[i]);
      let index = 0;
      countryName[i] = value[index];
      slug[i] = value[index+2];
      newConfirmed[i] = value[index+3];
      totalConfirmed[i] = value[index+4];
      newDeaths[i] = value[index+5];
      totalDeaths[i] = value[index+6];
      newRecovered[i] = value[index+7];
      totalRecovered[i] = value[index+8];
    }
    
    /* get the date of today */
    todayDate = new Date(res.data.Date);
    let data = document.getElementById("date");
    date.innerHTML = "Date: " + todayDate.toDateString() + " (" + "updates at 10:08 a.m. every day" + ")";
  
    calculateData();
  
    insertInfoTable();
    
    showFirstPage();
  })
  .catch(function (err) {
    // handle error
    console.log(err);
  })
  .finally(function() {
    //always executed 
  });

function myMatching(){
  let input = document.getElementById("input").value;
  let tableCell = document.getElementsByTagName("td");
  if(input){
    for(let i = 0; i < tableCell.length; i+=8){
      if(tableCell[i].innerHTML.toUpperCase().indexOf(input.toUpperCase()) > -1){
        tableCell[i].parentNode.style.display = "";
      }  else {
        tableCell[i].parentNode.style.display = "none";
      }
    }
  } else 
    showFirstPage();
}

function insertInfoTable(){
  let table = document.createElement("table");
  let thead = document.createElement("thead");
  let tbody = document.createElement("tbody");
  let tfoot = document.createElement("tfoot");
  
  /* thead */
  let header = document.createElement("tr");
  let header1 = document.createElement("th");
  header1.innerHTML = "Country Name";
  let header2 = document.createElement("th");
  header2.innerHTML = "Slug";
  let header3 = document.createElement("th");
  header3.innerHTML = "New Confirmed";
  let header4 = document.createElement("th");
  header4.innerHTML = "Total Confirmed";
  let header5 = document.createElement("th");
  header5.innerHTML = "New Deaths";
  let header6 = document.createElement("th");
  header6.innerHTML = "Total Deaths";
  let header7 = document.createElement("th");
  header7.innerHTML = "New Recovered";
  let header8 = document.createElement("th");
  header8.innerHTML = "Total Recovered";
  
  header.appendChild(header1);
  header.appendChild(header2);
  header.appendChild(header3);
  header.appendChild(header4);
  header.appendChild(header5);
  header.appendChild(header6);
  header.appendChild(header7);
  header.appendChild(header8);
  
  thead.appendChild(header);
  /* end of thead */
  
  /* tbody */
  for(let i = 0; i < countryName.length; i++){
      let body = document.createElement("tr");
      let td1 = document.createElement("td");
      td1.innerHTML = countryName[i];
      let td2 = document.createElement("td");
      td2.innerHTML = slug[i];
      let td3 = document.createElement("td");
      td3.innerHTML = newConfirmed[i];
      let td4 = document.createElement("td");
      td4.innerHTML = totalConfirmed[i];
      let td5 = document.createElement("td");
      td5.innerHTML = newDeaths[i];
      let td6 = document.createElement("td");
      td6.innerHTML = totalDeaths[i];
      let td7 = document.createElement("td");
      td7.innerHTML = newRecovered[i];
      let td8 = document.createElement("td");
      td8.innerHTML = totalRecovered[i];
    
      body.appendChild(td1);
      body.appendChild(td2);
      body.appendChild(td3);
      body.appendChild(td4);
      body.appendChild(td5);
      body.appendChild(td6);
      body.appendChild(td7);
      body.appendChild(td8);
    
      tbody.appendChild(body);
  }
  /* end of tbody */
  
  /* tfoot */
  let foot = document.createElement("tr");
  
  /* create table */
  table.appendChild(thead);
  table.appendChild(tbody);
  table.appendChild(tfoot);
  
  tableContainer.appendChild(table);
}

/* calculate the total data */
function calculateData(){
  for(let i = 0; i < countryName.length; ++i)
    totalConfirmedCount += totalConfirmed[i];
  
  for(let i = 0; i < countryName.length; ++i)
    totalDeathsCount += totalDeaths[i];
  
  for(let i = 0; i < countryName.length; ++i)
    totalRecoveredCount += totalRecovered[i];
  
  let tConfirmed = document.getElementById("totalConfirmed");
  let tDeaths = document.getElementById("totalDeaths");
  let tRecovered = document.getElementById("totalRecovered");
  tConfirmed.innerHTML = "Total Confirmed: " + totalConfirmedCount;
  tDeaths.innerHTML = "Total Deaths: " + totalDeathsCount;
  tRecovered.innerHTML = "Total Recovered: " + totalRecoveredCount;
}

/* cookies */
function setCookie(cName, cValue, exDays){
    var date = new Date();
    date.setTime(date.getTime() + (exDays*24*60*60*1000));
    var expires = "expires=" + date.toUTCString();
    document.cookie = cName + "=" + cValue + ";" + expires + ";path=/";
}

function getCookie(cName){
    var name = cName + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var cArr = decodedCookie.split(';');
    for(let i = 0; i < cArr.length; i++){
      var c = cArr[i];
      while(c.charAt(0) == ' '){
        c = c.substring(1);
      }
      if(c.indexOf(name) == 0){
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

function checkCookie(){
    var name = getCookie("name");
    if(name != ""){
      alert("Welcome Back" + name);
    } else {
      name = prompt("Please Enter your name: ");
      if(name != "" && name != null){
        setCookie("name", name, 365);
      }
    }
}
/* end cookies */

/* Menu Bar */
let openButton = document.getElementById("openButton");
openButton.addEventListener("click", ()=>{
    let h1 = document.getElementsByTagName("h1");
    let footer = document.getElementsByTagName("footer");
    let sideBar = document.getElementById("mySideBar");
    let main = document.getElementById("main");
    sideBar.style.width = "300px";
    h1[0].style.marginLeft = "300px";
    footer[0].style.marginLeft = "300px";
    main.style.marginLeft = "300px";
});

let closeButton = document.getElementById("closeButton");
closeButton.addEventListener("click", ()=>{
    let h1 = document.getElementsByTagName("h1");
    let footer = document.getElementsByTagName("footer");
    let sideBar = document.getElementById("mySideBar");
    let main = document.getElementById("main");
    sideBar.style.width = "0";
    h1[0].style.marginLeft = "0";
    footer[0].style.marginLeft = "0";
    main.style.marginLeft = "0";
});
/* end menu bar*/

/* to top button */
let toTopButton = document.getElementById("toTop");
toTopButton.addEventListener("click", ()=>{
    document.documentElement.scrollTop = 0;
});

/* Pagination 1 page contains 50 countries */
let page1 = document.getElementById("page1");
let page2 = document.getElementById("page2");
let page3 = document.getElementById("page3");
let page4 = document.getElementById("page4");
let page5 = document.getElementById("page5");
let currentPage = document.getElementById("currentPage");
var tableCell = document.getElementsByTagName("td");

page1.addEventListener("click", ()=>{
    for(let i = 0; i < 400; i+=8)
      tableCell[i].parentNode.style.display = "";
    
    for(let i = 400; i < tableCell.length; i+=8)
      tableCell[i].parentNode.style.display = "none";
    
    currentPage.innerHTML = "1";
});
page2.addEventListener("click", ()=>{
    for(let i = 0; i < 400; i+=8)
      tableCell[i].parentNode.style.display = "none";
    
    for(let i = 400; i < 800; i+=8)
      tableCell[i].parentNode.style.display = "";
    
    for(let i = 800; i < tableCell.length; i+=8)
      tableCell[i].parentNode.style.display = "none";
    
    currentPage.innerHTML = "2";
});
page3.addEventListener("click", ()=>{
    for(let i = 0; i < 800; i+=8)
      tableCell[i].parentNode.style.display = "none";
    
    for(let i = 800; i < 1200; i+=8)
      tableCell[i].parentNode.style.display = "";
    
    for(let i = 1200; i < tableCell.length; i+=8)
      tableCell[i].parentNode.style.display = "none";
    
    currentPage.innerHTML = "3";
});
page4.addEventListener("click", ()=>{
    for(let i = 0; i < 1200; i+=8)
      tableCell[i].parentNode.style.display = "none";
    
    for(let i = 1200; i < 1600; i+=8)
      tableCell[i].parentNode.style.display = "";
    
    for(let i = 1600; i < tableCell.length; i+=8)
      tableCell[i].parentNode.style.display = "none";
    
    currentPage.innerHTML = "4";
});
page5.addEventListener("click", ()=>{
    for(let i = 0; i < 1600; i+=8)
      tableCell[i].parentNode.style.display = "none";
    
    for(let i = 1600; i < tableCell.length; i+=8)
      tableCell[i].parentNode.style.display = "";
    
    currentPage.innerHTML = "5";
});

function showFirstPage(){
  for(let i = 0; i < 400; i+=8){
     tableCell[i].parentNode.style.display = "";
  }
  for(let i = 400; i < tableCell.length; i+=8){
    tableCell[i].parentNode.style.display = "none";
  }
  
  let chartContainer = document.getElementById("chartContainer");
  chartContainer.style.display = "none";
}
/* end pagination */

/* statistic */
function statsRequest(){
    let input = document.getElementById("input").value;
    if(input === null)
      return;
    var countryName = input.charAt(0).toUpperCase() + input.slice(1);
    var xhrC = new XMLHttpRequest();
    xhrC.onreadystatechange = function(){
      if(this.readyState === 4 && this.status === 200){
        var type = this.getResponseHeader("Content-type");
        if(type.indexOf("application/json") > -1){
          var data = JSON.parse(this.responseText);
          var confirmedData = {
              name: "",
              type: "spline",
              yValueFormatString: "###### people",
              showInLegend: true,
              dataPoints: []
          };
          confirmedData.name = "Confirmed in " + countryName;
          for(let i = 0; i < data.length; ++i)
             confirmedData.dataPoints.push({x: new Date(data[i].Date), y: data[i].Cases});
          chart.options.data.push(confirmedData); 
        }
      }
    }
    var xhrD = new XMLHttpRequest();
    xhrD.onreadystatechange = function(){
      if(this.readyState === 4 && this.status === 200){
        var type = this.getResponseHeader("Content-type");
        if(type.indexOf("application/json") > -1){
          var data = JSON.parse(this.responseText);
          var deathsData = {
              name: "",
              type: "spline",
              yValueFormatString: "###### people",
              showInLegend: true,
              dataPoints: []
          };
          deathsData.name = "Deaths in " + countryName;
          for(let i = 0; i < data.length; ++i)
            deathsData.dataPoints.push({x: new Date(data[i].Date), y: data[i].Cases});
          chart.options.data.push(deathsData);
        }
      }
    }
    var xhrR = new XMLHttpRequest();
    xhrR.onreadystatechange = function(){
      if(this.readyState === 4 && this.status === 200){
        var type = this.getResponseHeader("Content-type");
        if(type.indexOf("application/json") > -1){
          var data = JSON.parse(this.responseText);
          var recoveredData = {
              name: "recovered",
              type: "spline",
              yValueFormatString: "###### people",
              showInLegend: true,
              dataPoints: []
          };
          recoveredData.name = "Recovered in " + countryName;
          for(let i = 0; i < data.length; ++i)
            recoveredData.dataPoints.push({x: new Date(data[i].Date), y: data[i].Cases});
          chart.options.data.push(recoveredData);
        }
      }
    }
    xhrC.open("GET", "https://api.covid19api.com/dayone/country/" + countryName + "/status/confirmed/live");
    xhrD.open("GET", "https://api.covid19api.com/dayone/country/" + countryName + "/status/deaths/live");
    xhrR.open("GET", "https://api.covid19api.com/dayone/country/" + countryName + "/status/recovered/live");
    xhrC.send();
    xhrD.send();
    xhrR.send();
}

function insertStats() {
    statsRequest();
    chart.render();
}

function showPlot(){
  let tableContainer = document.getElementById("tableContainer");
  let chartContainer = document.getElementById("chartContainer");
  let pagination = document.getElementById("pagination");
  pagination.style.display = "none";
  tableContainer.style.display = "none";
  chartContainer.style.display = "";
  
  let search = document.getElementById("search");
  let input = document.getElementById("input");
  input.onkeyup = "";
  let searchButton = document.getElementById("statSearchButton");
  if(searchButton){
    searchButton.style.display = "";
    input.placeholder = "Search for a country's stats e.g. Italy";
  }
  
  if(searchButton === null){
    let statSearchButton = document.createElement("button");
    statSearchButton.id = "statSearchButton";
    statSearchButton.innerHTML = "Search";
    statSearchButton.addEventListener("click", insertStats);
    input.placeholder = "Search for a country's stats e.g. Italy";
    search.appendChild(statSearchButton);
  }
}

function showMainData(){
  let tableContainer = document.getElementById("tableContainer");
  let chartContainer = document.getElementById("chartContainer");
  let input = document.getElementById("input");
  let pagination = document.getElementById("pagination");
  let statSearchButton = document.getElementById("statSearchButton");
  statSearchButton.style.display = "none";
  pagination.style.display = "";
  input.placeholder = "Search for a country e.g. Italy";
  input.setAttribute("onkeyup", "myMatching()");
  chartContainer.style.display = "none";
  tableContainer.style.display = "";
  showFirstPage();
}
