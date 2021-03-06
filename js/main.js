//most basic options
let popsize = 800;

//chart setup
let chart = document.getElementById('chart');
let cc = chart.getContext('2d');

//setup the buttons
let resetButton = document.getElementById('resetButton');
let infectionrateSlider = document.getElementById('infectionrateSlider');
let deathrateSlider = document.getElementById('deathrateSlider');
let healtimeSlider = document.getElementById('healtimeSlider');

//this funtion gets all the options from the menu and inserts them into code
function getinfo(baseattributes, communityattributes) {
    //get the infectionrate
    baseattributes.infectionrate = infectionrateSlider.value/1000;
    baseattributes.deathrate = deathrateSlider.value/100;
    baseattributes.healtime = healtimeSlider.value;
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
                backgroundColor: "#E34A6F"
            }, {
                label: "Genesen",
                //data: population.healthylist,
                data: [],
                backgroundColor: "#60A561"
            }, {
                label: "Tot",
                //data: population.healthylist,
                data: [],
                backgroundColor: "#000000"
            }, {
                label: "Gesund",
                //data: population.healthylist,
                data: [],
                backgroundColor: "#9AC4F8"
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
    canvas.height = canvas.offsetWidth;

    //setup the simulation
    //determine the radius (mobile/desktop)
    let radius = canvas.width/80;
    let velocity = canvas.width/400;
    baseattributes = {
        velocity: velocity,
        radius: radius,
        basecolor: "#9AC4F8",
        incubationcolor: "#E3E36A",
        infectioncolor: "#E34A6F",
        healcolor: "#60A561",
        deathcolor: "#000000",
        infectionrate: 0.0005,
        deathrate: 0.1,
        incubationtime: 100,
        healtime: 7
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
    chartdata.data.datasets[1].data = population.healedlist;
    chartdata.data.datasets[2].data = population.deathlist;
    chartdata.data.datasets[3].data = population.healthylist;
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
