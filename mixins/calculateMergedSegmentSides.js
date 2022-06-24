export default {
  methods: {
    calculateMergedSegmentSides(arr) {
      for (let child of arr) {
        let width = 1;
        let arr = child.coordinates.map((coordinate) => {
          let num = this.getCoordinateNumber(coordinate);
          return num[0];
        });
        // calculate segment width
        for (let i = 1; i < arr.length; i++) {
          let prev = +arr[i - 1];
          let now = +arr[i] - 1;

          if (now == prev) {
            width++;
          } else {
            break;
          }
        }

        child.width = width * this.spriteWidth;
        // get the height by dividing the area by one of the sides
        child.height = (child.coordinates.length / width) * this.spriteWidth;
      }
    },
    getCoordinateNumber(coordinate) {
      return coordinate.match(/\d+/g);
    },
  },
};
