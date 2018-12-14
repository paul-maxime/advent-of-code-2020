// Advent of Code 2018
// Day 13

const fs = require('fs');
const content = fs.readFileSync('./input', 'utf8');
const lines = content.split('\n').filter(x => x.length > 0);

const height = lines.length;
const width = lines[0].length;
const map = new Array(width * height);
const initialCarts = [];

lines.forEach((line, y) => {
    [...line].forEach((c, x) => {
        switch (c) {
            case '<':
            case '>':
                initialCarts.push({ x, y, dir: c, step: 0, crashed: false });
                c = '-';
                break;
            case '^':
            case 'v':
                initialCarts.push({ x, y, dir: c, step: 0, crashed: false });
                c = '|';
                break;
        }
        map[y * width + x] = c;
    });
});

const intersectLeft = {
    '^': '<',
    'v': '>',
    '<': '^',
    '>': 'v',
};
const intersectRight = {
    '^': '>',
    'v': '<',
    '<': 'v',
    '>': '^',
};
const turnLeft = {
    '^': '<',
    'v': '>',
    '<': 'v',
    '>': '^',
};
const turnRight = {
    '^': '>',
    'v': '<',
    '<': '^',
    '>': 'v',
};

let firstCrash = null;

function update(carts) {
    carts.filter(x => !x.crashed).sort((a, b) => a.y === b.y ? a.x - b.x : a.y - b.y).forEach(cart => {
        switch (cart.dir) {
            case '>':
                cart.x++;
                break;
            case '<':
                cart.x--;
                break;
            case '^':
                cart.y--;
                break;
            case 'v':
                cart.y++;
                break;
        }
        switch (map[cart.y * width + cart.x]) {
            case '\\':
                cart.dir = intersectLeft[cart.dir];
                break;
            case '/':
                cart.dir = intersectRight[cart.dir];
                break;
            case '+':
                if (cart.step === 0) {
                    cart.dir = turnLeft[cart.dir];
                } else if (cart.step === 2) {
                    cart.dir = turnRight[cart.dir];
                }
                cart.step = (cart.step + 1) % 3;
                break;
        }
        const collisions = carts.filter(cartB => cartB !== cart && cart.x === cartB.x && cart.y === cartB.y);
        if (collisions.length > 0) {
            collisions.forEach(cartB => { cartB.crashed = true; });
            cart.crashed = true;
            if (firstCrash === null) {
                firstCrash =  {x: cart.x, y: cart.y };
            }
        }
    });
}

let carts = initialCarts.slice();

while (firstCrash === null) {
    update(carts);
}

console.log(firstCrash);

carts = initialCarts.slice();

while (true) {
    update(carts);
    carts = carts.filter(x => !x.crashed);
    if (carts.length <= 1) {
        console.log(carts);
        break;
    }
}
