import {Container} from "@pixi/display";
import {Graphics} from "@pixi/graphics";
import "@pixi/events";
import * as PIXI from "pixi.js";

import COLORS from "@/constants/colors";
import SEGMENTS from "@/constants/segments";

export default {
  methods: {
    drawWoldMap() {
      //initiate app
      const canvas = document.getElementById("main-world-map");

      const app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        antialias: true,
        backgroundAlpha: 0,
        view: canvas,
      });
      // basic dimensions
      const cordFactor = this.cordFactor;
      const halfCordFactor = cordFactor / 2;
      const mergedSegmentPadding = halfCordFactor / 9;
      const activeSegmentBorderWidth = halfCordFactor / 3.5;
      // basic colors
      const baseColor = "0xfffffd";
      const ownedColor = "0xd94efc";
      const activeColor = "0x000000";
      const successColor = "0x1ad94d";
      //map
      const mapContainer = new Container();

      this.addMapBorder(mapContainer, cordFactor);

      const unLockSegment = (segment) => {
        segment.alpha = 1;
        segment.interactive = true;
      };

      const lockSegment = (segment) => {
        segment.alpha = 0;
        segment.interactive = false;
      };

      const blurSegment = (segment) => {
        segment.alpha = 0.2;
        segment.interactive = false;
      };

      const segmentClick = (container) => {
        if (container.segment.positionId == null) {
          return;
        }
        if (container.segment.city != null) {
          return;
        }
        if (container.toggleActive === true) {
          drawActiveSegment(container);
        } else if (container.toggleActive === false) {
          removeActiveSegment(container);
        }
        this.$nuxt.$emit("segment-click", container.segment);
      };

      const drawActiveSegment = (container) => {
        const activeSegment = new Graphics();
        activeSegment.beginFill(activeColor);
        activeSegment.lineStyle(activeSegmentBorderWidth, baseColor, 1, 0);
        if (container.isMergedSegment === true) {
          activeSegment.drawRoundedRect(-container.width / 2, -container.height / 2, container.width, container.height, halfCordFactor);
        } else {
          activeSegment.drawCircle(0, 0, halfCordFactor);
        }
        activeSegment.isActive = true;

        container.addChild(activeSegment);
        container.toggleActive = !container.toggleActive;
      };
      const removeActiveSegment = (container, dontToggle) => {
        container.children.forEach((child, index) => {
          if (child.isActive == null) {
            return;
          }
          container.removeChildAt(index);
        });
        if (!dontToggle) {
          container.toggleActive = !container.toggleActive;
        } else {
          container.toggleActive = true;
        }
      };

      // --------------DROW-MAP-SEGMENTS-------------

      const createSegmentSprite = (image) => {
        const textureFromServer = PIXI.Texture.from(image);
        const sprite = new PIXI.Sprite(textureFromServer);
        sprite.width = this.spriteWidth * this.segmentWidthFactor;
        sprite.height = this.spriteHeight * this.segmentWidthFactor;
        sprite.anchor.set(0.5, 0.5);
        sprite.x = 0;
        sprite.y = 0;
        return sprite;
      };

      const createSegmentContainer = (x, y, item) => {
        let container = new Container();
        container.segment = {...item};
        container.segment.country = container.segment.country.toLowerCase();
        container.segment.continent = container.segment.continent.toLowerCase();
        container.toggleActive = true;
        container.interactive = true;
        container.buttonMode = true;
        container.x = x;
        container.y = y;
        return container;
      };

      const createBaseSegment = (container) => {
        const baseSegment = new Graphics();
        container.addChild(baseSegment);
        return baseSegment;
      };
      const selectBaseSegmentFill = (item, baseSegment) => {
        if (item.owner != null) {
          baseSegment.beginFill(ownedColor);
        } else {
          baseSegment.beginFill(baseColor);
        }
        if (item.city != null) {
          baseSegment.drawCircle(0, 0, cordFactor);
        } else {
          baseSegment.drawCircle(0, 0, halfCordFactor * this.segmentWidthFactor);
        }
      };

      const selectBaseSegment = (item, container, baseSegment) => {
        if (item.owner == null) {
          container.on("pointertap", () => segmentClick(container));
        }
        if (item.img == null) {
          selectBaseSegmentFill(item, baseSegment);
        }
        if (item.isHiddenSegment != null) {
          container.isHiddenSegment = true;
          lockSegment(container);
        }
      };
      const drawSegment = (item) => {
        let x = item.coordinates.x * cordFactor;
        let y = item.coordinates.y * cordFactor;
        item.type = "segments";

        //add data to popup on hover
        const segmentHover = () => {
          if (item.positionId) {
            this.$nuxt.$emit(
              "segment-hover",
              {
                coordinates: container.segment.coordinates,
                cordFactor: cordFactor,
                halfCordFactor: halfCordFactor,
                country: item.country,
                city: item.city,
                scaleX: this.scaleX,
                scaleY: this.scaleY,
                mapX: this.mapX,
                mapY: this.mapY,
              },
              container
            );
          }
        };
        const segmentUnHover = () => {
          this.$nuxt.$emit("segment-unhover", item.id);
        };

        const container = createSegmentContainer(x, y, item);
        container.on("mouseover", segmentHover);
        container.on("mouseout", segmentUnHover);

        if (container.segment.city) {
          container.segment.city = container.segment.city.toLowerCase();
        }
        let baseSegment;

        // add image to segment
        if (item.img != null && item.city == null) {
          const sprite = createSegmentSprite(`${process.env.SERVER_URL}/files/segments/images-mini/${item.img}`);
          container.addChild(sprite);
        }

        if (item.img == null) {
          baseSegment = createBaseSegment(container);
        }
        selectBaseSegment(item, container, baseSegment);

        if (item.owner != null || item.img != null || item.city != null) {
          container.on("pointertap", () => this.blockPopup(true));
        }

        mapContainer.addChild(container);
      };
      //drawing common segments
      for (let item of this.worldMap) {
        drawSegment(item);
      }

      // --------------DRAW-MAP-MERGED-SEGMENTS-------------

      const createMergedSprite = (width, height, image) => {
        const textureFromServer = PIXI.Texture.from(image);
        const sprite = new PIXI.Sprite(textureFromServer);
        sprite.width = width;
        sprite.height = height;
        sprite.anchor.set(0.5, 0.5);
        return sprite;
      };
      const createMergedRect = (width, height) => {
        const rect = new Graphics();
        rect.beginFill(ownedColor);
        rect.drawRoundedRect(-width / 2, -height / 2, width, height, halfCordFactor);
        rect.isRect = true;
        return rect;
      };

      const createMergedContainer = (x, y, item) => {
        const container = new Container();
        container.isMergedSegment = true;
        container.interactive = true;
        container.buttonMode = true;
        container.segment = {...item};
        container.segment.country = container.segment.country.toLowerCase();
        container.segment.continent = container.segment.continent.toLowerCase();
        container.isHiddenSegment = false;
        container.x = x;
        container.y = y;
        container.toggleActive = true;
        return container;
      };

      const drawMergedSegment = (arr, isNewMerge) => {
        for (let item of this.worldMap) {
          let mergedSegmentId;
          let imageName = false;
          let image;
          let width;
          let height;
          let x;
          let y;
          let positionId;
          // search merged segments params
          for (let customImageItem of arr) {
            if (item.positionId == customImageItem.positionId[0] || item.positionId[0] == customImageItem.positionId[0]) {
              mergedSegmentId = customImageItem.id;
              positionId = customImageItem.positionId;
              imageName = customImageItem.image;
              image = `${process.env.SERVER_URL}/files/merged-segments/images-mini/${customImageItem.imageMini}`;
              width = customImageItem.width - mergedSegmentPadding;
              height = customImageItem.height - mergedSegmentPadding;
              x = customImageItem.coordinates.x * cordFactor;
              y = customImageItem.coordinates.y * cordFactor;
            }
          }

          if (imageName === false) {
            continue;
          }
          item.imageName = imageName;
          item.isHiddenSegment = false;
          item.mergedSegmentId = mergedSegmentId;

          // add merged segment data in popup on hover
          const segmentHover = () => {
            if (item.positionId) {
              this.$nuxt.$emit(
                "segment-hover",
                {
                  coordinates: {x: x / cordFactor, y: y / cordFactor},
                  cordFactor: cordFactor,
                  halfCordFactor: halfCordFactor,
                  country: item.country,
                  city: item.city,
                  scaleX: this.scaleX,
                  scaleY: this.scaleY,
                  mapX: this.mapX,
                  mapY: this.mapY,
                },
                container
              );
            }
          };
          const segmentUnHover = () => {
            this.$nuxt.$emit("segment-unhover", item.id);
          };
          const container = createMergedContainer(x, y, item);
          container.segment.positionId = positionId;
          container.segment.type = "merger";
          container.segment.img = image;
          container.isHiddenSegment = false;
          const rect = createMergedRect(width, height);
          container.addChild(rect);
          container.on("mouseover", segmentHover);
          container.on("mouseout", segmentUnHover);

          if (isNewMerge == null) {
            container.on("pointertap", () => this.blockPopup(true));
          } else {
            container.on("pointertap", () => segmentClick(container));
          }

          mapContainer.addChild(container);

          if (imageName == null) {
            continue;
          }
          const sprite = createMergedSprite(width, height, image);
          container.addChild(sprite);
          sprite.mask = rect;
        }
      };

      drawMergedSegment(this.formattedMergedSegments);

      //-----------LOAD COUNTRY MODE-------------

      let countriesCM = [];
      let normalizedCountriesCM = [];

      const findCountries = () => {
        mapContainer.children.forEach((item) => {
          if (item.segment == null) {
            return;
          }
          if (item.segment.country == null) {
            return;
          }
          countriesCM.push(item.segment.country);
        });
      };

      const normalizeCountries = () => {
        for (let str of countriesCM) {
          if (!normalizedCountriesCM.includes(str)) {
            normalizedCountriesCM.push(str);
          }
        }
      };

      const initCountries = () => {
        findCountries();
        normalizeCountries();
      };

      initCountries();

      const drawLoadSegment = (item, baseSegment) => {
        if (item.segment.city) {
          baseSegment.drawCircle(0, 0, cordFactor);
          return;
        }
        baseSegment.drawCircle(0, 0, halfCordFactor * this.segmentWidthFactor);
      };

      const addCountryModeSegments = (item) => {
        const baseSegment = new Graphics();
        let countryIndex = normalizedCountriesCM.findIndex((child) => child.toLowerCase() == item.segment.country.toLowerCase());
        baseSegment.beginFill(COLORS[countryIndex + 1]);
        baseSegment.countryMode = true;
        baseSegment.alpha = 0;
        drawLoadSegment(item, baseSegment);
        item.addChild(baseSegment);
      };

      mapContainer.children.forEach((item) => {
        if (item.segment == null) {
          return;
        }
        addCountryModeSegments(item);
      });

      //-------MAP-UPDATES------

      //search data
      let continents = [];
      let countries = [];
      let cities = [];
      let normalizedCountries = [];
      let normalizedContinents = [];
      // map update cycle
      app.ticker.add(() => {
        updateMapCondition();
        if (this.isFilter) {
          filterWorldMap();
        }
        if (this.rerenderMap) {
          this.isToggledCountryMode ? showCountryMode() : hideCountryMode();
          this.rerenderMap = false;
        }
        if (this.isToggledUserSegments) {
          this.isUserSegmentsVisible ? showUserSegments() : hideUserSegments();
          this.isToggledUserSegments = false;
        }
        if (this.isToggledValidMerge) {
          this.isValidMerge ? showValidMerge() : hideValidMerge();
          this.isToggledValidMerge = false;
        }
        if (this.isToggledMergedRefresh) {
          drawMergedRefreshedSegment();
          this.isToggledMergedRefresh = false;
        }
        if (this.isToggledUnMergedRefresh) {
          splitSegment();
          this.isToggledUnMergedRefresh = false;
        }
        if (this.isToggledMergedImgRefresh) {
          updateMergedImage();
          this.isToggledMergedImgRefresh = false;
        }
        if (this.isToggledSegmentImgRefresh) {
          updateSegmentImage();
          this.isToggledSegmentImgRefresh = false;
        }
        if (this.isDestroyMap) {
          app.destroy(true);
          this.isDestroyMap = false;
        }
      });

      //-------UPDATE-FUNCTIONS------

      const updateMapCondition = () => {
        mapContainer.scale.x = this.scaleX;
        mapContainer.scale.y = this.scaleY;
        mapContainer.x = this.mapX;
        mapContainer.y = this.mapY;
      };

      const removeUnnecessary = (container) => {
        container.children.forEach((item, index) => {
          if (item.isSprite == null) {
            container.removeChildAt(index);
          }
        });
        container.children.forEach((child, index) => {
          if (child.isActive) {
            container.removeChildAt(index);
          }
        });
      };
      const updateSegmentImage = () => {
        mapContainer.children.forEach((container) => {
          if (container?.isHiddenSegment) {
            return;
          }
          if (container?.segment?.positionId !== this.getSegmentImgRefreshed.positionId) {
            return;
          }
          removeUnnecessary(container);
          const sprite = createSegmentSprite(this.getSegmentImgRefreshed.image, true);
          container.addChild(sprite);
        });
      };

      const updateMergedImage = () => {
        mapContainer.children.forEach((container) => {
          if (container?.isHiddenSegment) {
            return;
          }
          if (container?.segment?.mergedSegmentId !== this.getMergedImgRefreshData.mergedSegmentId) {
            return;
          }
          let width = container.width;
          let height = container.height;
          removeUnnecessary(container);
          const sprite = createMergedSprite(width, height, this.getMergedImgRefreshData.image);
          container.addChild(sprite);
          const rect = container.children.find((child) => child?.isRect === true);
          sprite.mask = rect;
        });
      };

      const hideSegmentsUnderMerge = () => {
        SEGMENTS.forEach((child) => {
          if (this.getMergedRefreshData.coordinates.find((positionId) => child.positionId === positionId) == null) {
            return;
          }
          mapContainer.children.forEach((container) => {
            if (container?.segment?.id === child.id) {
              child.isHiddenSegment = true;
              lockSegment(container);
            }
          });
        });
      };

      const drawMergedRefreshedSegment = () => {
        let mergedData = {...this.getMergedRefreshData};
        this.calculateMergedSegmentSides([mergedData]);
        this.normalizeMergedSegments([mergedData]);
        hideSegmentsUnderMerge();
        drawMergedSegment([mergedData], true);
      };

      const showSplittedSegments = (splittedPositionIds) => {
        mapContainer.children.forEach(async (container) => {
          if (splittedPositionIds.find((positionId) => positionId === container?.segment?.positionId) == null) {
            return;
          }
          container.isHiddenSegment = false;
          container.segment.isHiddenSegment = false;
          removeUnnecessary(container);
          unLockSegment(container);
          const segment = await this.$axios.$get(`${process.env.SERVER_URL}/segments/${container.segment.positionId}`);
          const sprite = createSegmentSprite(segment.imageMini, true);
          container.addChild(sprite);
          container.removeListener("pointertap");
          container.on("pointertap", () => segmentClick(container));
        });
      };

      const splitSegment = () => {
        mapContainer.children.forEach((container, index) => {
          let splittedPositionIds;
          if (container?.segment?.mergedSegmentId === this.unmergeSegment) {
            mapContainer.removeChildAt(index);
            splittedPositionIds = container.segment.positionId;
          }
          if (splittedPositionIds == null) {
            return;
          }
          showSplittedSegments(splittedPositionIds);
        });
      };
      const showValidMerge = () => {
        hideValidMerge();
        mapContainer.children.forEach((child) => {
          // segmentsToMerge
          let userSegment = null;
          if (Array.isArray(this.segmentsToMerge)) {
            userSegment = this.segmentsToMerge.find((segmentToMerge) => child?.segment?.id == segmentToMerge.id);
          }
          if (userSegment == null) {
            return;
          }
          const highlightSegment = new Graphics();
          highlightSegment.beginFill(successColor);
          highlightSegment.lineStyle(activeSegmentBorderWidth, baseColor, 1, 0);
          highlightSegment.drawCircle(0, 0, halfCordFactor);
          highlightSegment.isHighLight = true;
          child.addChild(highlightSegment);
        });
      };

      const hideValidMerge = () => {
        mapContainer.children.forEach((child) => {
          let userSegment = this.userSegments.find((userSegment) => child?.segment?.id == userSegment.id);
          if (userSegment == null) {
            return;
          }
          child.children.forEach((userSegmentChild, index) => {
            if (userSegmentChild.isHighLight == null) {
              return;
            }
            child.removeChildAt(index);
          });
        });
      };

      const unlockUserSegment = (child) => {
        unLockSegment(child);
        child.removeListener("pointertap");
        child.on("pointertap", () => segmentClick(child));
      };

      const showUserSegments = () => {
        mapContainer.children.forEach((child) => {
          blurSegment(child);
          let userSegment = this.userSegments.find((userSegment) => child?.segment?.id == userSegment.id);
          if (userSegment == null) {
            return;
          }
          if (this.isToggledCountryMode === false) {
            child.isHiddenSegment == true ? lockSegment(child) : unlockUserSegment(child);
          } else {
            unlockUserSegment(child);
          }
        });
      };

      const hideUserSegments = () => {
        mapContainer.children.forEach((child) => {
          if (!this.isToggledCountryMode) {
            if (!child.isHiddenSegment) {
              unLockSegment(child);
            }
          } else {
            unLockSegment(child);
          }
          let userSegment = this.userSegments.find((userSegment) => child?.segment?.id == userSegment.id);
          if (userSegment == null) {
            return;
          }
          if (child.toggleActive === false) {
            removeActiveSegment(child);
          }
          child.removeListener("pointertap");
          child.on("pointertap", () => this.blockPopup(true));
        });
      };

      const showCountryMode = () => {
        mapContainer.children.forEach((item) => {
          unLockSegment(item);
          item.children.forEach((child) => {
            lockSegment(child);
            if (child.isActive || (child.countryMode && !child.isMergedSegment)) {
              if (!(item.segment.type == "merger" && !this.isUserSegmentsVisible)) {
                unLockSegment(child);
              }
            }
          });
        });
      };

      const hideCountryMode = () => {
        mapContainer.children.forEach((item) => {
          item.children.forEach((child) => {
            lockSegment(child);

            if (!child.countryMode || child.isActive) {
              unLockSegment(child);
            }
          });
          if (item?.segment?.isHiddenSegment) {
            lockSegment(item);
          }
          if (item?.segment?.type == "merger" && !this.isUserSegmentsVisible) {
            unLockSegment(item);
          }
        });
      };

      const unlockFilteredSegment = (child) => {
        if (this.isToggledCountryMode === false) {
          child.isHiddenSegment ? lockSegment(child) : unLockSegment(child);
          return;
        }
        unLockSegment(child);
      };

      const searchMatches = (child, filterValue) => {
        let searchResult = `${child.segment.country} ${child.segment.positionId} ${child.segment.city} ${child.segment.continent}`.indexOf(
          filterValue
        );

        if (searchResult !== -1) {
          if (!this.isInitData) {
            setSearchData(child);
          }
          unlockFilteredSegment(child);
        }
      };
      const filterWorldMapByValue = (filterValue) => {
        mapContainer.children.forEach((child) => {
          blurSegment(child);
          if (child.segment == null) {
            if (!filterValue) {
              child.alpha = 1;
            }
            return;
          }
          searchMatches(child, filterValue);
        });
      };

      const setSearchData = (mapChild) => {
        if (mapChild.segment.country.indexOf(this.filterValue) !== -1) {
          countries.push(mapChild.segment.country);
        }
        if (mapChild.segment.continent.indexOf(this.filterValue) !== -1) {
          continents.push(mapChild.segment.continent);
        }
        if (mapChild.segment.city) {
          if (mapChild.segment.city.indexOf(this.filterValue) !== -1) {
            cities.push(mapChild.segment.city);
          }
        }
      };
      const setNormalizedSearchData = () => {
        for (let str of countries) {
          if (!normalizedCountries.includes(str)) {
            normalizedCountries.push(str);
          }
        }
        for (let str of continents) {
          if (!normalizedContinents.includes(str)) {
            normalizedContinents.push(str);
          }
        }
      };

      const filterWorldMap = () => {
        filterWorldMapByValue(this.filterValue);

        if (!this.isInitData) {
          setNormalizedSearchData();
          //add matches in search result
          this.setData({countries: normalizedCountries.sort(), bigCities: cities.sort(), continents: normalizedContinents.sort()});
        }
        this.setIsInitData(true);
        this.disableBlurMap();
      };

      //-------ADD-MAP-------
      const addDefaultValues = () => {
        this.defaultScaleX = this.scaleX;
        this.defaultScaleY = this.scaleY;
        this.defaultMapX = this.mapX;
        this.defaultMapY = this.mapY;
        this.mapStaticWidth = mapContainer.width;
        this.mapStaticHeight = mapContainer.height;
      };
      const calculateScale = (val) => {
        return 0.85 + val / 10;
      };
      const initDefaultScale = () => {
        const worldContainer = document.getElementById("map-container");
        const valueToScale = worldContainer.offsetHeight * 0.9;
        for (let i = 0; mapContainer.height * this.scaleY < valueToScale; i++) {
          this.scaleX = calculateScale(i);
          this.scaleY = calculateScale(i);
        }
      };
      const initMapPosition = () => {
        const sceneContainer = document.getElementById("main-map-container");
        const sceneWidth = sceneContainer.offsetWidth;
        const sceneHeight = sceneContainer.offsetHeight;
        const partMapOfScreen = (mapContainer.width * this.scaleX) / sceneWidth;
        const leftOfTheScreen = (1 - partMapOfScreen) / 2;
        this.mapX = leftOfTheScreen * sceneWidth;
        const partMapOfScreenHeight = (mapContainer.height * this.scaleY) / sceneHeight;
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
