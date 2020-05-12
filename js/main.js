//most basic options
let popsize = 800;

//chart setup
let chart = document.getElementById('chart');
let cc = chart.getContext('2d');

//setup the buttons
let resetButton = document.getElementById('resetButton');
let infectionrateSlider = document.getElementById('infectionrateSlider');

//this funtion gets all the options from the menu and inserts them into code
function getinfo(baseattributes, communityattributes) {
    //get the infectionrate
    baseattributes.infectionrate = infectionrateSlider.value/1000;
}

//init the simulation variables
let population;
let baseattributes;
let communityattributes;

//init the chart variables
let linechart;
let chartdata;

//init function, gets called when window is resized or resetbutton is pressed
function init() {
    //setup the chart
    chartdata = {
        type: 'line',
        data: {
            //labels: population.daylist,
            labels: [],
            datasets: [{
                label: "Infiziert",
                //data: population.infectionlist,
                data: [],
                backgroundColor: "rgba(255,0,0,0.5)"
            }, {
                label: "Gesund",
                //data: population.healthylist,
                data: [],
                backgroundColor: "rgba(0,0,255,0.5)"
            }]
        },
        options: {
            responsive: true,
            scales: {
                yAxes: [{
                    stacked: true
                }]
            }
        }
    }
    linechart = new Chart(cc, chartdata);

    //adjusting the simulation size
    canvas.style.width ='100%';
    canvas.style.height='100%';
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    //setup the simulation
    baseattributes = {
        velocity: 1,
        radius: 5,
        basecolor: "rgba(0,0,255,1)",
        incubationcolor: "rgba(0,255,255,1)",
        infectioncolor: "rgba(255,0,0,1)",
        healcolor: "rgba(0,255,0,1)",
        infectionrate: 0.0005,
        deathrate: 0.5,
        incubationtime: 100,
        healtime: 100
    };
    communityattributes = {
        size: [800],
        hasstartinfections: [false],
        startinfectionamount: [0.01]
    };

    //get the info from the menu
    getinfo(baseattributes, communityattributes);
    //initialize the population
    population = new Population(100, communityattributes, baseattributes);

    //set the correct chart data
    chartdata.data.labels = population.daylist;
    chartdata.data.datasets[0].data = population.infectionlist;
    chartdata.data.datasets[1].data = population.healthylist;
}

//animate function
function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);

    population.update();
    linechart.update();
}

//attach all eventlisteners
resetButton.addEventListener('click', init);

init();
animate();
