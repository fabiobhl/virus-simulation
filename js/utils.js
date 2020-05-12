//All the helper Funtions

//calculates shortest distance between two points
function getdistance(x1, y1, x2, y2) {
    const xDist = x2 - x1;
    const yDist = y2 - y1;
  
    return Math.hypot(xDist, yDist);
}
//sleeper function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
//returns true with a chance of p
function probability(p) {
    if (Math.random() < p) {
        return true;
    } else {
        return false;
    }
}
//returns random number in interval
function randominterval(start, end) {
    let distance = end - start;
    return Math.round(start + Math.random() * distance);
}
//returns the borders of the community
function border(communityattributes, index, padding, canvas) {
    let amount = communityattributes.size.length;
    if (amount == 1) {
        return {
            xStart: 0,
            xEnd: canvas.width,
            yStart: 0,
            yEnd: canvas.height
        };
    } else if (amount == 2) {
        let width = canvas.width/2-2*padding;
        let height = canvas.height-2*padding;
        return {
            xStart: padding + (width+2*padding)*(index % 2),
            xEnd: padding + (width+2*padding)*(index % 2)+width,
            yStart: padding,
            yEnd: padding + height
        };
    } else if (amount == 4) {
        let width = canvas.width/2-2*padding;
        let height = canvas.height/2-2*padding;
        if (index == 0) {
            return {
                xStart: padding,
                xEnd: padding + width,
                yStart: padding,
                yEnd: padding + height
            };
        } else if (index == 1) {
            return {
                xStart: padding + (width+2*padding),
                xEnd: padding + (width+2*padding) + width,
                yStart: padding,
                yEnd: padding + height
            };
        } else if (index == 2) {
            return {
                xStart: padding,
                xEnd: padding + height,
                yStart: padding + (height+2*padding),
                yEnd: padding + (height+2*padding) + height
            };
        } else {
            return {
                xStart: padding + (width+2*padding),
                xEnd: padding + (width+2*padding) + width,
                yStart: padding + (height+2*padding),
                yEnd: padding + (height+2*padding) + height
            };
        }
        
    }
}

//returns a random sign
function randomsign() {
    let a = [-1,1];
    return a[Math.floor(Math.random()*2)];
}