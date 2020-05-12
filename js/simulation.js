//All the classes needed for the simulation

//Get the canvas Element
let canvas = document.getElementById('simulation'); //save the canvas object in a variable
let c = canvas.getContext('2d'); //save the context of the canvas in a variable


//Represents one Particle on the screen  
class Particle {

    constructor(x, y, infected, baseattributes) {
        //Basic attributes of the particle
        this.x = x; //The current x-Position relative to the upper right corner
        this.y = y; //The current y-Position relative to the upper left corner
        this.baseattributes = baseattributes; //The Baseattributes every Particle has the same
        this.velocity = {x: (Math.random()-0.5) * 2 * this.baseattributes.velocity}; //The velocity of the Particle in [Pixels per Refresh]
        this.velocity.y = randomsign() * Math.sqrt(Math.pow(this.baseattributes.velocity, 2) - Math.pow(this.velocity.x, 2));

        //Infection specific states of the particle
        this.infected = infected; //The infectionstate of the particle
        this.inincubation = infected; //Whether the particle is infected but doesent show any symptoms yet
        this.healed = false; //Wether the particle is healed
    }

    draw() {
        //set the right color
        if (this.infected) {
            c.fillStyle = this.baseattributes.infectioncolor;
        } else if (this.inincubation) {
            c.fillStyle = this.baseattributes.incubationcolor;
        } else if (this.healed) {
            c.fillStyle = this.baseattributes.healcolor;
        } else {
            c.fillStyle = this.baseattributes.basecolor;
        }

        c.beginPath();
        c.arc(this.x, this.y, this.baseattributes.radius, 0, Math.PI * 2);
        c.fill();
    }
}

//Represents a community on the screen, contains particles
class Community {

    constructor(communityid, size, xStart, xEnd, yStart, yEnd, hasstartinfections, startinfectionamount, baseattributes) {
        this.communityid = communityid; //Identificationnumber for the community
        this.size = size;
        this.baseattributes = baseattributes;
        this.xStart = xStart; //The start of the communityspace in [Pixels] x
        this.xEnd = xEnd; //The end of the communityspace in [Pixels] x
        this.yStart = yStart; //The start of the communityspace in [Pixels] y
        this.yEnd = yEnd; //The end of the communityspace in [Pixels] y
        this.hasstartinfections = hasstartinfections; //If the community has particles that are infected from the beginning on in bool
        this.startinfectionamount = startinfectionamount; //The amount of particles that are infected from the beginning on in probability [0,1]

        //populate the community
        this.particles = [];
        for (let i = 0; i < this.size; ++i) {
            this.particles.push(new Particle(randominterval(this.xStart+this.baseattributes.radius, this.xEnd-this.baseattributes.radius),
                                             randominterval(this.yStart+this.baseattributes.radius, this.yEnd-this.baseattributes.radius),
                                             probability(startinfectionamount),
                                             this.baseattributes));
        }
    }

    move(particle) { //moves the one particle

        //checks the x boundary conditions
        if (particle.x + this.baseattributes.radius > this.xEnd || particle.x - this.baseattributes.radius < this.xStart) {
            particle.velocity.x = -particle.velocity.x;
        }
        //checks the y boundary conditions
        if (particle.y + this.baseattributes.radius > this.yEnd || particle.y - this.baseattributes.radius < this.yStart) {
            particle.velocity.y = -particle.velocity.y;
        }
    
        particle.x += particle.velocity.x;
        particle.y += particle.velocity.y;
    }

    countinfections() {
        let counter = 0;
        this.particles.forEach(particle => {
            if (particle.infected) {
                counter += 1;
            }
        });

        return counter;
    }

    update() { //updates the community

        //move the particles
        this.particles.forEach(particle => {this.move(particle)});

        //object detection
        for (let i=0; i < this.particles.length; ++i) {
            for (let n=i+1; n < this.particles.length; ++n) {
                if (getdistance(this.particles[i].x, this.particles[i].y, this.particles[n].x, this.particles[n].y) < this.baseattributes.radius*2) {
                    if (this.particles[i].infected && !this.particles[n].infected) {
                        this.particles[n].infected = probability(this.baseattributes.infectionrate);
                    } else if (!this.particles[i].infected && this.particles[n].infected) {
                        this.particles[i].infected = probability(this.baseattributes.infectionrate);
                    }
                }
            }
        }

        //draw the particles
        this.particles.forEach(particle => {particle.draw()});

        //draw the border
        c.fillStyle = "rgba(255, 255, 255, 1)"
        c.beginPath();
        c.moveTo(this.xStart, this.yStart);
        c.lineTo(this.xStart, this.yEnd);
        c.lineTo(this.xEnd, this.yEnd);
        c.lineTo(this.xEnd, this.yStart);
        c.lineTo(this.xStart, this.yStart);
        c.stroke();
    }
}

//Represents the whole Population on the screen, contains communities
class Population {

    constructor(dayscount, communityattributes, baseattributes) { //pop = population
        this.communityamount = communityattributes.size.length //The amount of communities
        this.baseattributes = baseattributes; //The Baseattributes every Particle has the same
        this.communityattributes = communityattributes; //Object that contains info for all the communities
        this.clock = 0; //Increases on every refresh
        this.infectioncounter = 0; //How many particles are infected
        this.dayscount = dayscount; //How many refreshes are a day
        this.dayscounter = 0; //The amount of days being passed

        //populate the population
        this.communities = [];
        this.communityattributes.size.forEach((element, index) => {
            this.communities.push(new Community(index,
                                                element,
                                                border(this.communityattributes, index, 5, canvas).xStart,
                                                border(this.communityattributes, index, 5, canvas).xEnd,
                                                border(this.communityattributes, index, 5, canvas).yStart,
                                                border(this.communityattributes, index, 5, canvas).yEnd,
                                                this.communityattributes.hasstartinfections[index],
                                                this.communityattributes.startinfectionamount[index],
                                                this.baseattributes));                      
        });

        //chart specific variables
        this.infectionlist = [];
        this.healthylist = [];
        this.daylist = [];

        //other setups
        this.popsize = this.getpopsize();
    }

    getpopsize() {
        let counter = 0;
        this.communities.forEach(community => {
            counter += community.size;
        })
        return counter;
    }

    countinfections() {
        let counter = 0;
        this.communities.forEach(community => {
            counter += community.countinfections()
        });

        return counter;
    }

    update() {
        //update the communities
        this.communities.forEach(community => {community.update()});
        
        
        //count the infections
        this.infectioncounter = this.countinfections();
        

        //update the infectionlist/healthylist
        if (this.clock%this.dayscount == 0) {
            this.infectionlist.push((this.infectioncounter/this.popsize)*100);
            this.healthylist.push(100-(this.infectioncounter/this.popsize)*100)
            this.daylist.push(this.dayscounter);
            this.dayscounter += 1;
        }

        //update the clock
        this.clock += 1;
    }
}

