export default {
  data: () => ({
    isPopupVisible: false,
  }),

  methods: {
    showPopup(data, container) {
      //add segment data
      const type = container.segment.type;
      const id = type === "merger" ? container.segment.mergedSegmentId : container.segment.positionId;
      const customImage = container.segment.img;
      const isSold = Boolean(container.segment.owner);
      this.id = id;
      this.coordinates = data.coordinates || container?.segment.coordinates;

      this.cordFactor = data.cordFactor;
      this.halfCordFactor = data.halfCordFactor;
      this.scaleX = data.scaleX;
      this.scaleY = data.scaleY;
      this.mapX = data.mapX;
      this.mapY = data.mapY;
      this.segmentHeight = container.height;
      this.segmentWidth = container.width;

      //show popup with delay
      this.popupTimeout = setTimeout(async () => {
        this.attackedBy = container.segment.attackedBy;
        this.isSegmentWithCustomImage = Boolean(customImage);

        this.owner = container.segment.owner;
        this.segmentType = type;

        this.isPopupVisible = true;

        let imgName = data.country;
        if (data.city && this.isGamePage === false) {
          imgName = data.city;
        }

        if (isSold) {
          try {
            this.segmentData = await this.$axios.$get(
              `${process.env.SERVER_URL}/${type === "merger" ? "segments-merged" : "segments"}/${id}`
            );
          } catch (error) {
            console.error(error);
          }
        }

        if (customImage && this.countryMode === false) {
          switch (type) {
            case "winner":
              this.img = customImage;
              break;
            case "merger":
              this.img = container.segment.imageName
                ? process.env.SERVER_URL + `/files/merged-segments/images/${container.segment.imageName}`
                : null;
              break;
            default:
              this.img = process.env.SERVER_URL + `/files/segments/images/${container.segment.imageName}`;
          }
          return false;
        } else {
          if (type === "merger") {
            this.img = null;
          } else {
            this.img = `${process.env.SERVER_URL}/images/${imgName}.jpg`;
          }
        }
        setTimeout(() => {
          this.movePopup(this.id);
        }, 400);
      }, 300);
    },

    /**
     * Moves popup to the target id
     * @param {string} id Id of an element
     */
    movePopup(id) {
      this.id = id;
      const isSmallScreen = window.matchMedia("(max-width: 992px)").matches;
      if (isSmallScreen) {
        return;
      }
      if (!this.$refs.triangle) return false;
      let coords = {
        left: this.coordinates.x * this.cordFactor * this.scaleX + this.mapX,
        top: this.coordinates.y * this.cordFactor * this.scaleY + this.mapY,
      };
      const popupHeight = this.$el.offsetHeight;
      const arrow = this.$refs.triangle;
      const arrowHeight = arrow.offsetHeight;
      const arrowWidth = arrow.offsetWidth;
      let containerHeight;
      const headerHeight = document.querySelector("header.header").offsetHeight;
      containerHeight = document.querySelector(".map-container")?.offsetHeight;
      if (!containerHeight) {
        containerHeight = document.querySelector(".game-world-map").offsetHeight;
      }
      const yOffset = () => {
        if (coords.top < popupHeight / 2 + headerHeight) {
          arrow.style.top = coords.top + "px";
          return `-${arrowHeight / 2}px`;
        } else if (containerHeight - popupHeight / 2 < coords.top) {
          arrow.style.top = popupHeight - (containerHeight - coords.top + arrowHeight) + "px";
          return containerHeight - popupHeight + arrowHeight / 2 + "px";
        } else {
          arrow.style.top = popupHeight / 2 - arrowWidth + "px";
          return coords.top - popupHeight / 2 + this.segmentHeight / 2 + "px";
        }
      };

      const xOffset = () => {
        if (coords.left > window.innerWidth / 2) {
          arrow.style.right = "";
          arrow.style.transform = "";
          return coords.left - arrowWidth - this.$el.offsetWidth - (this.segmentWidth / 2) * this.scaleX + "px";
        } else {
          arrow.style.right = "100%";
          arrow.style.transform = "scale(-1)";
          return coords.left + arrowWidth + (this.segmentWidth / 2) * this.scaleX + "px";
        }
      };

      if (!this.isPopupBlock) {
        this.$el.style.left = xOffset();
        this.$el.style.top = yOffset();
      }
    },
  },
  mounted() {
    this.$nuxt.$on("close-other-sidebars", () => {
      this.isPopupVisible = false;
    });
    this.$nuxt.$on("call-side-card", () => {
      this.isPopupVisible = false;
    });
  },

  beforeDestroy() {
    this.$nuxt.$off("close-other-sidebars");
  },
};
