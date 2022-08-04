import {Container} from "@pixi/display";
import {Graphics} from "@pixi/graphics";
import * as PIXI from "pixi.js";

export default {
  methods: {
    drawEraMap() {
      //initiate app
      const canvas = document.getElementById("era-map");
      const eraMapContainer = document.getElementById("era-map-container");
      const app = new PIXI.Application({
        width: eraMapContainer.offsetWidth,
        height: eraMapContainer.offsetHeight,
        antialias: true,
        backgroundAlpha: 0,
        view: canvas,
      });
      // basic dimensions
      const cordFactor = this.cordFactor;
      const halfCordFactor = cordFactor / 2;
      // basic colors
      const baseColor = this.baseSegmentColor;
      //map
      const mapContainer = new Container();

      const blurSegment = (segment) => {
        segment.alpha = 0.2;
        segment.interactive = false;
      };

      const segmentClick = (container) => {
        if (container.segment.walletAddress == null) {
          this.showFreeSegmentNotification();
          return;
        }
        this.selectedSegment = container.segment;
        this.showSegmentPopup();
      };

      const createSegmentContainer = (x, y, item) => {
        let container = new Container();
        container.segment = {
          id: item.id,
          coordinates: item.coordinates,
          positionId: item.positionId,
          city: item.city,
          country: item.country,
          continent: item.continent,
          walletAddress: item.walletAddress,
        };
        container.toggleActive = true;
        container.interactive = true;
        container.buttonMode = true;
        container.x = x;
        container.y = y;
        container.on("pointertap", () => segmentClick(container));
        return container;
      };

      const createBaseSegment = (container) => {
        const baseSegment = new Graphics();
        baseSegment.interactive = true;
        baseSegment.buttonMode = true;
        baseSegment.isBaseSegment = true;
        container.addChild(baseSegment);
        return baseSegment;
      };

      const drawSegmentCircle = (container, baseSegment) => {
        if (container.segment.city) {
          baseSegment.drawCircle(0, 0, cordFactor);
          return;
        }
        baseSegment.drawCircle(0, 0, halfCordFactor * this.segmentWidthFactor);
      };

      const drawSegment = (item) => {
        let x = item.coordinates.x * cordFactor;
        let y = item.coordinates.y * cordFactor;
        const container = createSegmentContainer(x, y, item);
        if (container.segment.city != null) {
          container.segment.city = container.segment.city.toLowerCase();
        }
        let baseSegment = createBaseSegment(container);
        if (item.color == null) {
          baseSegment.beginFill(baseColor);
        } else {
          baseSegment.beginFill(item.color);
        }

        drawSegmentCircle(container, baseSegment);
        mapContainer.addChild(container);
      };
      //create base map without state
      this.map.forEach((item) => {
        drawSegment(item);
      });
      // map update cycle
      app.ticker.add(() => {
        //TODO: try to check for change
        updateMapCondition();
        if (this.isUserGameSegmentsVisibleUpdated) {
          this.isMarkedUserGameSegments ? markGameUserSegments() : cancelBlurMap();
          this.isUserGameSegmentsVisibleUpdated = false;
        }
        if (this.isDestroyMap) {
          mapContainer.children.forEach((child) => {
            child.interactive = false;
          });
          app.destroy(true, {children: true});
          this.isDestroyMap = false;
        }
      });

      //-------UPDATE-FUNCTIONS------
      //TODO: Try on other functions. (Dragging ruined scale)
      const updateMapCondition = () => {
        mapContainer.scale.x = this.scaleX;
        mapContainer.scale.y = this.scaleY;
        // if (this.dragging === true) {
        mapContainer.x = this.mapX;
        mapContainer.y = this.mapY;
        // }
      };

      const cancelBlurMap = () => {
        mapContainer.children.forEach((container) => {
          container.alpha = 1;
          if (container.segment == null) {
            return;
          }
          container.interactive = true;
          container.buttonMode = true;
        });
      };
      const markGameUserSegments = () => {
        mapContainer.children.forEach((container) => {
          const userGameSegment = this.userGameSegments.find(
            (userGameSegment) => container?.segment?.positionId === userGameSegment.coordinates
          );
          if (userGameSegment != null) {
            return;
          }
          blurSegment(container);
        });
      };
      //-------MAP-SETTINGS------

      this.addMapBorder(mapContainer, cordFactor);

      const addDefaultValues = () => {
        this.defaultScaleX = this.scaleX;
        this.defaultScaleY = this.scaleY;
        mapContainer.x = this.mapX;
        mapContainer.y = this.mapY;
        this.mapStaticWidth = mapContainer.width;
        this.mapStaticHeight = mapContainer.height;
      };

      const calculateInitialScale = (val) => {
        let baseScale = 1;
        let scaleIncrease = val / 10;
        let scaleTo = baseScale + scaleIncrease;
        return scaleTo;
      };

      const initDefaultScale = () => {
        const worldContainer = document.getElementById("era-map-container");
        const heightToScale = worldContainer.offsetHeight * 0.8;
        const currentHeight = () => {
          return mapContainer.height * this.scaleY;
        };
        for (let i = 0; currentHeight() < heightToScale; i++) {
          this.scaleX = calculateInitialScale(i);
          this.scaleY = calculateInitialScale(i);
        }
      };
      const initMapPosition = () => {
        const sceneContainer = document.getElementById("era-map-container");
        const sceneWidth = sceneContainer.offsetWidth;
        const sceneHeight = sceneContainer.offsetHeight;

        const partMapOfScreen = (mapContainer.width * this.scaleX) / sceneWidth;
        const leftOfTheScreen = (1 - partMapOfScreen) / 2;
        this.mapX = leftOfTheScreen * sceneWidth;

        const topFactorValue = 1.15;
        const partMapOfScreenHeight = ((mapContainer.height * this.scaleY) / sceneHeight) * topFactorValue;
        const topOfTheScreen = (1 - partMapOfScreenHeight) / 2;
        this.mapY = topOfTheScreen * sceneHeight;
      };
      initDefaultScale();
      initMapPosition();
      addDefaultValues();

      app.stage.addChild(mapContainer);
    },
  },
};
