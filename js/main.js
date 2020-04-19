//chart setup
let chart = document.getElementById('chart');
let cc = chart.getContext('2d');

//init function, gets called when window is resized or resetbutton is pressed
//init the simulation variables
let population;
let baseattributes;
let communityattributes;

//init the chart variables
let linechart;
let chartdata;

function init() {
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
    population = new Population(100, communityattributes, baseattributes);


    //setup the chart
    chartdata = {
        type: 'line',
        data: {
            labels: population.daylist,
            datasets: [{
                label: "Infections",
                data: population.infectionlist,
                backgroundColor: "rgba(255,0,0,0.5)"
            }, {
                label: "Healthy",
                data: population.healthylist,
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
}

//animate function
function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);

    population.update();
    linechart.update();
}

init();
animate();