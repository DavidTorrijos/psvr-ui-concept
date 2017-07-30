require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"VRComponent":[function(require,module,exports){
"\nVRComponent class\n\nproperties\n- front (set: imagePath <string>, get: layer)\n- right\n- back\n- left\n- top\n- bottom\n- heading <number>\n- elevation <number>\n- tilt <number> readonly\n\n- panning <bool>\n- mobilePanning <bool>\n- arrowKeys <bool>\n\n- lookAtLatestProjectedLayer <bool>\n\nmethods\n- projectLayer(layer) # heading and elevation are set as properties on the layer\n- hideEnviroment()\n\nevents\n- onOrientationChange (data {heading, elevation, tilt})\n\n--------------------------------------------------------------------------------\n\nVRLayer class\n\nproperties\n- heading <number> (from 0 up to 360)\n- elevation <number> (from -90 down to 90 up)\n";
var KEYS, KEYSDOWN, SIDES, VRAnchorLayer,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

SIDES = ["north", "front", "east", "right", "south", "back", "west", "left", "top", "bottom"];

KEYS = {
  LeftArrow: 37,
  UpArrow: 38,
  RightArrow: 39,
  DownArrow: 40
};

KEYSDOWN = {
  left: false,
  up: false,
  right: false,
  down: false
};

Events.OrientationDidChange = "orientationdidchange";

VRAnchorLayer = (function(superClass) {
  extend(VRAnchorLayer, superClass);

  function VRAnchorLayer(layer, cubeSide) {
    VRAnchorLayer.__super__.constructor.call(this, void 0);
    this.width = 0;
    this.height = 0;
    this.clip = false;
    this.name = "anchor";
    this.cubeSide = cubeSide;
    this.layer = layer;
    layer.superLayer = this;
    layer.center();
    layer.on("change:orientation", (function(_this) {
      return function(newValue, layer) {
        return _this.updatePosition(layer);
      };
    })(this));
    this.updatePosition(layer);
    layer._context.on("layer:destroy", (function(_this) {
      return function(layer) {
        if (layer === _this.layer) {
          return _this.destroy();
        }
      };
    })(this));
  }

  VRAnchorLayer.prototype.updatePosition = function(layer) {
    var halfCubeSide;
    halfCubeSide = this.cubeSide / 2;
    return this.style["webkitTransform"] = "translateX(" + ((this.cubeSide - this.width) / 2) + "px) translateY(" + ((this.cubeSide - this.height) / 2) + "px) rotateZ(" + layer.heading + "deg) rotateX(" + (90 - layer.elevation) + "deg) translateZ(" + layer.distance + "px) rotateX(180deg)";
  };

  return VRAnchorLayer;

})(Layer);

exports.VRLayer = (function(superClass) {
  extend(VRLayer, superClass);

  function VRLayer(options) {
    if (options == null) {
      options = {};
    }
    options = _.defaults(options, {
      heading: 0,
      elevation: 0
    });
    VRLayer.__super__.constructor.call(this, options);
  }

  VRLayer.define("heading", {
    get: function() {
      return this._heading;
    },
    set: function(value) {
      var rest;
      if (value >= 360) {
        value = value % 360;
      } else if (value < 0) {
        rest = Math.abs(value) % 360;
        value = 360 - rest;
      }
      if (this._heading !== value) {
        this._heading = value;
        this.emit("change:heading", value);
        return this.emit("change:orientation", value);
      }
    }
  });

  VRLayer.define("elevation", {
    get: function() {
      return this._elevation;
    },
    set: function(value) {
      value = Utils.clamp(value, -90, 90);
      if (value !== this._elevation) {
        this._elevation = value;
        this.emit("change:elevation", value);
        return this.emit("change:orientation", value);
      }
    }
  });

  VRLayer.define("distance", {
    get: function() {
      return this._distance;
    },
    set: function(value) {
      if (value !== this._distance) {
        this._distance = value;
        this.emit("change:distance", value);
        return this.emit("change:orientation", value);
      }
    }
  });

  return VRLayer;

})(Layer);

exports.VRComponent = (function(superClass) {
  extend(VRComponent, superClass);

  function VRComponent(options) {
    if (options == null) {
      options = {};
    }
    this.setupPan = bind(this.setupPan, this);
    this._canvasToComponentRatio = bind(this._canvasToComponentRatio, this);
    this.deviceOrientationUpdate = bind(this.deviceOrientationUpdate, this);
    this.createCube = bind(this.createCube, this);
    this.setupDefaultValues = bind(this.setupDefaultValues, this);
    options = _.defaults(options, {
      cubeSide: 3000,
      perspective: 1200,
      lookAtLatestProjectedLayer: false,
      width: Screen.width,
      height: Screen.height,
      arrowKeys: true,
      panning: true,
      mobilePanning: true,
      flat: true,
      clip: true
    });
    VRComponent.__super__.constructor.call(this, options);
    Screen.backgroundColor = "black";
    Screen.perspective = 0;
    this.setupDefaultValues();
    this.degToRad = Math.PI / 180;
    this.backgroundColor = null;
    this.createCube(options.cubeSide);
    this.lookAtLatestProjectedLayer = options.lookAtLatestProjectedLayer;
    this.setupKeys(options.arrowKeys);
    if (options.heading != null) {
      this.heading = options.heading;
    }
    if (options.elevation != null) {
      this.elevation = options.elevation;
    }
    this.setupPan(options.panning);
    this.mobilePanning = options.mobilePanning;
    if (Utils.isMobile()) {
      window.addEventListener("deviceorientation", (function(_this) {
        return function(event) {
          return _this.orientationData = event;
        };
      })(this));
    }
    Framer.Loop.on("update", this.deviceOrientationUpdate);
    Framer.CurrentContext.on("reset", function() {
      return Framer.Loop.off("update", this.deviceOrientationUpdate);
    });
    this.on("change:frame", function() {
      return this.desktopPan(0, 0);
    });
  }

  VRComponent.prototype.setupDefaultValues = function() {
    this._heading = 0;
    this._elevation = 0;
    this._tilt = 0;
    this._headingOffset = 0;
    this._elevationOffset = 0;
    this._deviceHeading = 0;
    return this._deviceElevation = 0;
  };

  VRComponent.prototype.setupKeys = function(enabled) {
    this.arrowKeys = enabled;
    document.addEventListener("keydown", (function(_this) {
      return function(event) {
        switch (event.which) {
          case KEYS.UpArrow:
            KEYSDOWN.up = true;
            return event.preventDefault();
          case KEYS.DownArrow:
            KEYSDOWN.down = true;
            return event.preventDefault();
          case KEYS.LeftArrow:
            KEYSDOWN.left = true;
            return event.preventDefault();
          case KEYS.RightArrow:
            KEYSDOWN.right = true;
            return event.preventDefault();
        }
      };
    })(this));
    document.addEventListener("keyup", (function(_this) {
      return function(event) {
        switch (event.which) {
          case KEYS.UpArrow:
            KEYSDOWN.up = false;
            return event.preventDefault();
          case KEYS.DownArrow:
            KEYSDOWN.down = false;
            return event.preventDefault();
          case KEYS.LeftArrow:
            KEYSDOWN.left = false;
            return event.preventDefault();
          case KEYS.RightArrow:
            KEYSDOWN.right = false;
            return event.preventDefault();
        }
      };
    })(this));
    return window.onblur = function() {
      KEYSDOWN.up = false;
      KEYSDOWN.down = false;
      KEYSDOWN.left = false;
      return KEYSDOWN.right = false;
    };
  };

  VRComponent.define("heading", {
    get: function() {
      var heading, rest;
      heading = this._heading + this._headingOffset;
      if (heading > 360) {
        heading = heading % 360;
      } else if (heading < 0) {
        rest = Math.abs(heading) % 360;
        heading = 360 - rest;
      }
      return heading;
    },
    set: function(value) {
      return this.lookAt(value, this._elevation);
    }
  });

  VRComponent.define("elevation", {
    get: function() {
      return this._elevation;
    },
    set: function(value) {
      value = Utils.clamp(value, -90, 90);
      return this.lookAt(this._heading, value);
    }
  });

  VRComponent.define("tilt", {
    get: function() {
      return this._tilt;
    },
    set: function(value) {
      throw "Tilt is readonly";
    }
  });

  SIDES.map(function(face) {
    return VRComponent.define(face, {
      get: function() {
        return this.layerFromFace(face);
      },
      set: function(value) {
        return this.setImage(face, value);
      }
    });
  });

  VRComponent.prototype.createCube = function(cubeSide) {
    var colors, halfCubeSide, i, key, ref, results, rotationX, rotationY, side, sideIndex, sideNames;
    if (cubeSide == null) {
      cubeSide = this.cubeSide;
    }
    this.cubeSide = cubeSide;
    if ((ref = this.world) != null) {
      ref.destroy();
    }
    this.world = new Layer({
      name: "world",
      superLayer: this,
      width: cubeSide,
      height: cubeSide,
      backgroundColor: null,
      clip: false
    });
    this.world.center();
    this.sides = [];
    halfCubeSide = this.cubeSide / 2;
    colors = ["#866ccc", "#28affa", "#2dd7aa", "#ffc22c", "#7ddd11", "#f95faa"];
    sideNames = ["front", "right", "back", "left", "top", "bottom"];
    for (sideIndex = i = 0; i < 6; sideIndex = ++i) {
      rotationX = 0;
      if (indexOf.call([0, 1, 2, 3], sideIndex) >= 0) {
        rotationX = -90;
      }
      if (sideIndex === 4) {
        rotationX = 180;
      }
      rotationY = 0;
      if (indexOf.call([0, 1, 2, 3], sideIndex) >= 0) {
        rotationY = sideIndex * -90;
      }
      side = new Layer({
        size: cubeSide,
        z: -halfCubeSide,
        originZ: halfCubeSide,
        rotationX: rotationX,
        rotationY: rotationY,
        superLayer: this.world,
        name: sideNames[sideIndex],
        html: sideNames[sideIndex],
        color: "white",
        backgroundColor: colors[sideIndex],
        style: {
          lineHeight: cubeSide + "px",
          textAlign: "center",
          fontSize: (cubeSide / 10) + "px",
          fontWeight: "100",
          fontFamily: "Helvetica Neue"
        }
      });
      this.sides.push(side);
      side._backgroundColor = side.backgroundColor;
    }
    if (this.sideImages) {
      results = [];
      for (key in this.sideImages) {
        results.push(this.setImage(key, this.sideImages[key]));
      }
      return results;
    }
  };

  VRComponent.prototype.hideEnviroment = function() {
    var i, len, ref, results, side;
    ref = this.sides;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      side = ref[i];
      results.push(side.destroy());
    }
    return results;
  };

  VRComponent.prototype.layerFromFace = function(face) {
    var map;
    if (this.sides == null) {
      return;
    }
    map = {
      north: this.sides[0],
      front: this.sides[0],
      east: this.sides[1],
      right: this.sides[1],
      south: this.sides[2],
      back: this.sides[2],
      west: this.sides[3],
      left: this.sides[3],
      top: this.sides[4],
      bottom: this.sides[5]
    };
    return map[face];
  };

  VRComponent.prototype.setImage = function(face, imagePath) {
    var layer, ref;
    if (ref = !face, indexOf.call(SIDES, ref) >= 0) {
      throw Error("VRComponent setImage, wrong name for face: " + face + ", valid options: front, right, back, left, top, bottom, north, east, south, west");
    }
    if (!this.sideImages) {
      this.sideImages = {};
    }
    this.sideImages[face] = imagePath;
    layer = this.layerFromFace(face);
    if (imagePath) {
      if (layer != null) {
        layer.html = "";
      }
      return layer != null ? layer.image = imagePath : void 0;
    } else {
      if (layer != null) {
        layer.html = layer != null ? layer.name : void 0;
      }
      return layer != null ? layer.backgroundColor = layer != null ? layer._backgroundColor : void 0 : void 0;
    }
  };

  VRComponent.prototype.getImage = function(face) {
    var layer, ref;
    if (ref = !face, indexOf.call(SIDES, ref) >= 0) {
      throw Error("VRComponent getImage, wrong name for face: " + face + ", valid options: front, right, back, left, top, bottom, north, east, south, west");
    }
    layer = this.layerFromFace(face);
    if (layer) {
      return layer.image;
    }
  };

  VRComponent.prototype.projectLayer = function(insertLayer) {
    var anchor, distance, elevation, heading, rest;
    heading = insertLayer.heading;
    if (heading == null) {
      heading = 0;
    }
    if (heading >= 360) {
      heading = value % 360;
    } else if (heading < 0) {
      rest = Math.abs(heading) % 360;
      heading = 360 - rest;
    }
    elevation = insertLayer.elevation;
    if (elevation == null) {
      elevation = 0;
    }
    elevation = Utils.clamp(elevation, -90, 90);
    distance = insertLayer.distance;
    if (distance == null) {
      distance = 1200;
    }
    insertLayer.heading = heading;
    insertLayer.elevation = elevation;
    insertLayer.distance = distance;
    anchor = new VRAnchorLayer(insertLayer, this.cubeSide);
    anchor.superLayer = this.world;
    if (this.lookAtLatestProjectedLayer) {
      return this.lookAt(heading, elevation);
    }
  };

  VRComponent.prototype.deviceOrientationUpdate = function() {
    var alpha, beta, date, diff, gamma, halfCubeSide, orientation, rotation, translationX, translationY, translationZ, x, xAngle, yAngle, zAngle;
    if (Utils.isDesktop()) {
      if (this.arrowKeys) {
        if (this._lastCallHorizontal === void 0) {
          this._lastCallHorizontal = 0;
          this._lastCallVertical = 0;
          this._accelerationHorizontal = 1;
          this._accelerationVertical = 1;
          this._goingUp = false;
          this._goingLeft = false;
        }
        date = new Date();
        x = .1;
        if (KEYSDOWN.up || KEYSDOWN.down) {
          diff = date - this._lastCallVertical;
          if (diff < 30) {
            if (this._accelerationVertical < 30) {
              this._accelerationVertical += 0.18;
            }
          }
          if (KEYSDOWN.up) {
            if (this._goingUp === false) {
              this._accelerationVertical = 1;
              this._goingUp = true;
            }
            this.desktopPan(0, 1 * this._accelerationVertical * x);
          } else {
            if (this._goingUp === true) {
              this._accelerationVertical = 1;
              this._goingUp = false;
            }
            this.desktopPan(0, -1 * this._accelerationVertical * x);
          }
          this._lastCallVertical = date;
        } else {
          this._accelerationVertical = 1;
        }
        if (KEYSDOWN.left || KEYSDOWN.right) {
          diff = date - this._lastCallHorizontal;
          if (diff < 30) {
            if (this._accelerationHorizontal < 25) {
              this._accelerationHorizontal += 0.18;
            }
          }
          if (KEYSDOWN.left) {
            if (this._goingLeft === false) {
              this._accelerationHorizontal = 1;
              this._goingLeft = true;
            }
            this.desktopPan(1 * this._accelerationHorizontal * x, 0);
          } else {
            if (this._goingLeft === true) {
              this._accelerationHorizontal = 1;
              this._goingLeft = false;
            }
            this.desktopPan(-1 * this._accelerationHorizontal * x, 0);
          }
          return this._lastCallHorizontal = date;
        } else {
          return this._accelerationHorizontal = 1;
        }
      }
    } else if (this.orientationData) {
      alpha = this.orientationData.alpha;
      beta = this.orientationData.beta;
      gamma = this.orientationData.gamma;
      if (alpha !== 0 && beta !== 0 && gamma !== 0) {
        this.directionParams(alpha, beta, gamma);
      }
      xAngle = beta;
      yAngle = -gamma;
      zAngle = alpha;
      halfCubeSide = this.cubeSide / 2;
      orientation = "rotate(" + (window.orientation * -1) + "deg) ";
      translationX = "translateX(" + ((this.width / 2) - halfCubeSide) + "px)";
      translationY = " translateY(" + ((this.height / 2) - halfCubeSide) + "px)";
      translationZ = " translateZ(" + this.perspective + "px)";
      rotation = translationZ + translationX + translationY + orientation + (" rotateY(" + yAngle + "deg) rotateX(" + xAngle + "deg) rotateZ(" + zAngle + "deg)") + (" rotateZ(" + (-this._headingOffset) + "deg)");
      return this.world.style["webkitTransform"] = rotation;
    }
  };

  VRComponent.prototype.directionParams = function(alpha, beta, gamma) {
    var alphaRad, betaRad, cA, cB, cG, cH, elevation, gammaRad, heading, orientationTiltOffset, sA, sB, sG, tilt, xrA, xrB, xrC, yrA, yrB, yrC, zrA, zrB, zrC;
    alphaRad = alpha * this.degToRad;
    betaRad = beta * this.degToRad;
    gammaRad = gamma * this.degToRad;
    cA = Math.cos(alphaRad);
    sA = Math.sin(alphaRad);
    cB = Math.cos(betaRad);
    sB = Math.sin(betaRad);
    cG = Math.cos(gammaRad);
    sG = Math.sin(gammaRad);
    xrA = -sA * sB * sG + cA * cG;
    xrB = cA * sB * sG + sA * cG;
    xrC = cB * sG;
    yrA = -sA * cB;
    yrB = cA * cB;
    yrC = -sB;
    zrA = -sA * sB * cG - cA * sG;
    zrB = cA * sB * cG - sA * sG;
    zrC = cB * cG;
    heading = Math.atan(zrA / zrB);
    if (zrB < 0) {
      heading += Math.PI;
    } else if (zrA < 0) {
      heading += 2 * Math.PI;
    }
    elevation = Math.PI / 2 - Math.acos(-zrC);
    cH = Math.sqrt(1 - (zrC * zrC));
    tilt = Math.acos(-xrC / cH) * Math.sign(yrC);
    heading *= 180 / Math.PI;
    elevation *= 180 / Math.PI;
    tilt *= 180 / Math.PI;
    this._heading = Math.round(heading * 1000) / 1000;
    this._elevation = Math.round(elevation * 1000) / 1000;
    tilt = Math.round(tilt * 1000) / 1000;
    orientationTiltOffset = (window.orientation * -1) + 90;
    tilt += orientationTiltOffset;
    if (tilt > 180) {
      tilt -= 360;
    }
    this._tilt = tilt;
    this._deviceHeading = this._heading;
    this._deviceElevation = this._elevation;
    return this._emitOrientationDidChangeEvent();
  };

  VRComponent.prototype._canvasToComponentRatio = function() {
    var pointA, pointB, xDist, yDist;
    pointA = Utils.convertPointFromContext({
      x: 0,
      y: 0
    }, this, true);
    pointB = Utils.convertPointFromContext({
      x: 1,
      y: 1
    }, this, true);
    xDist = Math.abs(pointA.x - pointB.x);
    yDist = Math.abs(pointA.y - pointB.y);
    return {
      x: xDist,
      y: yDist
    };
  };

  VRComponent.prototype.setupPan = function(enabled) {
    this.panning = enabled;
    this.desktopPan(0, 0);
    this.onMouseDown((function(_this) {
      return function() {
        return _this.animateStop();
      };
    })(this));
    this.onPan((function(_this) {
      return function(data) {
        var deltaX, deltaY, ratio, strength;
        if (!_this.panning) {
          return;
        }
        ratio = _this._canvasToComponentRatio();
        deltaX = data.deltaX * ratio.x;
        deltaY = data.deltaY * ratio.y;
        strength = Utils.modulate(_this.perspective, [1200, 900], [22, 17.5]);
        if (Utils.isMobile()) {
          if (_this.mobilePanning) {
            _this._headingOffset -= deltaX / strength;
          }
        } else {
          _this.desktopPan(deltaX / strength, deltaY / strength);
        }
        _this._prevVeloX = data.velocityX;
        return _this._prevVeloU = data.velocityY;
      };
    })(this));
    return this.onPanEnd((function(_this) {
      return function(data) {
        var ratio, strength, velo, velocityX, velocityY;
        if (!_this.panning || Utils.isMobile()) {
          return;
        }
        ratio = _this._canvasToComponentRatio();
        velocityX = (data.velocityX + _this._prevVeloX) * 0.5;
        velocityY = (data.velocityY + _this._prevVeloY) * 0.5;
        velocityX *= velocityX;
        velocityY *= velocityY;
        velocityX *= ratio.x;
        velocityY *= ratio.y;
        strength = Utils.modulate(_this.perspective, [1200, 900], [22, 17.5]);
        velo = Math.floor(Math.sqrt(velocityX + velocityY) * 5) / strength;
        return _this.animate({
          properties: {
            heading: _this.heading - (data.velocityX * ratio.x * 200) / strength,
            elevation: _this.elevation + (data.velocityY * ratio.y * 200) / strength
          },
          curve: "spring(300, 100, " + velo + ")"
        });
      };
    })(this));
  };

  VRComponent.prototype.desktopPan = function(deltaDir, deltaHeight) {
    var halfCubeSide, rotation, translationX, translationY, translationZ;
    halfCubeSide = this.cubeSide / 2;
    translationX = "translateX(" + ((this.width / 2) - halfCubeSide) + "px)";
    translationY = " translateY(" + ((this.height / 2) - halfCubeSide) + "px)";
    translationZ = " translateZ(" + this.perspective + "px)";
    this._heading -= deltaDir;
    if (this._heading > 360) {
      this._heading -= 360;
    } else if (this._heading < 0) {
      this._heading += 360;
    }
    this._elevation += deltaHeight;
    this._elevation = Utils.clamp(this._elevation, -90, 90);
    rotation = translationZ + translationX + translationY + (" rotateX(" + (this._elevation + 90) + "deg) rotateZ(" + (360 - this._heading) + "deg)") + (" rotateZ(" + (-this._headingOffset) + "deg)");
    this.world.style["webkitTransform"] = rotation;
    this._heading = Math.round(this._heading * 1000) / 1000;
    this._tilt = 0;
    return this._emitOrientationDidChangeEvent();
  };

  VRComponent.prototype.lookAt = function(heading, elevation) {
    var halfCubeSide, ref, rotation, translationX, translationY, translationZ;
    halfCubeSide = this.cubeSide / 2;
    translationX = "translateX(" + ((this.width / 2) - halfCubeSide) + "px)";
    translationY = " translateY(" + ((this.height / 2) - halfCubeSide) + "px)";
    translationZ = " translateZ(" + this.perspective + "px)";
    rotation = translationZ + translationX + translationY + (" rotateZ(" + this._tilt + "deg) rotateX(" + (elevation + 90) + "deg) rotateZ(" + (-heading) + "deg)");
    if ((ref = this.world) != null) {
      ref.style["webkitTransform"] = rotation;
    }
    this._heading = heading;
    this._elevation = elevation;
    if (Utils.isMobile()) {
      this._headingOffset = this._heading - this._deviceHeading;
    }
    this._elevationOffset = this._elevation - this._deviceElevation;
    heading = this._heading;
    if (heading < 0) {
      heading += 360;
    } else if (heading > 360) {
      heading -= 360;
    }
    return this.emit(Events.OrientationDidChange, {
      heading: heading,
      elevation: this._elevation,
      tilt: this._tilt
    });
  };

  VRComponent.prototype._emitOrientationDidChangeEvent = function() {
    return this.emit(Events.OrientationDidChange, {
      heading: this.heading,
      elevation: this._elevation,
      tilt: this._tilt
    });
  };

  VRComponent.prototype.onOrientationChange = function(cb) {
    return this.on(Events.OrientationDidChange, cb);
  };

  return VRComponent;

})(Layer);


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL1VzZXJzL2RhdmlkL0dpdEh1Yi9wc3ZyLXVpLWNvbmNlcHQvcHN2ci11aS1jb25jZXB0LmZyYW1lci9tb2R1bGVzL1ZSQ29tcG9uZW50LmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJcIlwiXG5cblZSQ29tcG9uZW50IGNsYXNzXG5cbnByb3BlcnRpZXNcbi0gZnJvbnQgKHNldDogaW1hZ2VQYXRoIDxzdHJpbmc+LCBnZXQ6IGxheWVyKVxuLSByaWdodFxuLSBiYWNrXG4tIGxlZnRcbi0gdG9wXG4tIGJvdHRvbVxuLSBoZWFkaW5nIDxudW1iZXI+XG4tIGVsZXZhdGlvbiA8bnVtYmVyPlxuLSB0aWx0IDxudW1iZXI+IHJlYWRvbmx5XG5cbi0gcGFubmluZyA8Ym9vbD5cbi0gbW9iaWxlUGFubmluZyA8Ym9vbD5cbi0gYXJyb3dLZXlzIDxib29sPlxuXG4tIGxvb2tBdExhdGVzdFByb2plY3RlZExheWVyIDxib29sPlxuXG5tZXRob2RzXG4tIHByb2plY3RMYXllcihsYXllcikgIyBoZWFkaW5nIGFuZCBlbGV2YXRpb24gYXJlIHNldCBhcyBwcm9wZXJ0aWVzIG9uIHRoZSBsYXllclxuLSBoaWRlRW52aXJvbWVudCgpXG5cbmV2ZW50c1xuLSBvbk9yaWVudGF0aW9uQ2hhbmdlIChkYXRhIHtoZWFkaW5nLCBlbGV2YXRpb24sIHRpbHR9KVxuXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5WUkxheWVyIGNsYXNzXG5cbnByb3BlcnRpZXNcbi0gaGVhZGluZyA8bnVtYmVyPiAoZnJvbSAwIHVwIHRvIDM2MClcbi0gZWxldmF0aW9uIDxudW1iZXI+IChmcm9tIC05MCBkb3duIHRvIDkwIHVwKVxuXG5cIlwiXCJcblxuU0lERVMgPSBbXG5cdFwibm9ydGhcIixcblx0XCJmcm9udFwiLFxuXHRcImVhc3RcIixcblx0XCJyaWdodFwiLFxuXHRcInNvdXRoXCIsXG5cdFwiYmFja1wiLFxuXHRcIndlc3RcIixcblx0XCJsZWZ0XCIsXG5cdFwidG9wXCIsXG5cdFwiYm90dG9tXCIsXG5dXG5cbktFWVMgPSB7XG5cdExlZnRBcnJvdzogMzdcblx0VXBBcnJvdzogMzhcblx0UmlnaHRBcnJvdzogMzlcblx0RG93bkFycm93OiA0MFxufVxuXG5LRVlTRE9XTiA9IHtcblx0bGVmdDogZmFsc2Vcblx0dXA6IGZhbHNlXG5cdHJpZ2h0OiBmYWxzZVxuXHRkb3duOiBmYWxzZVxufVxuXG5FdmVudHMuT3JpZW50YXRpb25EaWRDaGFuZ2UgPSBcIm9yaWVudGF0aW9uZGlkY2hhbmdlXCJcblxuY2xhc3MgVlJBbmNob3JMYXllciBleHRlbmRzIExheWVyXG5cblx0Y29uc3RydWN0b3I6IChsYXllciwgY3ViZVNpZGUpIC0+XG5cdFx0c3VwZXIgdW5kZWZpbmVkXG5cdFx0QHdpZHRoID0gMFxuXHRcdEBoZWlnaHQgPSAwXG5cdFx0QGNsaXAgPSBmYWxzZVxuXHRcdEBuYW1lID0gXCJhbmNob3JcIlxuXHRcdEBjdWJlU2lkZSA9IGN1YmVTaWRlXG5cblx0XHRAbGF5ZXIgPSBsYXllclxuXHRcdGxheWVyLnN1cGVyTGF5ZXIgPSBAXG5cdFx0bGF5ZXIuY2VudGVyKClcblxuXHRcdGxheWVyLm9uIFwiY2hhbmdlOm9yaWVudGF0aW9uXCIsIChuZXdWYWx1ZSwgbGF5ZXIpID0+XG5cdFx0XHRAdXBkYXRlUG9zaXRpb24obGF5ZXIpXG5cdFx0QHVwZGF0ZVBvc2l0aW9uKGxheWVyKVxuXG5cdFx0bGF5ZXIuX2NvbnRleHQub24gXCJsYXllcjpkZXN0cm95XCIsIChsYXllcikgPT5cblx0XHRcdGlmIGxheWVyID09IEBsYXllclxuXHRcdFx0XHRAZGVzdHJveSgpXG5cblx0dXBkYXRlUG9zaXRpb246IChsYXllcikgLT5cblx0XHRoYWxmQ3ViZVNpZGUgPSBAY3ViZVNpZGUvMlxuXHRcdEBzdHlsZVtcIndlYmtpdFRyYW5zZm9ybVwiXSA9IFwidHJhbnNsYXRlWCgjeyhAY3ViZVNpZGUgLSBAd2lkdGgpLzJ9cHgpIHRyYW5zbGF0ZVkoI3soQGN1YmVTaWRlIC0gQGhlaWdodCkvMn1weCkgcm90YXRlWigje2xheWVyLmhlYWRpbmd9ZGVnKSByb3RhdGVYKCN7OTAtbGF5ZXIuZWxldmF0aW9ufWRlZykgdHJhbnNsYXRlWigje2xheWVyLmRpc3RhbmNlfXB4KSByb3RhdGVYKDE4MGRlZylcIlxuXG5jbGFzcyBleHBvcnRzLlZSTGF5ZXIgZXh0ZW5kcyBMYXllclxuXG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucyA9IHt9KSAtPlxuXHRcdG9wdGlvbnMgPSBfLmRlZmF1bHRzIG9wdGlvbnMsXG5cdFx0XHRoZWFkaW5nOiAwXG5cdFx0XHRlbGV2YXRpb246IDBcblx0XHRzdXBlciBvcHRpb25zXG5cblx0QGRlZmluZSBcImhlYWRpbmdcIixcblx0XHRnZXQ6IC0+IEBfaGVhZGluZ1xuXHRcdHNldDogKHZhbHVlKSAtPlxuXHRcdFx0aWYgdmFsdWUgPj0gMzYwXG5cdFx0XHRcdHZhbHVlID0gdmFsdWUgJSAzNjBcblx0XHRcdGVsc2UgaWYgdmFsdWUgPCAwXG5cdFx0XHRcdHJlc3QgPSBNYXRoLmFicyh2YWx1ZSkgJSAzNjBcblx0XHRcdFx0dmFsdWUgPSAzNjAgLSByZXN0XG5cdFx0XHRpZiBAX2hlYWRpbmcgIT0gdmFsdWVcblx0XHRcdFx0QF9oZWFkaW5nID0gdmFsdWVcblx0XHRcdFx0QGVtaXQoXCJjaGFuZ2U6aGVhZGluZ1wiLCB2YWx1ZSlcblx0XHRcdFx0QGVtaXQoXCJjaGFuZ2U6b3JpZW50YXRpb25cIiwgdmFsdWUpXG5cblx0QGRlZmluZSBcImVsZXZhdGlvblwiLFxuXHRcdGdldDogLT4gQF9lbGV2YXRpb25cblx0XHRzZXQ6ICh2YWx1ZSkgLT5cblx0XHRcdHZhbHVlID0gVXRpbHMuY2xhbXAodmFsdWUsIC05MCwgOTApXG5cdFx0XHRpZiB2YWx1ZSAhPSBAX2VsZXZhdGlvblxuXHRcdFx0XHRAX2VsZXZhdGlvbiA9IHZhbHVlXG5cdFx0XHRcdEBlbWl0KFwiY2hhbmdlOmVsZXZhdGlvblwiLCB2YWx1ZSlcblx0XHRcdFx0QGVtaXQoXCJjaGFuZ2U6b3JpZW50YXRpb25cIiwgdmFsdWUpXG5cblx0QGRlZmluZSBcImRpc3RhbmNlXCIsXG5cdFx0Z2V0OiAtPiBAX2Rpc3RhbmNlXG5cdFx0c2V0OiAodmFsdWUpIC0+XG5cdFx0XHRpZiB2YWx1ZSAhPSBAX2Rpc3RhbmNlXG5cdFx0XHRcdEBfZGlzdGFuY2UgPSB2YWx1ZVxuXHRcdFx0XHRAZW1pdChcImNoYW5nZTpkaXN0YW5jZVwiLCB2YWx1ZSlcblx0XHRcdFx0QGVtaXQoXCJjaGFuZ2U6b3JpZW50YXRpb25cIiwgdmFsdWUpXG5cbmNsYXNzIGV4cG9ydHMuVlJDb21wb25lbnQgZXh0ZW5kcyBMYXllclxuXG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucyA9IHt9KSAtPlxuXHRcdG9wdGlvbnMgPSBfLmRlZmF1bHRzIG9wdGlvbnMsXG5cdFx0XHRjdWJlU2lkZTogMzAwMFxuXHRcdFx0cGVyc3BlY3RpdmU6IDEyMDBcblx0XHRcdGxvb2tBdExhdGVzdFByb2plY3RlZExheWVyOiBmYWxzZVxuXHRcdFx0d2lkdGg6IFNjcmVlbi53aWR0aFxuXHRcdFx0aGVpZ2h0OiBTY3JlZW4uaGVpZ2h0XG5cdFx0XHRhcnJvd0tleXM6IHRydWVcblx0XHRcdHBhbm5pbmc6IHRydWVcblx0XHRcdG1vYmlsZVBhbm5pbmc6IHRydWVcblx0XHRcdGZsYXQ6IHRydWVcblx0XHRcdGNsaXA6IHRydWVcblx0XHRzdXBlciBvcHRpb25zXG5cblx0XHQjIHRvIGhpZGUgdGhlIHNlZW1zIHdoZXJlIHRoZSBjdWJlIHN1cmZhY2VzIGNvbWUgdG9nZXRoZXIgd2UgZGlzYWJsZSB0aGUgdmlld3BvcnQgcGVyc3BlY3RpdmUgYW5kIHNldCBhIGJsYWNrIGJhY2tncm91bmRcblx0XHRTY3JlZW4uYmFja2dyb3VuZENvbG9yID0gXCJibGFja1wiXG5cdFx0U2NyZWVuLnBlcnNwZWN0aXZlID0gMFxuXG5cdFx0QHNldHVwRGVmYXVsdFZhbHVlcygpXG5cdFx0QGRlZ1RvUmFkID0gTWF0aC5QSSAvIDE4MFxuXHRcdEBiYWNrZ3JvdW5kQ29sb3IgPSBudWxsXG5cblx0XHRAY3JlYXRlQ3ViZShvcHRpb25zLmN1YmVTaWRlKVxuXHRcdEBsb29rQXRMYXRlc3RQcm9qZWN0ZWRMYXllciA9IG9wdGlvbnMubG9va0F0TGF0ZXN0UHJvamVjdGVkTGF5ZXJcblx0XHRAc2V0dXBLZXlzKG9wdGlvbnMuYXJyb3dLZXlzKVxuXG5cdFx0QGhlYWRpbmcgPSBvcHRpb25zLmhlYWRpbmcgaWYgb3B0aW9ucy5oZWFkaW5nP1xuXHRcdEBlbGV2YXRpb24gPSBvcHRpb25zLmVsZXZhdGlvbiBpZiBvcHRpb25zLmVsZXZhdGlvbj9cblxuXHRcdEBzZXR1cFBhbihvcHRpb25zLnBhbm5pbmcpXG5cdFx0QG1vYmlsZVBhbm5pbmcgPSBvcHRpb25zLm1vYmlsZVBhbm5pbmdcblxuXHRcdGlmIFV0aWxzLmlzTW9iaWxlKClcblx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyIFwiZGV2aWNlb3JpZW50YXRpb25cIiwgKGV2ZW50KSA9PlxuXHRcdFx0XHRAb3JpZW50YXRpb25EYXRhID0gZXZlbnRcblxuXHRcdEZyYW1lci5Mb29wLm9uKFwidXBkYXRlXCIsIEBkZXZpY2VPcmllbnRhdGlvblVwZGF0ZSlcblxuXHRcdCMgTWFrZSBzdXJlIHdlIHJlbW92ZSB0aGUgdXBkYXRlIGZyb20gdGhlIGxvb3Agd2hlbiB3ZSBkZXN0cm95IHRoZSBjb250ZXh0XG5cdFx0RnJhbWVyLkN1cnJlbnRDb250ZXh0Lm9uIFwicmVzZXRcIiwgLT5cblx0XHRcdEZyYW1lci5Mb29wLm9mZihcInVwZGF0ZVwiLCBAZGV2aWNlT3JpZW50YXRpb25VcGRhdGUpXG5cblx0XHRAb24gXCJjaGFuZ2U6ZnJhbWVcIiwgLT5cblx0XHRcdEBkZXNrdG9wUGFuKDAsMClcblxuXHRzZXR1cERlZmF1bHRWYWx1ZXM6ID0+XG5cblx0XHRAX2hlYWRpbmcgPSAwXG5cdFx0QF9lbGV2YXRpb24gPSAwXG5cdFx0QF90aWx0ID0gMFxuXG5cdFx0QF9oZWFkaW5nT2Zmc2V0ID0gMFxuXHRcdEBfZWxldmF0aW9uT2Zmc2V0ID0gMFxuXHRcdEBfZGV2aWNlSGVhZGluZyA9IDBcblx0XHRAX2RldmljZUVsZXZhdGlvbiA9IDBcblxuXHRzZXR1cEtleXM6IChlbmFibGVkKSAtPlxuXG5cdFx0QGFycm93S2V5cyA9IGVuYWJsZWRcblxuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIgXCJrZXlkb3duXCIsIChldmVudCkgPT5cblx0XHRcdHN3aXRjaCBldmVudC53aGljaFxuXHRcdFx0XHR3aGVuIEtFWVMuVXBBcnJvd1xuXHRcdFx0XHRcdEtFWVNET1dOLnVwID0gdHJ1ZVxuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcblx0XHRcdFx0d2hlbiBLRVlTLkRvd25BcnJvd1xuXHRcdFx0XHRcdEtFWVNET1dOLmRvd24gPSB0cnVlXG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXHRcdFx0XHR3aGVuIEtFWVMuTGVmdEFycm93XG5cdFx0XHRcdFx0S0VZU0RPV04ubGVmdCA9IHRydWVcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdHdoZW4gS0VZUy5SaWdodEFycm93XG5cdFx0XHRcdFx0S0VZU0RPV04ucmlnaHQgPSB0cnVlXG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciBcImtleXVwXCIsIChldmVudCkgPT5cblx0XHRcdHN3aXRjaCBldmVudC53aGljaFxuXHRcdFx0XHR3aGVuIEtFWVMuVXBBcnJvd1xuXHRcdFx0XHRcdEtFWVNET1dOLnVwID0gZmFsc2Vcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdHdoZW4gS0VZUy5Eb3duQXJyb3dcblx0XHRcdFx0XHRLRVlTRE9XTi5kb3duID0gZmFsc2Vcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdHdoZW4gS0VZUy5MZWZ0QXJyb3dcblx0XHRcdFx0XHRLRVlTRE9XTi5sZWZ0ID0gZmFsc2Vcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdHdoZW4gS0VZUy5SaWdodEFycm93XG5cdFx0XHRcdFx0S0VZU0RPV04ucmlnaHQgPSBmYWxzZVxuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcblxuXHRcdHdpbmRvdy5vbmJsdXIgPSAtPlxuXHRcdFx0S0VZU0RPV04udXAgPSBmYWxzZVxuXHRcdFx0S0VZU0RPV04uZG93biA9IGZhbHNlXG5cdFx0XHRLRVlTRE9XTi5sZWZ0ID0gZmFsc2Vcblx0XHRcdEtFWVNET1dOLnJpZ2h0ID0gZmFsc2VcblxuXHRAZGVmaW5lIFwiaGVhZGluZ1wiLFxuXHRcdGdldDogLT5cblx0XHRcdGhlYWRpbmcgPSBAX2hlYWRpbmcgKyBAX2hlYWRpbmdPZmZzZXRcblx0XHRcdGlmIGhlYWRpbmcgPiAzNjBcblx0XHRcdFx0aGVhZGluZyA9IGhlYWRpbmcgJSAzNjBcblx0XHRcdGVsc2UgaWYgaGVhZGluZyA8IDBcblx0XHRcdFx0cmVzdCA9IE1hdGguYWJzKGhlYWRpbmcpICUgMzYwXG5cdFx0XHRcdGhlYWRpbmcgPSAzNjAgLSByZXN0XG5cdFx0XHRyZXR1cm4gaGVhZGluZ1xuXHRcdHNldDogKHZhbHVlKSAtPlxuXHRcdFx0QGxvb2tBdCh2YWx1ZSwgQF9lbGV2YXRpb24pXG5cblx0QGRlZmluZSBcImVsZXZhdGlvblwiLFxuXHRcdGdldDogLT4gQF9lbGV2YXRpb25cblx0XHRzZXQ6ICh2YWx1ZSkgLT5cblx0XHRcdHZhbHVlID0gVXRpbHMuY2xhbXAodmFsdWUsIC05MCwgOTApXG5cdFx0XHRAbG9va0F0KEBfaGVhZGluZywgdmFsdWUpXG5cblx0QGRlZmluZSBcInRpbHRcIixcblx0XHRnZXQ6IC0+IEBfdGlsdFxuXHRcdHNldDogKHZhbHVlKSAtPiB0aHJvdyBcIlRpbHQgaXMgcmVhZG9ubHlcIlxuXG5cdFNJREVTLm1hcCAoZmFjZSkgPT5cblx0XHRAZGVmaW5lIGZhY2UsXG5cdFx0XHRnZXQ6IC0+IEBsYXllckZyb21GYWNlKGZhY2UpICMgQGdldEltYWdlKGZhY2UpXG5cdFx0XHRzZXQ6ICh2YWx1ZSkgLT4gQHNldEltYWdlKGZhY2UsIHZhbHVlKVxuXG5cdGNyZWF0ZUN1YmU6IChjdWJlU2lkZSA9IEBjdWJlU2lkZSkgPT5cblx0XHRAY3ViZVNpZGUgPSBjdWJlU2lkZVxuXG5cdFx0QHdvcmxkPy5kZXN0cm95KClcblx0XHRAd29ybGQgPSBuZXcgTGF5ZXJcblx0XHRcdG5hbWU6IFwid29ybGRcIlxuXHRcdFx0c3VwZXJMYXllcjogQFxuXHRcdFx0d2lkdGg6IGN1YmVTaWRlLCBoZWlnaHQ6IGN1YmVTaWRlXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IG51bGxcblx0XHRcdGNsaXA6IGZhbHNlXG5cdFx0QHdvcmxkLmNlbnRlcigpXG5cblx0XHRAc2lkZXMgPSBbXVxuXHRcdGhhbGZDdWJlU2lkZSA9IEBjdWJlU2lkZS8yXG5cdFx0Y29sb3JzID0gW1wiIzg2NmNjY1wiLCBcIiMyOGFmZmFcIiwgXCIjMmRkN2FhXCIsIFwiI2ZmYzIyY1wiLCBcIiM3ZGRkMTFcIiwgXCIjZjk1ZmFhXCJdXG5cdFx0c2lkZU5hbWVzID0gW1wiZnJvbnRcIiwgXCJyaWdodFwiLCBcImJhY2tcIiwgXCJsZWZ0XCIsIFwidG9wXCIsIFwiYm90dG9tXCJdXG5cblx0XHRmb3Igc2lkZUluZGV4IGluIFswLi4uNl1cblxuXHRcdFx0cm90YXRpb25YID0gMFxuXHRcdFx0cm90YXRpb25YID0gLTkwIGlmIHNpZGVJbmRleCBpbiBbMC4uLjRdXG5cdFx0XHRyb3RhdGlvblggPSAxODAgaWYgc2lkZUluZGV4ID09IDRcblxuXHRcdFx0cm90YXRpb25ZID0gMFxuXHRcdFx0cm90YXRpb25ZID0gc2lkZUluZGV4ICogLTkwIGlmIHNpZGVJbmRleCBpbiBbMC4uLjRdXG5cblx0XHRcdHNpZGUgPSBuZXcgTGF5ZXJcblx0XHRcdFx0c2l6ZTogY3ViZVNpZGVcblx0XHRcdFx0ejogLWhhbGZDdWJlU2lkZVxuXHRcdFx0XHRvcmlnaW5aOiBoYWxmQ3ViZVNpZGVcblx0XHRcdFx0cm90YXRpb25YOiByb3RhdGlvblhcblx0XHRcdFx0cm90YXRpb25ZOiByb3RhdGlvbllcblx0XHRcdFx0c3VwZXJMYXllcjogQHdvcmxkXG5cdFx0XHRcdG5hbWU6IHNpZGVOYW1lc1tzaWRlSW5kZXhdXG5cdFx0XHRcdGh0bWw6IHNpZGVOYW1lc1tzaWRlSW5kZXhdXG5cdFx0XHRcdGNvbG9yOiBcIndoaXRlXCJcblx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiBjb2xvcnNbc2lkZUluZGV4XVxuXHRcdFx0XHRzdHlsZTpcblx0XHRcdFx0XHRsaW5lSGVpZ2h0OiBcIiN7Y3ViZVNpZGV9cHhcIlxuXHRcdFx0XHRcdHRleHRBbGlnbjogXCJjZW50ZXJcIlxuXHRcdFx0XHRcdGZvbnRTaXplOiBcIiN7Y3ViZVNpZGUgLyAxMH1weFwiXG5cdFx0XHRcdFx0Zm9udFdlaWdodDogXCIxMDBcIlxuXHRcdFx0XHRcdGZvbnRGYW1pbHk6IFwiSGVsdmV0aWNhIE5ldWVcIlxuXHRcdFx0QHNpZGVzLnB1c2goc2lkZSlcblx0XHRcdHNpZGUuX2JhY2tncm91bmRDb2xvciA9IHNpZGUuYmFja2dyb3VuZENvbG9yXG5cblx0XHRpZiBAc2lkZUltYWdlc1xuXHRcdFx0Zm9yIGtleSBvZiBAc2lkZUltYWdlc1xuXHRcdFx0XHRAc2V0SW1hZ2Uga2V5LCBAc2lkZUltYWdlc1trZXldXG5cblx0aGlkZUVudmlyb21lbnQ6IC0+XG5cdFx0Zm9yIHNpZGUgaW4gQHNpZGVzXG5cdFx0XHRzaWRlLmRlc3Ryb3koKVxuXG5cdGxheWVyRnJvbUZhY2U6IChmYWNlKSAtPlxuXHRcdHJldHVybiB1bmxlc3MgQHNpZGVzP1xuXHRcdG1hcCA9XG5cdFx0XHRub3J0aDogQHNpZGVzWzBdXG5cdFx0XHRmcm9udDogQHNpZGVzWzBdXG5cdFx0XHRlYXN0OiAgQHNpZGVzWzFdXG5cdFx0XHRyaWdodDogQHNpZGVzWzFdXG5cdFx0XHRzb3V0aDogQHNpZGVzWzJdXG5cdFx0XHRiYWNrOiAgQHNpZGVzWzJdXG5cdFx0XHR3ZXN0OiAgQHNpZGVzWzNdXG5cdFx0XHRsZWZ0OiAgQHNpZGVzWzNdXG5cdFx0XHR0b3A6ICAgQHNpZGVzWzRdXG5cdFx0XHRib3R0b206QHNpZGVzWzVdXG5cdFx0cmV0dXJuIG1hcFtmYWNlXVxuXG5cdHNldEltYWdlOiAoZmFjZSwgaW1hZ2VQYXRoKSAtPlxuXG5cdFx0aWYgbm90IGZhY2UgaW4gU0lERVNcblx0XHRcdHRocm93IEVycm9yIFwiVlJDb21wb25lbnQgc2V0SW1hZ2UsIHdyb25nIG5hbWUgZm9yIGZhY2U6IFwiICsgZmFjZSArIFwiLCB2YWxpZCBvcHRpb25zOiBmcm9udCwgcmlnaHQsIGJhY2ssIGxlZnQsIHRvcCwgYm90dG9tLCBub3J0aCwgZWFzdCwgc291dGgsIHdlc3RcIlxuXG5cdFx0aWYgbm90IEBzaWRlSW1hZ2VzXG5cdFx0XHRAc2lkZUltYWdlcyA9IHt9XG5cdFx0QHNpZGVJbWFnZXNbZmFjZV0gPSBpbWFnZVBhdGhcblxuXHRcdGxheWVyID0gQGxheWVyRnJvbUZhY2UoZmFjZSlcblxuXHRcdGlmIGltYWdlUGF0aFxuXHRcdFx0bGF5ZXI/Lmh0bWwgPSBcIlwiXG5cdFx0XHRsYXllcj8uaW1hZ2UgPSBpbWFnZVBhdGhcblx0XHRlbHNlXG5cdFx0XHRsYXllcj8uaHRtbCA9IGxheWVyPy5uYW1lXG5cdFx0XHRsYXllcj8uYmFja2dyb3VuZENvbG9yID0gbGF5ZXI/Ll9iYWNrZ3JvdW5kQ29sb3JcblxuXHRnZXRJbWFnZTogKGZhY2UpIC0+XG5cblx0XHRpZiBub3QgZmFjZSBpbiBTSURFU1xuXHRcdFx0dGhyb3cgRXJyb3IgXCJWUkNvbXBvbmVudCBnZXRJbWFnZSwgd3JvbmcgbmFtZSBmb3IgZmFjZTogXCIgKyBmYWNlICsgXCIsIHZhbGlkIG9wdGlvbnM6IGZyb250LCByaWdodCwgYmFjaywgbGVmdCwgdG9wLCBib3R0b20sIG5vcnRoLCBlYXN0LCBzb3V0aCwgd2VzdFwiXG5cblx0XHRsYXllciA9IEBsYXllckZyb21GYWNlKGZhY2UpXG5cdFx0aWYgbGF5ZXJcblx0XHRcdGxheWVyLmltYWdlXG5cblx0cHJvamVjdExheWVyOiAoaW5zZXJ0TGF5ZXIpIC0+XG5cblx0XHRoZWFkaW5nID0gaW5zZXJ0TGF5ZXIuaGVhZGluZ1xuXHRcdGhlYWRpbmcgPSAwIHVubGVzcyBoZWFkaW5nP1xuXG5cdFx0aWYgaGVhZGluZyA+PSAzNjBcblx0XHRcdGhlYWRpbmcgPSB2YWx1ZSAlIDM2MFxuXHRcdGVsc2UgaWYgaGVhZGluZyA8IDBcblx0XHRcdHJlc3QgPSBNYXRoLmFicyhoZWFkaW5nKSAlIDM2MFxuXHRcdFx0aGVhZGluZyA9IDM2MCAtIHJlc3RcblxuXHRcdGVsZXZhdGlvbiA9IGluc2VydExheWVyLmVsZXZhdGlvblxuXHRcdGVsZXZhdGlvbiA9IDAgdW5sZXNzIGVsZXZhdGlvbj9cblx0XHRlbGV2YXRpb24gPSBVdGlscy5jbGFtcChlbGV2YXRpb24sIC05MCwgOTApXG5cblx0XHRkaXN0YW5jZSA9IGluc2VydExheWVyLmRpc3RhbmNlXG5cdFx0ZGlzdGFuY2UgPSAxMjAwIHVubGVzcyBkaXN0YW5jZT9cblxuXHRcdGluc2VydExheWVyLmhlYWRpbmcgPSBoZWFkaW5nXG5cdFx0aW5zZXJ0TGF5ZXIuZWxldmF0aW9uID0gZWxldmF0aW9uXG5cdFx0aW5zZXJ0TGF5ZXIuZGlzdGFuY2UgPSBkaXN0YW5jZVxuXG5cdFx0YW5jaG9yID0gbmV3IFZSQW5jaG9yTGF5ZXIoaW5zZXJ0TGF5ZXIsIEBjdWJlU2lkZSlcblx0XHRhbmNob3Iuc3VwZXJMYXllciA9IEB3b3JsZFxuXG5cdFx0QGxvb2tBdChoZWFkaW5nLCBlbGV2YXRpb24pIGlmIEBsb29rQXRMYXRlc3RQcm9qZWN0ZWRMYXllclxuXG5cdCMgTW9iaWxlIGRldmljZSBvcmllbnRhdGlvblxuXG5cdGRldmljZU9yaWVudGF0aW9uVXBkYXRlOiA9PlxuXG5cdFx0aWYgVXRpbHMuaXNEZXNrdG9wKClcblx0XHRcdGlmIEBhcnJvd0tleXNcblx0XHRcdFx0aWYgQF9sYXN0Q2FsbEhvcml6b250YWwgPT0gdW5kZWZpbmVkXG5cdFx0XHRcdFx0QF9sYXN0Q2FsbEhvcml6b250YWwgPSAwXG5cdFx0XHRcdFx0QF9sYXN0Q2FsbFZlcnRpY2FsID0gMFxuXHRcdFx0XHRcdEBfYWNjZWxlcmF0aW9uSG9yaXpvbnRhbCA9IDFcblx0XHRcdFx0XHRAX2FjY2VsZXJhdGlvblZlcnRpY2FsID0gMVxuXHRcdFx0XHRcdEBfZ29pbmdVcCA9IGZhbHNlXG5cdFx0XHRcdFx0QF9nb2luZ0xlZnQgPSBmYWxzZVxuXG5cdFx0XHRcdGRhdGUgPSBuZXcgRGF0ZSgpXG5cdFx0XHRcdHggPSAuMVxuXHRcdFx0XHRpZiBLRVlTRE9XTi51cCB8fCBLRVlTRE9XTi5kb3duXG5cdFx0XHRcdFx0ZGlmZiA9IGRhdGUgLSBAX2xhc3RDYWxsVmVydGljYWxcblx0XHRcdFx0XHRpZiBkaWZmIDwgMzBcblx0XHRcdFx0XHRcdGlmIEBfYWNjZWxlcmF0aW9uVmVydGljYWwgPCAzMFxuXHRcdFx0XHRcdFx0XHRAX2FjY2VsZXJhdGlvblZlcnRpY2FsICs9IDAuMThcblx0XHRcdFx0XHRpZiBLRVlTRE9XTi51cFxuXHRcdFx0XHRcdFx0aWYgQF9nb2luZ1VwID09IGZhbHNlXG5cdFx0XHRcdFx0XHRcdEBfYWNjZWxlcmF0aW9uVmVydGljYWwgPSAxXG5cdFx0XHRcdFx0XHRcdEBfZ29pbmdVcCA9IHRydWVcblx0XHRcdFx0XHRcdEBkZXNrdG9wUGFuKDAsIDEgKiBAX2FjY2VsZXJhdGlvblZlcnRpY2FsICogeClcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRpZiBAX2dvaW5nVXAgPT0gdHJ1ZVxuXHRcdFx0XHRcdFx0XHRAX2FjY2VsZXJhdGlvblZlcnRpY2FsID0gMVxuXHRcdFx0XHRcdFx0XHRAX2dvaW5nVXAgPSBmYWxzZVxuXG5cdFx0XHRcdFx0XHRAZGVza3RvcFBhbigwLCAtMSAqIEBfYWNjZWxlcmF0aW9uVmVydGljYWwgKiB4KVxuXHRcdFx0XHRcdEBfbGFzdENhbGxWZXJ0aWNhbCA9IGRhdGVcblxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0QF9hY2NlbGVyYXRpb25WZXJ0aWNhbCA9IDFcblxuXHRcdFx0XHRpZiBLRVlTRE9XTi5sZWZ0IHx8IEtFWVNET1dOLnJpZ2h0XG5cdFx0XHRcdFx0ZGlmZiA9IGRhdGUgLSBAX2xhc3RDYWxsSG9yaXpvbnRhbFxuXHRcdFx0XHRcdGlmIGRpZmYgPCAzMFxuXHRcdFx0XHRcdFx0aWYgQF9hY2NlbGVyYXRpb25Ib3Jpem9udGFsIDwgMjVcblx0XHRcdFx0XHRcdFx0QF9hY2NlbGVyYXRpb25Ib3Jpem9udGFsICs9IDAuMThcblx0XHRcdFx0XHRpZiBLRVlTRE9XTi5sZWZ0XG5cdFx0XHRcdFx0XHRpZiBAX2dvaW5nTGVmdCA9PSBmYWxzZVxuXHRcdFx0XHRcdFx0XHRAX2FjY2VsZXJhdGlvbkhvcml6b250YWwgPSAxXG5cdFx0XHRcdFx0XHRcdEBfZ29pbmdMZWZ0ID0gdHJ1ZVxuXHRcdFx0XHRcdFx0QGRlc2t0b3BQYW4oMSAqIEBfYWNjZWxlcmF0aW9uSG9yaXpvbnRhbCAqIHgsIDApXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0aWYgQF9nb2luZ0xlZnQgPT0gdHJ1ZVxuXHRcdFx0XHRcdFx0XHRAX2FjY2VsZXJhdGlvbkhvcml6b250YWwgPSAxXG5cdFx0XHRcdFx0XHRcdEBfZ29pbmdMZWZ0ID0gZmFsc2Vcblx0XHRcdFx0XHRcdEBkZXNrdG9wUGFuKC0xICogQF9hY2NlbGVyYXRpb25Ib3Jpem9udGFsICogeCwgMClcblx0XHRcdFx0XHRAX2xhc3RDYWxsSG9yaXpvbnRhbCA9IGRhdGVcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdEBfYWNjZWxlcmF0aW9uSG9yaXpvbnRhbCA9IDFcblxuXHRcdGVsc2UgaWYgQG9yaWVudGF0aW9uRGF0YVxuXG5cdFx0XHRhbHBoYSA9IEBvcmllbnRhdGlvbkRhdGEuYWxwaGFcblx0XHRcdGJldGEgPSBAb3JpZW50YXRpb25EYXRhLmJldGFcblx0XHRcdGdhbW1hID0gQG9yaWVudGF0aW9uRGF0YS5nYW1tYVxuXG5cdFx0XHRAZGlyZWN0aW9uUGFyYW1zKGFscGhhLCBiZXRhLCBnYW1tYSkgaWYgYWxwaGEgIT0gMCAmJiBiZXRhICE9IDAgJiYgZ2FtbWEgIT0gMFxuXG5cdFx0XHR4QW5nbGUgPSBiZXRhXG5cdFx0XHR5QW5nbGUgPSAtZ2FtbWFcblx0XHRcdHpBbmdsZSA9IGFscGhhXG5cblx0XHRcdGhhbGZDdWJlU2lkZSA9IEBjdWJlU2lkZS8yXG5cdFx0XHRvcmllbnRhdGlvbiA9IFwicm90YXRlKCN7d2luZG93Lm9yaWVudGF0aW9uICogLTF9ZGVnKSBcIlxuXHRcdFx0dHJhbnNsYXRpb25YID0gXCJ0cmFuc2xhdGVYKCN7KEB3aWR0aCAvIDIpIC0gaGFsZkN1YmVTaWRlfXB4KVwiXG5cdFx0XHR0cmFuc2xhdGlvblkgPSBcIiB0cmFuc2xhdGVZKCN7KEBoZWlnaHQgLyAyKSAtIGhhbGZDdWJlU2lkZX1weClcIlxuXHRcdFx0dHJhbnNsYXRpb25aID0gXCIgdHJhbnNsYXRlWigje0BwZXJzcGVjdGl2ZX1weClcIlxuXHRcdFx0cm90YXRpb24gPSB0cmFuc2xhdGlvblogKyB0cmFuc2xhdGlvblggKyB0cmFuc2xhdGlvblkgKyBvcmllbnRhdGlvbiArIFwiIHJvdGF0ZVkoI3t5QW5nbGV9ZGVnKSByb3RhdGVYKCN7eEFuZ2xlfWRlZykgcm90YXRlWigje3pBbmdsZX1kZWcpXCIgKyBcIiByb3RhdGVaKCN7LUBfaGVhZGluZ09mZnNldH1kZWcpXCJcblx0XHRcdEB3b3JsZC5zdHlsZVtcIndlYmtpdFRyYW5zZm9ybVwiXSA9IHJvdGF0aW9uXG5cblx0ZGlyZWN0aW9uUGFyYW1zOiAoYWxwaGEsIGJldGEsIGdhbW1hKSAtPlxuXG5cdFx0YWxwaGFSYWQgPSBhbHBoYSAqIEBkZWdUb1JhZFxuXHRcdGJldGFSYWQgPSBiZXRhICogQGRlZ1RvUmFkXG5cdFx0Z2FtbWFSYWQgPSBnYW1tYSAqIEBkZWdUb1JhZFxuXG5cdFx0IyBDYWxjdWxhdGUgZXF1YXRpb24gY29tcG9uZW50c1xuXHRcdGNBID0gTWF0aC5jb3MoYWxwaGFSYWQpXG5cdFx0c0EgPSBNYXRoLnNpbihhbHBoYVJhZClcblx0XHRjQiA9IE1hdGguY29zKGJldGFSYWQpXG5cdFx0c0IgPSBNYXRoLnNpbihiZXRhUmFkKVxuXHRcdGNHID0gTWF0aC5jb3MoZ2FtbWFSYWQpXG5cdFx0c0cgPSBNYXRoLnNpbihnYW1tYVJhZClcblxuXHRcdCMgeCB1bml0dmVjdG9yXG5cdFx0eHJBID0gLXNBICogc0IgKiBzRyArIGNBICogY0dcblx0XHR4ckIgPSBjQSAqIHNCICogc0cgKyBzQSAqIGNHXG5cdFx0eHJDID0gY0IgKiBzR1xuXG5cdFx0IyB5IHVuaXR2ZWN0b3Jcblx0XHR5ckEgPSAtc0EgKiBjQlxuXHRcdHlyQiA9IGNBICogY0Jcblx0XHR5ckMgPSAtc0JcblxuXHRcdCMgLXogdW5pdHZlY3RvclxuXHRcdHpyQSA9IC1zQSAqIHNCICogY0cgLSBjQSAqIHNHXG5cdFx0enJCID0gY0EgKiBzQiAqIGNHIC0gc0EgKiBzR1xuXHRcdHpyQyA9IGNCICogY0dcblxuXHRcdCMgQ2FsY3VsYXRlIGhlYWRpbmdcblx0XHRoZWFkaW5nID0gTWF0aC5hdGFuKHpyQSAvIHpyQilcblxuXHRcdCMgQ29udmVydCBmcm9tIGhhbGYgdW5pdCBjaXJjbGUgdG8gd2hvbGUgdW5pdCBjaXJjbGVcblx0XHRpZiB6ckIgPCAwXG5cdFx0XHRoZWFkaW5nICs9IE1hdGguUElcblx0XHRlbHNlIGlmIHpyQSA8IDBcblx0XHRcdGhlYWRpbmcgKz0gMiAqIE1hdGguUElcblxuXHRcdCMgIyBDYWxjdWxhdGUgQWx0aXR1ZGUgKGluIGRlZ3JlZXMpXG5cdFx0ZWxldmF0aW9uID0gTWF0aC5QSSAvIDIgLSBNYXRoLmFjb3MoLXpyQylcblxuXHRcdGNIID0gTWF0aC5zcXJ0KDEgLSAoenJDICogenJDKSlcblx0XHR0aWx0ID0gTWF0aC5hY29zKC14ckMgLyBjSCkgKiBNYXRoLnNpZ24oeXJDKVxuXG5cdFx0IyBDb252ZXJ0IHJhZGlhbnMgdG8gZGVncmVlc1xuXHRcdGhlYWRpbmcgKj0gMTgwIC8gTWF0aC5QSVxuXHRcdGVsZXZhdGlvbiAqPSAxODAgLyBNYXRoLlBJXG5cdFx0dGlsdCAqPSAxODAgLyBNYXRoLlBJXG5cblx0XHRAX2hlYWRpbmcgPSBNYXRoLnJvdW5kKGhlYWRpbmcgKiAxMDAwKSAvIDEwMDBcblx0XHRAX2VsZXZhdGlvbiA9IE1hdGgucm91bmQoZWxldmF0aW9uICogMTAwMCkgLyAxMDAwXG5cblx0XHR0aWx0ID0gTWF0aC5yb3VuZCh0aWx0ICogMTAwMCkgLyAxMDAwXG5cdFx0b3JpZW50YXRpb25UaWx0T2Zmc2V0ID0gKHdpbmRvdy5vcmllbnRhdGlvbiAqIC0xKSArIDkwXG5cdFx0dGlsdCArPSBvcmllbnRhdGlvblRpbHRPZmZzZXRcblx0XHR0aWx0IC09IDM2MCBpZiB0aWx0ID4gMTgwXG5cdFx0QF90aWx0ID0gdGlsdFxuXG5cdFx0QF9kZXZpY2VIZWFkaW5nID0gQF9oZWFkaW5nXG5cdFx0QF9kZXZpY2VFbGV2YXRpb24gPSBAX2VsZXZhdGlvblxuXG5cdFx0QF9lbWl0T3JpZW50YXRpb25EaWRDaGFuZ2VFdmVudCgpXG5cblx0IyBQYW5uaW5nXG5cblx0X2NhbnZhc1RvQ29tcG9uZW50UmF0aW86ID0+XG5cdFx0cG9pbnRBID0gVXRpbHMuY29udmVydFBvaW50RnJvbUNvbnRleHQoe3g6MCwgeTowfSwgQCwgdHJ1ZSlcblx0XHRwb2ludEIgPSBVdGlscy5jb252ZXJ0UG9pbnRGcm9tQ29udGV4dCh7eDoxLCB5OjF9LCBALCB0cnVlKVxuXHRcdHhEaXN0ID0gTWF0aC5hYnMocG9pbnRBLnggLSBwb2ludEIueClcblx0XHR5RGlzdCA9IE1hdGguYWJzKHBvaW50QS55IC0gcG9pbnRCLnkpXG5cdFx0cmV0dXJuIHt4OnhEaXN0LCB5OnlEaXN0fVxuXG5cdHNldHVwUGFuOiAoZW5hYmxlZCkgPT5cblxuXHRcdEBwYW5uaW5nID0gZW5hYmxlZFxuXHRcdEBkZXNrdG9wUGFuKDAsIDApXG5cblx0XHRAb25Nb3VzZURvd24gPT4gQGFuaW1hdGVTdG9wKClcblxuXHRcdEBvblBhbiAoZGF0YSkgPT5cblx0XHRcdHJldHVybiBpZiBub3QgQHBhbm5pbmdcblx0XHRcdHJhdGlvID0gQF9jYW52YXNUb0NvbXBvbmVudFJhdGlvKClcblx0XHRcdGRlbHRhWCA9IGRhdGEuZGVsdGFYICogcmF0aW8ueFxuXHRcdFx0ZGVsdGFZID0gZGF0YS5kZWx0YVkgKiByYXRpby55XG5cdFx0XHRzdHJlbmd0aCA9IFV0aWxzLm1vZHVsYXRlKEBwZXJzcGVjdGl2ZSwgWzEyMDAsIDkwMF0sIFsyMiwgMTcuNV0pXG5cblx0XHRcdGlmIFV0aWxzLmlzTW9iaWxlKClcblx0XHRcdFx0QF9oZWFkaW5nT2Zmc2V0IC09IChkZWx0YVggLyBzdHJlbmd0aCkgaWYgQG1vYmlsZVBhbm5pbmdcblx0XHRcdGVsc2Vcblx0XHRcdFx0QGRlc2t0b3BQYW4oZGVsdGFYIC8gc3RyZW5ndGgsIGRlbHRhWSAvIHN0cmVuZ3RoKVxuXG5cdFx0XHRAX3ByZXZWZWxvWCA9IGRhdGEudmVsb2NpdHlYXG5cdFx0XHRAX3ByZXZWZWxvVSA9IGRhdGEudmVsb2NpdHlZXG5cblx0XHRAb25QYW5FbmQgKGRhdGEpID0+XG5cdFx0XHRyZXR1cm4gaWYgbm90IEBwYW5uaW5nIG9yIFV0aWxzLmlzTW9iaWxlKClcblx0XHRcdHJhdGlvID0gQF9jYW52YXNUb0NvbXBvbmVudFJhdGlvKClcblx0XHRcdHZlbG9jaXR5WCA9IChkYXRhLnZlbG9jaXR5WCArIEBfcHJldlZlbG9YKSAqIDAuNVxuXHRcdFx0dmVsb2NpdHlZID0gKGRhdGEudmVsb2NpdHlZICsgQF9wcmV2VmVsb1kpICogMC41XG5cdFx0XHR2ZWxvY2l0eVggKj0gdmVsb2NpdHlYXG5cdFx0XHR2ZWxvY2l0eVkgKj0gdmVsb2NpdHlZXG5cdFx0XHR2ZWxvY2l0eVggKj0gcmF0aW8ueFxuXHRcdFx0dmVsb2NpdHlZICo9IHJhdGlvLnlcblx0XHRcdHN0cmVuZ3RoID0gVXRpbHMubW9kdWxhdGUoQHBlcnNwZWN0aXZlLCBbMTIwMCwgOTAwXSwgWzIyLCAxNy41XSlcblx0XHRcdHZlbG8gPSBNYXRoLmZsb29yKE1hdGguc3FydCh2ZWxvY2l0eVggKyB2ZWxvY2l0eVkpICogNSkgLyBzdHJlbmd0aFxuXHRcdFx0QGFuaW1hdGVcblx0XHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0XHRoZWFkaW5nOiBAaGVhZGluZyAtIChkYXRhLnZlbG9jaXR5WCAqIHJhdGlvLnggKiAyMDApIC8gc3RyZW5ndGhcblx0XHRcdFx0XHRlbGV2YXRpb246IEBlbGV2YXRpb24gKyAoZGF0YS52ZWxvY2l0eVkgKiByYXRpby55ICogMjAwKSAvIHN0cmVuZ3RoXG5cdFx0XHRcdGN1cnZlOiBcInNwcmluZygzMDAsIDEwMCwgI3t2ZWxvfSlcIlxuXG5cdGRlc2t0b3BQYW46IChkZWx0YURpciwgZGVsdGFIZWlnaHQpIC0+XG5cdFx0aGFsZkN1YmVTaWRlID0gQGN1YmVTaWRlLzJcblx0XHR0cmFuc2xhdGlvblggPSBcInRyYW5zbGF0ZVgoI3soQHdpZHRoIC8gMikgLSBoYWxmQ3ViZVNpZGV9cHgpXCJcblx0XHR0cmFuc2xhdGlvblkgPSBcIiB0cmFuc2xhdGVZKCN7KEBoZWlnaHQgLyAyKSAtIGhhbGZDdWJlU2lkZX1weClcIlxuXHRcdHRyYW5zbGF0aW9uWiA9IFwiIHRyYW5zbGF0ZVooI3tAcGVyc3BlY3RpdmV9cHgpXCJcblx0XHRAX2hlYWRpbmcgLT0gZGVsdGFEaXJcblxuXHRcdGlmIEBfaGVhZGluZyA+IDM2MFxuXHRcdFx0QF9oZWFkaW5nIC09IDM2MFxuXHRcdGVsc2UgaWYgQF9oZWFkaW5nIDwgMFxuXHRcdFx0QF9oZWFkaW5nICs9IDM2MFxuXG5cdFx0QF9lbGV2YXRpb24gKz0gZGVsdGFIZWlnaHRcblx0XHRAX2VsZXZhdGlvbiA9IFV0aWxzLmNsYW1wKEBfZWxldmF0aW9uLCAtOTAsIDkwKVxuXG5cdFx0cm90YXRpb24gPSB0cmFuc2xhdGlvblogKyB0cmFuc2xhdGlvblggKyB0cmFuc2xhdGlvblkgKyBcIiByb3RhdGVYKCN7QF9lbGV2YXRpb24gKyA5MH1kZWcpIHJvdGF0ZVooI3szNjAgLSBAX2hlYWRpbmd9ZGVnKVwiICsgXCIgcm90YXRlWigjey1AX2hlYWRpbmdPZmZzZXR9ZGVnKVwiXG5cdFx0QHdvcmxkLnN0eWxlW1wid2Via2l0VHJhbnNmb3JtXCJdID0gcm90YXRpb25cblxuXHRcdEBfaGVhZGluZyA9IE1hdGgucm91bmQoQF9oZWFkaW5nICogMTAwMCkgLyAxMDAwXG5cdFx0QF90aWx0ID0gMFxuXHRcdEBfZW1pdE9yaWVudGF0aW9uRGlkQ2hhbmdlRXZlbnQoKVxuXG5cdGxvb2tBdDogKGhlYWRpbmcsIGVsZXZhdGlvbikgLT5cblx0XHRoYWxmQ3ViZVNpZGUgPSBAY3ViZVNpZGUvMlxuXHRcdHRyYW5zbGF0aW9uWCA9IFwidHJhbnNsYXRlWCgjeyhAd2lkdGggLyAyKSAtIGhhbGZDdWJlU2lkZX1weClcIlxuXHRcdHRyYW5zbGF0aW9uWSA9IFwiIHRyYW5zbGF0ZVkoI3soQGhlaWdodCAvIDIpIC0gaGFsZkN1YmVTaWRlfXB4KVwiXG5cdFx0dHJhbnNsYXRpb25aID0gXCIgdHJhbnNsYXRlWigje0BwZXJzcGVjdGl2ZX1weClcIlxuXHRcdHJvdGF0aW9uID0gdHJhbnNsYXRpb25aICsgdHJhbnNsYXRpb25YICsgdHJhbnNsYXRpb25ZICsgXCIgcm90YXRlWigje0BfdGlsdH1kZWcpIHJvdGF0ZVgoI3tlbGV2YXRpb24gKyA5MH1kZWcpIHJvdGF0ZVooI3staGVhZGluZ31kZWcpXCJcblxuXHRcdEB3b3JsZD8uc3R5bGVbXCJ3ZWJraXRUcmFuc2Zvcm1cIl0gPSByb3RhdGlvblxuXHRcdEBfaGVhZGluZyA9IGhlYWRpbmdcblx0XHRAX2VsZXZhdGlvbiA9IGVsZXZhdGlvblxuXHRcdGlmIFV0aWxzLmlzTW9iaWxlKClcblx0XHRcdEBfaGVhZGluZ09mZnNldCA9IEBfaGVhZGluZyAtIEBfZGV2aWNlSGVhZGluZ1xuXG5cdFx0QF9lbGV2YXRpb25PZmZzZXQgPSBAX2VsZXZhdGlvbiAtIEBfZGV2aWNlRWxldmF0aW9uXG5cblx0XHRoZWFkaW5nID0gQF9oZWFkaW5nXG5cdFx0aWYgaGVhZGluZyA8IDBcblx0XHRcdGhlYWRpbmcgKz0gMzYwXG5cdFx0ZWxzZSBpZiBoZWFkaW5nID4gMzYwXG5cdFx0XHRoZWFkaW5nIC09IDM2MFxuXG5cdFx0QGVtaXQoRXZlbnRzLk9yaWVudGF0aW9uRGlkQ2hhbmdlLCB7aGVhZGluZzogaGVhZGluZywgZWxldmF0aW9uOiBAX2VsZXZhdGlvbiwgdGlsdDogQF90aWx0fSlcblxuXHRfZW1pdE9yaWVudGF0aW9uRGlkQ2hhbmdlRXZlbnQ6IC0+XG5cdFx0QGVtaXQoRXZlbnRzLk9yaWVudGF0aW9uRGlkQ2hhbmdlLCB7aGVhZGluZzogQGhlYWRpbmcsIGVsZXZhdGlvbjogQF9lbGV2YXRpb24sIHRpbHQ6IEBfdGlsdH0pXG5cblx0IyBldmVudCBzaG9ydGN1dHNcblxuXHRvbk9yaWVudGF0aW9uQ2hhbmdlOihjYikgLT4gQG9uKEV2ZW50cy5PcmllbnRhdGlvbkRpZENoYW5nZSwgY2IpXG4iLCIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUNBQTtBREFBO0FBQUEsSUFBQSxvQ0FBQTtFQUFBOzs7OztBQXNDQSxLQUFBLEdBQVEsQ0FDUCxPQURPLEVBRVAsT0FGTyxFQUdQLE1BSE8sRUFJUCxPQUpPLEVBS1AsT0FMTyxFQU1QLE1BTk8sRUFPUCxNQVBPLEVBUVAsTUFSTyxFQVNQLEtBVE8sRUFVUCxRQVZPOztBQWFSLElBQUEsR0FBTztFQUNOLFNBQUEsRUFBVyxFQURMO0VBRU4sT0FBQSxFQUFTLEVBRkg7RUFHTixVQUFBLEVBQVksRUFITjtFQUlOLFNBQUEsRUFBVyxFQUpMOzs7QUFPUCxRQUFBLEdBQVc7RUFDVixJQUFBLEVBQU0sS0FESTtFQUVWLEVBQUEsRUFBSSxLQUZNO0VBR1YsS0FBQSxFQUFPLEtBSEc7RUFJVixJQUFBLEVBQU0sS0FKSTs7O0FBT1gsTUFBTSxDQUFDLG9CQUFQLEdBQThCOztBQUV4Qjs7O0VBRVEsdUJBQUMsS0FBRCxFQUFRLFFBQVI7SUFDWiwrQ0FBTSxNQUFOO0lBQ0EsSUFBQyxDQUFBLEtBQUQsR0FBUztJQUNULElBQUMsQ0FBQSxNQUFELEdBQVU7SUFDVixJQUFDLENBQUEsSUFBRCxHQUFRO0lBQ1IsSUFBQyxDQUFBLElBQUQsR0FBUTtJQUNSLElBQUMsQ0FBQSxRQUFELEdBQVk7SUFFWixJQUFDLENBQUEsS0FBRCxHQUFTO0lBQ1QsS0FBSyxDQUFDLFVBQU4sR0FBbUI7SUFDbkIsS0FBSyxDQUFDLE1BQU4sQ0FBQTtJQUVBLEtBQUssQ0FBQyxFQUFOLENBQVMsb0JBQVQsRUFBK0IsQ0FBQSxTQUFBLEtBQUE7YUFBQSxTQUFDLFFBQUQsRUFBVyxLQUFYO2VBQzlCLEtBQUMsQ0FBQSxjQUFELENBQWdCLEtBQWhCO01BRDhCO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEvQjtJQUVBLElBQUMs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
