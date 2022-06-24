import {Sprite} from "@pixi/sprite";
import * as PIXI from "pixi.js";

import hammer from "hammerjs";

//border cut to support mobile browsers
import borderrightTr from "@/assets/images/borderright-tr.png";
import borderrightBr from "@/assets/images/borderright-br.png";
import borderrightBl from "@/assets/images/borderright-bl.png";
import borderrightTl from "@/assets/images/borderright-tl.png";
import borderleftBr from "@/assets/images/borderleft-br.png";
import borderleftBl from "@/assets/images/borderleft-bl.png";
import borderleftTr from "@/assets/images/borderleft-tr.png";
import borderleftTl from "@/assets/images/borderleft-tl.png";

export default {
  data: () => ({
    scaleX: null,
    scaleY: null,
    mapX: 0,
    mapY: 0,
    clientPos: {
      x: null,
      y: null,
    },
    defaultScaleX: 0,
    defaultScaleY: 0,
    defaultMapX: 0,
    defaultMapY: 0,
    zoomStep: 0.05,
    maxZoomValue: 10,
    screenPartSegmentW: 0.0026,
    screenPartSegmentH: 0.0026,
    spriteWidth: innerWidth * 0.0026,
    spriteHeight: innerWidth * 0.0026,
    cordFactor: innerWidth * 0.0026,
    blHalfWidth: null,
    blHalfHeight: null,
    brBaseX: null,
    brBaseY: null,
    brHalfWidth: null,
    brHalfHeight: null,
    mapStaticWidth: null,
    mapStaticHeight: null,
    segmentWidthFactor: 0.9,
    isDestroyMap: false,
  }),
  methods: {
    // --------MAP-EVENTS----
    addEventListeners() {
      //move & scroll map
      this.worldEvents = new hammer(this.$refs.app);
      this.worldEvents.on("panstart", (ev) => this.pointerDown(ev));
      this.worldEvents.on("panmove", (ev) => this.pointerMove(ev));
      this.worldEvents.on("panend", () => this.pointerUp());
      this.worldEvents.on("pinch", (ev) => this.scaleMap(ev));
      this.worldEvents.on("doubletap", (ev) => this.zoomIn(ev));
      this.worldEvents.on("touchmove", (ev) => this.scaleMap(ev));
    },
    removeEventListeners() {
      this.worldEvents.off();
    },

    scaleChange(zoomToggler) {
      this.scaleX *= 1 - this.zoomStep * zoomToggler;
      this.scaleY *= 1 - this.zoomStep * zoomToggler;
    },

    zoomX(event, zoomToggler) {
      let dynamicWidth = this.mapStaticWidth * this.scaleX;
      let mapClientX;
      if (event.center) {
        mapClientX = event.center.x - this.mapX;
      } else {
        mapClientX = event.offsetX - this.mapX;
      }
      let coefficientX = mapClientX / dynamicWidth;
      this.mapX = this.mapX + (((dynamicWidth / 10) * coefficientX) / 2) * zoomToggler;
    },

    zoomY(event, zoomToggler) {
      let dynamicHeight = this.mapStaticHeight * this.scaleY;
      let mapClientY;
      if (event.center) {
        mapClientY = event.center.y - this.mapY;
      } else {
        mapClientY = event.offsetY - this.mapY;
      }
      let coefficientY = mapClientY / dynamicHeight;
      this.mapY = this.mapY + (((dynamicHeight / 10) * coefficientY) / 2) * zoomToggler;
    },

    zoomMap(event, zoomToggler) {
      this.scaleChange(zoomToggler);

      this.zoomX(event, zoomToggler);
      this.zoomY(event, zoomToggler);
    },

    zoomIn(event) {
      if (this.scaleX > this.maxZoomValue || this.scaleY > this.maxZoomValue) {
        return;
      }
      const zoomStep = -5;
      this.zoomMap(event, zoomStep);
    },

    scaleMap(event) {
      let zoomToggler;
      if (event.deltaY < 0 && (this.scaleX > this.maxZoomValue || this.scaleY > this.maxZoomValue)) {
        return;
      }
      event.deltaY < 0 ? (zoomToggler = -1) : (zoomToggler = 1);

      this.zoomMap(event, zoomToggler);
    },

    pointerDown(event) {
      this.clientPos.x = event.center.x - this.mapX;
      this.clientPos.y = event.center.y - this.mapY;
      this.dragging = true;
    },
    pointerUp() {
      this.dragging = false;
    },

    pointerMove(event) {
      if (this.dragging) {
        this.mapX = event.center.x - this.clientPos.x;
        this.mapY = event.center.y - this.clientPos.y;
      }
    },
    resetMap() {
      this.scaleX = this.defaultScaleX;
      this.scaleY = this.defaultScaleY;
      this.mapX = this.defaultMapX;
      this.mapY = this.defaultMapY;
    },

    // -----BORDER-CONFIG-------
    addBorderLeft(mapContainer, cordFactor) {
      this.blHalfWidth = cordFactor * 50.9125;
      this.blHalfHeight = cordFactor * 69;

      this.addBorderLeftPart(mapContainer, borderleftTl);
      this.addBorderLeftPart(mapContainer, borderleftTr, this.blHalfWidth);
      this.addBorderLeftPart(mapContainer, borderleftBl, 0, this.blHalfHeight);
      this.addBorderLeftPart(mapContainer, borderleftBr, this.blHalfWidth, this.blHalfHeight);
    },

    addBorderLeftPart(mapContainer, texture, x = 0, y = 0) {
      const borderPartTexture = PIXI.Texture.from(texture);
      const borderPart = new Sprite(borderPartTexture);
      borderPart.width = this.blHalfWidth;
      borderPart.height = this.blHalfHeight;
      borderPart.x = x;
      borderPart.y = y;
      mapContainer.addChild(borderPart);
    },

    addBorderRight(mapContainer, cordFactor) {
      this.brBaseX = cordFactor * 120.4;
      this.brBaseY = cordFactor * 0.1;
      this.brHalfWidth = cordFactor * 68.775;
      this.brHalfHeight = cordFactor * 68.925;

      this.addBorderRightPart(mapContainer, borderrightTl);
      this.addBorderRightPart(mapContainer, borderrightTr, this.brHalfWidth);
      this.addBorderRightPart(mapContainer, borderrightBl, 0, this.brHalfHeight);
      this.addBorderRightPart(mapContainer, borderrightBr, this.brHalfWidth, this.brHalfHeight);
    },

    addBorderRightPart(mapContainer, texture, x = 0, y = 0) {
      const borderPartTexture = PIXI.Texture.from(texture);
      const borderPart = new Sprite(borderPartTexture);
      borderPart.width = this.brHalfWidth;
      borderPart.height = this.brHalfHeight;
      borderPart.x = this.brBaseX + x;
      borderPart.y = this.brBaseY + y;

      mapContainer.addChild(borderPart);
    },

    addMapBorder(mapContainer, cordFactor) {
      this.addBorderLeft(mapContainer, cordFactor);
      this.addBorderRight(mapContainer, cordFactor);
    },
  },
};
