import {Container} from "@pixi/display";
import {Graphics} from "@pixi/graphics";
import * as PIXI from "pixi.js";
import SEGMENTS from "@/constants/segments";
import {cloneDeep} from "lodash";
import {Sprite} from "@pixi/sprite";

export default {
  methods: {
    drawGameMap() {
      //initiate app
      const canvas = document.getElementById("game-world-map");
      const headerHeight = document.querySelector("header.header").offsetHeight;
      const app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight - headerHeight,
        antialias: true,
        backgroundAlpha: 0,
        view: canvas,
      });
      // basic dimensions
      const cordFactor = this.cordFactor;
      const halfCordFactor = cordFactor / 2;
      // basic colors
      const baseColor = this.baseSegmentColor;
      const dangerColor = "0xff1a00";
      //map
      const mapContainer = new Container();

      const blurSegment = (segment) => {
        segment.alpha = 0.2;
        segment.interactive = false;
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
        };
        container.toggleActive = true;
        container.interactive = true;
        container.buttonMode = true;
        container.x = x;
        container.y = y;
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

      const handleSegmentClick = (container) => {
        this.blockPopup(true);
        this.$nuxt.$emit("segment-click", container.segment);
      };
      let segmentToggler = false;
      const addSegmentPopup = (container, isCheckSegment = false) => {
        //add data to popup on hover
        const segmentHover = (container) => {
          let ownerData = false;
          if (container?.segment.owner != null) {
            ownerData = {id: container?.segment.owner};
          }
          if (container?.segment.positionId != null) {
            let hoverData = {
              city: container.segment.city,
              country: container.segment.country,
              owner: ownerData,
              cordFactor: cordFactor,
              halfCordFactor: halfCordFactor,
              scaleX: this.scaleX,
              scaleY: this.scaleY,
              mapX: this.mapX,
              mapY: this.mapY,
            };
            if (this.winnerLargeImage != null) {
              hoverData.container.segment.img = this.winnerLargeImage;
            }
            if (this.gameInfo.winnerWallet != null) {
              hoverData.container.segment.owner = {id: this.gameInfo.winnerWallet};
            }
            this.$nuxt.$emit("segment-hover", hoverData, container);
          }
        };
        const segmentUnHover = (item) => {
          this.$nuxt.$emit("segment-unhover", item.id);
        };

        if (isCheckSegment) {
          //lock segment on click "check segment" button
          (async () => {
            await segmentHover(container, segmentToggler);
            this.blockPopup(true);
          })();
        } else {
          container.on("mouseover", () => segmentHover(container));
          container.on("mouseout", () => segmentUnHover(container?.segment));
        }
      };

      const drawSegment = (item) => {
        let x = item.coordinates.x * cordFactor;
        let y = item.coordinates.y * cordFactor;
        item.type = "segments";
        const container = createSegmentContainer(x, y, item);
        if (container.segment.city != null) {
          container.segment.city = container.segment.city.toLowerCase();
        }
        let baseSegment = createBaseSegment(container);
        baseSegment.beginFill(baseColor);
        drawSegmentCircle(container, baseSegment);
        container.on("pointertap", () => handleSegmentClick(container));
        addSegmentPopup(container);
        mapContainer.addChild(container);
      };
      //create base map without state
      SEGMENTS.forEach((item) => {
        drawSegment(item);
      });
      // map update cycle
      app.ticker.add(() => {
        updateMapCondition();
        if (this.isUpdatedWinnerImage) {
          updateWinnerImage();
          this.isUpdatedWinnerImage = false;
        }
        if (this.isLoadMapState) {
          loadMapState();
          this.isLoadMapState = false;
          this.setGameMapLoading(false);
        }
        if (this.isNewGameOwnerAdded) {
          updateOwner();
          this.isNewGameOwnerAdded = false;
        }
        if (this.isNewSegmentAttacked) {
          updateSegmentAttack();
          this.isNewSegmentAttacked = false;
          this.newAttackedSegment = {};
        }
        if (this.isNewSegmentFended) {
          updateSegmentFend();
          this.isNewSegmentFended = false;
          this.newFendedSegment = {};
        }
        if (this.isUserGameSegmentsVisibleUpdated) {
          this.isMarkedUserGameSegments ? markGameUserSegments() : cancelBlurMap();
          this.isUserGameSegmentsVisibleUpdated = false;
        }
        if (this.showSegmentPopupUpdated) {
          showSegmentPopup();
          this.showSegmentPopupUpdated = false;
        }
        if (this.isDestroyMap) {
          app.destroy(true);
          this.isDestroyMap = false;
        }
      });

      //-------UPDATE-FUNCTIONS------
      const configureSpriteWidth = (container, sprite) => {
        if (container.segment.city == null) {
          sprite.width = this.spriteWidth * this.segmentWidthFactor;
          sprite.height = this.spriteHeight * this.segmentWidthFactor;
        } else {
          sprite.width = cordFactor * 2;
          sprite.height = cordFactor * 2;
        }
      };

      const removeSegmentGraphics = (container) => {
        container.children.forEach((item) => {
          if (item?.isBaseSegment == null) {
            return;
          }
          container.removeChild(item);
        });
      };

      const addSegmentSprite = (container, winnerTexture) => {
        const sprite = new Sprite(winnerTexture);
        if (sprite != null) {
          removeSegmentGraphics(container);
        }
        configureSpriteWidth(container, sprite);
        sprite.anchor.set(0.5, 0.5);
        sprite.x = 0;
        sprite.y = 0;
        container.addChild(sprite);
      };
      const updateWinnerImage = () => {
        const winnerTexture = PIXI.Texture.from(this.winnerImage);
        mapContainer.children.forEach((container) => {
          if (container?.segment == null) {
            return;
          }
          container.segment.type = "winner";
          addSegmentSprite(container, winnerTexture);
        });
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
          const userGameSegment = this.userGameSegments.find((userGameSegment) => container?.segment?.id == userGameSegment.id);
          if (userGameSegment != null) {
            return;
          }
          blurSegment(container);
        });
      };

      const showSegmentPopup = () => {
        const id = this.checkId;
        const container = mapContainer.children.find((container) => container?.segment.id === id);
        addSegmentPopup(container, true);
      };

      const markSegmentAsAttacked = (container) => {
        let attackMark = createBaseSegment(container);
        attackMark.beginFill(dangerColor);
        attackMark.alpha = 0.9;
        let markWidth = container.width / 4;
        attackMark.drawCircle(0, 0, markWidth);
        attackMark.isAttackMark = true;
      };
      const unmarkSegmentAsAttacked = (container) => {
        const attackMark = container.children.find((child) => child?.isAttackMark);
        container.removeChild(attackMark);
      };
      const selectSegmentColor = (baseSegment, ownedSegmentData) => {
        if (ownedSegmentData.color != null) {
          let color = "0x" + ownedSegmentData.color.slice(1);
          baseSegment.beginFill(color);
        } else {
          baseSegment.beginFill(baseColor);
        }
      };
      const addOwnerData = (container, ownedSegmentData) => {
        container.removeChildren();
        let baseSegment = createBaseSegment(container);
        selectSegmentColor(baseSegment, ownedSegmentData);
        container.segment.attackedBy = ownedSegmentData?.attackedBy;
        container.segment.owner = ownedSegmentData.owner;
        container.segment.attackedTill = ownedSegmentData?.attackedTill;
        drawSegmentCircle(container, baseSegment);
        if (ownedSegmentData?.attackedBy != null) {
          markSegmentAsAttacked(container);
        }
      };
      const loadMapState = () => {
        //adds api state to the map
        let gameMapOwnersState = cloneDeep(this.gameMapOwnersState);
        mapContainer.children.forEach((container) => {
          const ownedSegment = gameMapOwnersState.find((ownerSateItem) => ownerSateItem.id === container?.segment?.id);
          if (ownedSegment?.owner == null) {
            return;
          }
          addOwnerData(container, ownedSegment);
        });
      };

      const createSegmentWithNewOwner = (container, newSegmentOwner) => {
        let baseSegment = createBaseSegment(container);
        let color = "0x" + newSegmentOwner.newColor.slice(1);
        baseSegment.beginFill(color);
        return baseSegment;
      };

      const isLostSegmentInUserSegmentsMode = (container, newSegmentOwner) => {
        if (container.segment.owner === this.address && newSegmentOwner?.newOwner !== this.address && this.isMarkedUserGameSegments) {
          return true;
        }
        return false;
      };

      const configureSegmentByOwner = (container, newSegmentOwner) => {
        if (container.segment.owner && newSegmentOwner?.newOwner === this.address) {
          this.showOwnedByAttackAlert(container.segment.positionId, container.segment.country);
        }
        if (isLostSegmentInUserSegmentsMode(container, newSegmentOwner)) {
          blurSegment(container);
        }
      };

      const updateOwner = () => {
        let newSegmentOwner = cloneDeep(this.newSegmentOwner);
        let container = mapContainer.children.find((container) => newSegmentOwner.id === container?.segment?.id);
        if (container == null) {
          return;
        }
        container.removeChildren();
        let baseSegment = createSegmentWithNewOwner(container, newSegmentOwner);
        configureSegmentByOwner(container, newSegmentOwner);
        container.segment.owner = newSegmentOwner?.newOwner;
        drawSegmentCircle(container, baseSegment);
      };

      const updateSegmentAttack = () => {
        let newAttackedSegment = cloneDeep(this.newAttackedSegment);
        let container = mapContainer.children.find((container) => newAttackedSegment.segmentId === container?.segment?.id);
        if (container == null) {
          return;
        }
        markSegmentAsAttacked(container);
        container.segment.attackedBy = newAttackedSegment?.initiator;
        container.segment.attackedTill = newAttackedSegment?.attackedTill;
      };

      const updateSegmentFend = () => {
        let newFendedSegment = cloneDeep(this.newFendedSegment);
        let container = mapContainer.children.find((container) => newFendedSegment.id === container?.segment?.id);
        if (container == null) {
          return;
        }
        unmarkSegmentAsAttacked(container);
        container.segment.attackedBy = false;
        container.segment.attackedTill = false;
      };

      const updateMapCondition = () => {
        mapContainer.scale.x = this.scaleX;
        mapContainer.scale.y = this.scaleY;
        mapContainer.x = this.mapX;
        mapContainer.y = this.mapY;
      };

      //-------MAP-SETTINGS------

      this.addMapBorder(mapContainer, cordFactor);

      const addDefaultValues = () => {
        this.defaultScaleX = this.scaleX;
        this.defaultScaleY = this.scaleY;
        this.defaultMapX = this.mapX;
        this.defaultMapY = this.mapY;
        this.mapStaticWidth = mapContainer.width;
        this.mapStaticHeight = mapContainer.height;
      };

      const calculateInitialScale = (val) => {
        return 0.85 + val / 10;
      };

      const initDefaultScale = () => {
        const worldContainer = document.getElementById("game-world-map");
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
        const sceneContainer = document.getElementById("game-world-map");
        const sceneWidth = sceneContainer.offsetWidth;
        const sceneHeight = sceneContainer.offsetHeight;

        const partMapOfScreen = (mapContainer.width * this.scaleX) / sceneWidth;
        const leftOfTheScreen = (1 - partMapOfScreen) / 2;
        this.mapX = leftOfTheScreen * sceneWidth;

        const topFactorValue = 1.1;
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
