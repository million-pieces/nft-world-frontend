export default {
  data() {
    return {
      symbolsMap: {
        A: 1,
        B: 2,
        C: 3,
        D: 4,
        E: 5,
        F: 6,
        G: 7,
        H: 8,
        I: 9,
        J: 10,
        K: 11,
        L: 12,
        M: 13,
        N: 14,
        O: 15,
        P: 16,
        Q: 17,
        R: 18,
        S: 19,
        T: 20,
        U: 21,
        V: 22,
        W: 23,
        X: 24,
        Y: 25,
        Z: 26,
      },
    };
  },
  methods: {
    getLetter(val) {
      return val.match(/[a-zA-Z]+/g);
    },
    getNumber(val) {
      return val.match(/\d+/g);
    },
    getCoordinatesNumbers(coordinates) {
      return coordinates.map((arrItem) => {
        let yPos;
        let letters = this.getLetter(arrItem);
        let num = this.getNumber(arrItem);
        num = num.join("");
        let lettersToNum = letters[0].split("");

        if (lettersToNum.length === 2) {
          yPos = this.symbolsMap[lettersToNum[0]] * 26 + this.symbolsMap[lettersToNum[1]];
        } else {
          yPos = this.symbolsMap[lettersToNum[0]];
        }

        return {y: yPos, x: +num};
      });
    },
    normalizeMergedSegments(arr) {
      return arr.map((item) => {
        item.positionId = item.coordinates;
        let coordinatesNumbers = this.getCoordinatesNumbers(item.coordinates);
        let x = coordinatesNumbers.reduce((previousValue, currentValue) => {
          return previousValue + currentValue.x;
        }, 0);
        let y = coordinatesNumbers.reduce((previousValue, currentValue) => {
          return previousValue + currentValue.y;
        }, 0);

        item.coordinates = {
          //center of merged segment
          x: x / coordinatesNumbers.length,
          y: y / coordinatesNumbers.length,
        };

        return item;
      });
    },
  },
};
