var swfobject = function() {
  function callDomLoadFunctions() {
    if (isDomLoaded) {
      return;
    }
    try {
      var tabPage = doc.getElementsByTagName("body")[0].appendChild(createElement("span"));
      tabPage.parentNode.removeChild(tabPage);
    } catch (aa) {
      return;
    }
    /** @type {boolean} */
    isDomLoaded = true;
    /** @type {number} */
    var dl = domLoadFnArr.length;
    /** @type {number} */
    var i = 0;
    for (;i < dl;i++) {
      domLoadFnArr[i]();
    }
  }
  /**
   * @param {Function} fn
   * @return {undefined}
   */
  function addDomLoadEvent(fn) {
    if (isDomLoaded) {
      fn();
    } else {
      /** @type {Function} */
      domLoadFnArr[domLoadFnArr.length] = fn;
    }
  }
  /**
   * @param {Function} fn
   * @return {undefined}
   */
  function addLoadEvent(fn) {
    if (typeof win.addEventListener != UNDEF) {
      win.addEventListener("load", fn, false);
    } else {
      if (typeof doc.addEventListener != UNDEF) {
        doc.addEventListener("load", fn, false);
      } else {
        if (typeof win.attachEvent != UNDEF) {
          addListener(win, "onload", fn);
        } else {
          if (typeof win.onload == "function") {
            var fnOld = win.onload;
            /**
             * @return {undefined}
             */
            win.onload = function() {
              fnOld();
              fn();
            };
          } else {
            /** @type {Function} */
            win.onload = fn;
          }
        }
      }
    }
  }
  /**
   * @return {undefined}
   */
  function main() {
    if (T) {
      testPlayerVersion();
    } else {
      matchVersions();
    }
  }
  /**
   * @return {undefined}
   */
  function testPlayerVersion() {
    var head = doc.getElementsByTagName("body")[0];
    var o = createElement(OBJECT);
    o.setAttribute("type", FLASH_MIME_TYPE);
    var t = head.appendChild(o);
    if (t) {
      /** @type {number} */
      var Y = 0;
      (function() {
        if (typeof t.GetVariable != UNDEF) {
          var d = t.GetVariable("$version");
          if (d) {
            d = d.split(" ")[1].split(",");
            /** @type {Array} */
            ua.pv = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
          }
        } else {
          if (Y < 10) {
            Y++;
            setTimeout(arguments.callee, 10);
            return;
          }
        }
        head.removeChild(o);
        /** @type {null} */
        t = null;
        matchVersions();
      })();
    } else {
      matchVersions();
    }
  }
  /**
   * @return {undefined}
   */
  function matchVersions() {
    /** @type {number} */
    var valuesLen = regObjArr.length;
    if (valuesLen > 0) {
      /** @type {number} */
      var i = 0;
      for (;i < valuesLen;i++) {
        var id = regObjArr[i].id;
        var cb = regObjArr[i].callbackFn;
        var cbObj = {
          success : false,
          id : id
        };
        if (ua.pv[0] > 0) {
          var obj = getElementById(id);
          if (obj) {
            if (hasPlayerVersion(regObjArr[i].swfVersion) && !(ua.wk && ua.wk < 312)) {
              setVisibility(id, true);
              if (cb) {
                /** @type {boolean} */
                cbObj.success = true;
                cbObj.ref = getObjectById(id);
                cb(cbObj);
              }
            } else {
              if (regObjArr[i].expressInstall && canExpressInstall()) {
                var att = {};
                att.data = regObjArr[i].expressInstall;
                att.width = obj.getAttribute("width") || "0";
                att.height = obj.getAttribute("height") || "0";
                if (obj.getAttribute("class")) {
                  att.styleclass = obj.getAttribute("class");
                }
                if (obj.getAttribute("align")) {
                  att.align = obj.getAttribute("align");
                }
                var par = {};
                var p = obj.getElementsByTagName("param");
                var pl = p.length;
                /** @type {number} */
                var j = 0;
                for (;j < pl;j++) {
                  if (p[j].getAttribute("name").toLowerCase() != "movie") {
                    par[p[j].getAttribute("name")] = p[j].getAttribute("value");
                  }
                }
                showExpressInstall(att, par, id, cb);
              } else {
                displayAltContent(obj);
                if (cb) {
                  cb(cbObj);
                }
              }
            }
          }
        } else {
          setVisibility(id, true);
          if (cb) {
            var o = getObjectById(id);
            if (o && typeof o.SetVariable != UNDEF) {
              /** @type {boolean} */
              cbObj.success = true;
              cbObj.ref = o;
            }
            cb(cbObj);
          }
        }
      }
    }
  }
  /**
   * @param {string} objectIdStr
   * @return {?}
   */
  function getObjectById(objectIdStr) {
    /** @type {null} */
    var r = null;
    var o = getElementById(objectIdStr);
    if (o && o.nodeName == "OBJECT") {
      if (typeof o.SetVariable != UNDEF) {
        r = o;
      } else {
        var tmp = o.getElementsByTagName(OBJECT)[0];
        if (tmp) {
          r = tmp;
        }
      }
    }
    return r;
  }
  /**
   * @return {?}
   */
  function canExpressInstall() {
    return!a && (hasPlayerVersion("6.0.65") && ((ua.win || ua.mac) && !(ua.wk && ua.wk < 312)));
  }
  /**
   * @param {Object} att
   * @param {?} par
   * @param {string} replaceElemIdStr
   * @param {(Element|string)} callbackFn
   * @return {undefined}
   */
  function showExpressInstall(att, par, replaceElemIdStr, callbackFn) {
    /** @type {boolean} */
    a = true;
    storedCallbackFn = callbackFn || null;
    storedCallbackObj = {
      success : false,
      id : replaceElemIdStr
    };
    var obj = getElementById(replaceElemIdStr);
    if (obj) {
      if (obj.nodeName == "OBJECT") {
        storedAltContent = abstractAltContent(obj);
        /** @type {null} */
        storedAltContentId = null;
      } else {
        storedAltContent = obj;
        /** @type {string} */
        storedAltContentId = replaceElemIdStr;
      }
      /** @type {string} */
      att.id = EXPRESS_INSTALL_ID;
      if (typeof att.width == UNDEF || !/%$/.test(att.width) && parseInt(att.width, 10) < 310) {
        /** @type {string} */
        att.width = "310";
      }
      if (typeof att.height == UNDEF || !/%$/.test(att.height) && parseInt(att.height, 10) < 137) {
        /** @type {string} */
        att.height = "137";
      }
      /** @type {string} */
      doc.title = doc.title.slice(0, 47) + " - Flash Player Installation";
      /** @type {string} */
      var pt = ua.ie && ua.win ? "ActiveX" : "PlugIn";
      /** @type {string} */
      var fv = "MMredirectURL=" + win.location.toString().replace(/&/g, "%26") + "&MMplayerType=" + pt + "&MMdoctitle=" + doc.title;
      if (typeof par.flashvars != UNDEF) {
        par.flashvars += "&" + fv;
      } else {
        /** @type {string} */
        par.flashvars = fv;
      }
      if (ua.ie && (ua.win && obj.readyState != 4)) {
        var newObj = createElement("div");
        replaceElemIdStr += "SWFObjectNew";
        newObj.setAttribute("id", replaceElemIdStr);
        obj.parentNode.insertBefore(newObj, obj);
        /** @type {string} */
        obj.style.display = "none";
        (function() {
          if (obj.readyState == 4) {
            obj.parentNode.removeChild(obj);
          } else {
            setTimeout(arguments.callee, 10);
          }
        })();
      }
      createSWF(att, par, replaceElemIdStr);
    }
  }
  /**
   * @param {Object} obj
   * @return {undefined}
   */
  function displayAltContent(obj) {
    if (ua.ie && (ua.win && obj.readyState != 4)) {
      var el = createElement("div");
      obj.parentNode.insertBefore(el, obj);
      el.parentNode.replaceChild(abstractAltContent(obj), el);
      /** @type {string} */
      obj.style.display = "none";
      (function() {
        if (obj.readyState == 4) {
          obj.parentNode.removeChild(obj);
        } else {
          setTimeout(arguments.callee, 10);
        }
      })();
    } else {
      obj.parentNode.replaceChild(abstractAltContent(obj), obj);
    }
  }
  /**
   * @param {Node} obj
   * @return {?}
   */
  function abstractAltContent(obj) {
    var ac = createElement("div");
    if (ua.win && ua.ie) {
      ac.innerHTML = obj.innerHTML;
    } else {
      var nestedObj = obj.getElementsByTagName(OBJECT)[0];
      if (nestedObj) {
        var c = nestedObj.childNodes;
        if (c) {
          var cl = c.length;
          /** @type {number} */
          var i = 0;
          for (;i < cl;i++) {
            if (!(c[i].nodeType == 1 && c[i].nodeName == "PARAM") && !(c[i].nodeType == 8)) {
              ac.appendChild(c[i].cloneNode(true));
            }
          }
        }
      }
    }
    return ac;
  }
  /**
   * @param {Object} attObj
   * @param {Object} parObj
   * @param {string} id
   * @return {?}
   */
  function createSWF(attObj, parObj, id) {
    var r;
    var el = getElementById(id);
    if (ua.wk && ua.wk < 312) {
      return r;
    }
    if (el) {
      if (typeof attObj.id == UNDEF) {
        /** @type {string} */
        attObj.id = id;
      }
      if (ua.ie && ua.win) {
        /** @type {string} */
        var optsData = "";
        var i;
        for (i in attObj) {
          if (attObj[i] != Object.prototype[i]) {
            if (i.toLowerCase() == "data") {
              parObj.movie = attObj[i];
            } else {
              if (i.toLowerCase() == "styleclass") {
                optsData += ' class="' + attObj[i] + '"';
              } else {
                if (i.toLowerCase() != "classid") {
                  optsData += " " + i + '="' + attObj[i] + '"';
                }
              }
            }
          }
        }
        /** @type {string} */
        var urlConfigHtml = "";
        var j;
        for (j in parObj) {
          if (parObj[j] != Object.prototype[j]) {
            urlConfigHtml += '<param name="' + j + '" value="' + parObj[j] + '" />';
          }
        }
        /** @type {string} */
        el.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + optsData + ">" + urlConfigHtml + "</object>";
        objIdArr[objIdArr.length] = attObj.id;
        r = getElementById(attObj.id);
      } else {
        var o = createElement(OBJECT);
        o.setAttribute("type", FLASH_MIME_TYPE);
        var m;
        for (m in attObj) {
          if (attObj[m] != Object.prototype[m]) {
            if (m.toLowerCase() == "styleclass") {
              o.setAttribute("class", attObj[m]);
            } else {
              if (m.toLowerCase() != "classid") {
                o.setAttribute(m, attObj[m]);
              }
            }
          }
        }
        var n;
        for (n in parObj) {
          if (parObj[n] != Object.prototype[n] && n.toLowerCase() != "movie") {
            createObjParam(o, n, parObj[n]);
          }
        }
        el.parentNode.replaceChild(o, el);
        r = o;
      }
    }
    return r;
  }
  /**
   * @param {Element} el
   * @param {string} pName
   * @param {?} pValue
   * @return {undefined}
   */
  function createObjParam(el, pName, pValue) {
    var p = createElement("param");
    p.setAttribute("name", pName);
    p.setAttribute("value", pValue);
    el.appendChild(p);
  }
  /**
   * @param {string} id
   * @return {undefined}
   */
  function removeSWF(id) {
    var obj = getElementById(id);
    if (obj && obj.nodeName == "OBJECT") {
      if (ua.ie && ua.win) {
        /** @type {string} */
        obj.style.display = "none";
        (function() {
          if (obj.readyState == 4) {
            removeObjectInIE(id);
          } else {
            setTimeout(arguments.callee, 10);
          }
        })();
      } else {
        obj.parentNode.removeChild(obj);
      }
    }
  }
  /**
   * @param {string} id
   * @return {undefined}
   */
  function removeObjectInIE(id) {
    var obj = getElementById(id);
    if (obj) {
      var prop;
      for (prop in obj) {
        if (typeof obj[prop] == "function") {
          /** @type {null} */
          obj[prop] = null;
        }
      }
      obj.parentNode.removeChild(obj);
    }
  }
  /**
   * @param {string} id
   * @return {?}
   */
  function getElementById(id) {
    /** @type {null} */
    var el = null;
    try {
      /** @type {(HTMLElement|null)} */
      el = doc.getElementById(id);
    } catch (Y) {
    }
    return el;
  }
  /**
   * @param {string} el
   * @return {?}
   */
  function createElement(el) {
    return doc.createElement(el);
  }
  /**
   * @param {Object} target
   * @param {string} eventType
   * @param {Function} fn
   * @return {undefined}
   */
  function addListener(target, eventType, fn) {
    target.attachEvent(eventType, fn);
    /** @type {Array} */
    listenersArr[listenersArr.length] = [target, eventType, fn];
  }
  /**
   * @param {string} rv
   * @return {?}
   */
  function hasPlayerVersion(rv) {
    var pv = ua.pv;
    var v = rv.split(".");
    /** @type {number} */
    v[0] = parseInt(v[0], 10);
    /** @type {number} */
    v[1] = parseInt(v[1], 10) || 0;
    /** @type {number} */
    v[2] = parseInt(v[2], 10) || 0;
    return pv[0] > v[0] || (pv[0] == v[0] && pv[1] > v[1] || pv[0] == v[0] && (pv[1] == v[1] && pv[2] >= v[2])) ? true : false;
  }
  /**
   * @param {string} sel
   * @param {string} decl
   * @param {string} media
   * @param {?} deepDataAndEvents
   * @return {undefined}
   */
  function createCSS(sel, decl, media, deepDataAndEvents) {
    if (ua.ie && ua.mac) {
      return;
    }
    var svg = doc.getElementsByTagName("head")[0];
    if (!svg) {
      return;
    }
    var m = media && typeof media == "string" ? media : "screen";
    if (deepDataAndEvents) {
      /** @type {null} */
      dynamicStylesheet = null;
      /** @type {null} */
      dynamicStylesheetMedia = null;
    }
    if (!dynamicStylesheet || dynamicStylesheetMedia != m) {
      var s = createElement("style");
      s.setAttribute("type", "text/css");
      s.setAttribute("media", m);
      dynamicStylesheet = svg.appendChild(s);
      if (ua.ie && (ua.win && (typeof doc.styleSheets != UNDEF && doc.styleSheets.length > 0))) {
        dynamicStylesheet = doc.styleSheets[doc.styleSheets.length - 1];
      }
      dynamicStylesheetMedia = m;
    }
    if (ua.ie && ua.win) {
      if (dynamicStylesheet && typeof dynamicStylesheet.addRule == OBJECT) {
        dynamicStylesheet.addRule(sel, decl);
      }
    } else {
      if (dynamicStylesheet && typeof doc.createTextNode != UNDEF) {
        dynamicStylesheet.appendChild(doc.createTextNode(sel + " {" + decl + "}"));
      }
    }
  }
  /**
   * @param {?} id
   * @param {boolean} recurring
   * @return {undefined}
   */
  function setVisibility(id, recurring) {
    if (!m) {
      return;
    }
    /** @type {string} */
    var v = recurring ? "visible" : "hidden";
    if (isDomLoaded && getElementById(id)) {
      /** @type {string} */
      getElementById(id).style.visibility = v;
    } else {
      createCSS("#" + id, "visibility:" + v);
    }
  }
  /**
   * @param {?} s
   * @return {?}
   */
  function urlEncodeIfNecessary(s) {
    /** @type {RegExp} */
    var re = /[\\\"<>\.;]/;
    /** @type {boolean} */
    var hasBadChars = re.exec(s) != null;
    return hasBadChars && typeof encodeURIComponent != UNDEF ? encodeURIComponent(s) : s;
  }
  /** @type {string} */
  var UNDEF = "undefined";
  /** @type {string} */
  var OBJECT = "object";
  /** @type {string} */
  var SHOCKWAVE_FLASH = "Shockwave Flash";
  /** @type {string} */
  var SHOCKWAVE_FLASH_AX = "ShockwaveFlash.ShockwaveFlash";
  /** @type {string} */
  var FLASH_MIME_TYPE = "application/x-shockwave-flash";
  /** @type {string} */
  var EXPRESS_INSTALL_ID = "SWFObjectExprInst";
  /** @type {string} */
  var ON_READY_STATE_CHANGE = "onreadystatechange";
  /** @type {Window} */
  var win = window;
  /** @type {HTMLDocument} */
  var doc = document;
  /** @type {(Navigator|null)} */
  var nav = navigator;
  /** @type {boolean} */
  var T = false;
  /** @type {Array} */
  var domLoadFnArr = [main];
  /** @type {Array} */
  var regObjArr = [];
  /** @type {Array} */
  var objIdArr = [];
  /** @type {Array} */
  var listenersArr = [];
  var storedAltContent;
  var storedAltContentId;
  var storedCallbackFn;
  var storedCallbackObj;
  /** @type {boolean} */
  var isDomLoaded = false;
  /** @type {boolean} */
  var a = false;
  var dynamicStylesheet;
  var dynamicStylesheetMedia;
  /** @type {boolean} */
  var m = true;
  var ua = function() {
    /** @type {boolean} */
    var w3cdom = typeof doc.getElementById != UNDEF && (typeof doc.getElementsByTagName != UNDEF && typeof doc.createElement != UNDEF);
    /** @type {string} */
    var u = nav.userAgent.toLowerCase();
    /** @type {string} */
    var p = nav.platform.toLowerCase();
    /** @type {boolean} */
    var windows = p ? /win/.test(p) : /win/.test(u);
    /** @type {boolean} */
    var mac = p ? /mac/.test(p) : /mac/.test(u);
    /** @type {(boolean|number)} */
    var webkit = /webkit/.test(u) ? parseFloat(u.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : false;
    /** @type {boolean} */
    var ie = !+"\v1";
    /** @type {Array} */
    var playerVersion = [0, 0, 0];
    /** @type {null} */
    var d = null;
    if (typeof nav.plugins != UNDEF && typeof nav.plugins[SHOCKWAVE_FLASH] == OBJECT) {
      d = nav.plugins[SHOCKWAVE_FLASH].description;
      if (d && !(typeof nav.mimeTypes != UNDEF && (nav.mimeTypes[FLASH_MIME_TYPE] && !nav.mimeTypes[FLASH_MIME_TYPE].enabledPlugin))) {
        /** @type {boolean} */
        T = true;
        /** @type {boolean} */
        ie = false;
        d = d.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
        /** @type {number} */
        playerVersion[0] = parseInt(d.replace(/^(.*)\..*$/, "$1"), 10);
        /** @type {number} */
        playerVersion[1] = parseInt(d.replace(/^.*\.(.*)\s.*$/, "$1"), 10);
        /** @type {number} */
        playerVersion[2] = /[a-zA-Z]/.test(d) ? parseInt(d.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0;
      }
    } else {
      if (typeof win.ActiveXObject != UNDEF) {
        try {
          var a = new ActiveXObject(SHOCKWAVE_FLASH_AX);
          if (a) {
            d = a.GetVariable("$version");
            if (d) {
              /** @type {boolean} */
              ie = true;
              d = d.split(" ")[1].split(",");
              /** @type {Array} */
              playerVersion = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
            }
          }
        } catch (Z) {
        }
      }
    }
    return{
      w3 : w3cdom,
      pv : playerVersion,
      wk : webkit,
      ie : ie,
      win : windows,
      mac : mac
    };
  }();
  var k = function() {
    if (!ua.w3) {
      return;
    }
    if (typeof doc.readyState != UNDEF && doc.readyState == "complete" || typeof doc.readyState == UNDEF && (doc.getElementsByTagName("body")[0] || doc.body)) {
      callDomLoadFunctions();
    }
    if (!isDomLoaded) {
      if (typeof doc.addEventListener != UNDEF) {
        doc.addEventListener("DOMContentLoaded", callDomLoadFunctions, false);
      }
      if (ua.ie && ua.win) {
        doc.attachEvent(ON_READY_STATE_CHANGE, function() {
          if (doc.readyState == "complete") {
            doc.detachEvent(ON_READY_STATE_CHANGE, arguments.callee);
            callDomLoadFunctions();
          }
        });
        if (win == top) {
          (function() {
            if (isDomLoaded) {
              return;
            }
            try {
              doc.documentElement.doScroll("left");
            } catch (X) {
              setTimeout(arguments.callee, 0);
              return;
            }
            callDomLoadFunctions();
          })();
        }
      }
      if (ua.wk) {
        (function() {
          if (isDomLoaded) {
            return;
          }
          if (!/loaded|complete/.test(doc.readyState)) {
            setTimeout(arguments.callee, 0);
            return;
          }
          callDomLoadFunctions();
        })();
      }
      addLoadEvent(callDomLoadFunctions);
    }
  }();
  var d = function() {
    if (ua.ie && ua.win) {
      window.attachEvent("onunload", function() {
        /** @type {number} */
        var valuesLen = listenersArr.length;
        /** @type {number} */
        var i = 0;
        for (;i < valuesLen;i++) {
          listenersArr[i][0].detachEvent(listenersArr[i][1], listenersArr[i][2]);
        }
        /** @type {number} */
        var jl = objIdArr.length;
        /** @type {number} */
        var j = 0;
        for (;j < jl;j++) {
          removeSWF(objIdArr[j]);
        }
        var k;
        for (k in ua) {
          /** @type {null} */
          ua[k] = null;
        }
        /** @type {null} */
        ua = null;
        var l;
        for (l in swfobject) {
          /** @type {null} */
          swfobject[l] = null;
        }
        /** @type {null} */
        swfobject = null;
      });
    }
  }();
  return{
    /**
     * @param {?} objectIdStr
     * @param {string} swfVersionStr
     * @param {string} xiSwfUrlStr
     * @param {?} callbackFn
     * @return {undefined}
     */
    registerObject : function(objectIdStr, swfVersionStr, xiSwfUrlStr, callbackFn) {
      if (ua.w3 && (objectIdStr && swfVersionStr)) {
        var regObj = {};
        regObj.id = objectIdStr;
        /** @type {string} */
        regObj.swfVersion = swfVersionStr;
        /** @type {string} */
        regObj.expressInstall = xiSwfUrlStr;
        regObj.callbackFn = callbackFn;
        regObjArr[regObjArr.length] = regObj;
        setVisibility(objectIdStr, false);
      } else {
        if (callbackFn) {
          callbackFn({
            success : false,
            id : objectIdStr
          });
        }
      }
    },
    /**
     * @param {string} objectIdStr
     * @return {?}
     */
    getObjectById : function(objectIdStr) {
      if (ua.w3) {
        return getObjectById(objectIdStr);
      }
    },
    /**
     * @param {?} swfUrlStr
     * @param {?} replaceElemIdStr
     * @param {string} widthStr
     * @param {string} heightStr
     * @param {string} swfVersionStr
     * @param {?} xiSwfUrlStr
     * @param {Object} flashvarsObj
     * @param {Object} parObj
     * @param {Object} attObj
     * @param {(Element|string)} callbackFn
     * @return {undefined}
     */
    embedSWF : function(swfUrlStr, replaceElemIdStr, widthStr, heightStr, swfVersionStr, xiSwfUrlStr, flashvarsObj, parObj, attObj, callbackFn) {
      var callbackObj = {
        success : false,
        id : replaceElemIdStr
      };
      if (ua.w3 && (!(ua.wk && ua.wk < 312) && (swfUrlStr && (replaceElemIdStr && (widthStr && (heightStr && swfVersionStr)))))) {
        setVisibility(replaceElemIdStr, false);
        addDomLoadEvent(function() {
          widthStr += "";
          heightStr += "";
          var att = {};
          if (attObj && typeof attObj === OBJECT) {
            var i;
            for (i in attObj) {
              att[i] = attObj[i];
            }
          }
          att.data = swfUrlStr;
          /** @type {string} */
          att.width = widthStr;
          /** @type {string} */
          att.height = heightStr;
          var par = {};
          if (parObj && typeof parObj === OBJECT) {
            var j;
            for (j in parObj) {
              par[j] = parObj[j];
            }
          }
          if (flashvarsObj && typeof flashvarsObj === OBJECT) {
            var k;
            for (k in flashvarsObj) {
              if (typeof par.flashvars != UNDEF) {
                par.flashvars += "&" + k + "=" + flashvarsObj[k];
              } else {
                par.flashvars = k + "=" + flashvarsObj[k];
              }
            }
          }
          if (hasPlayerVersion(swfVersionStr)) {
            var obj = createSWF(att, par, replaceElemIdStr);
            if (att.id == replaceElemIdStr) {
              setVisibility(replaceElemIdStr, true);
            }
            /** @type {boolean} */
            callbackObj.success = true;
            callbackObj.ref = obj;
          } else {
            if (xiSwfUrlStr && canExpressInstall()) {
              att.data = xiSwfUrlStr;
              showExpressInstall(att, par, replaceElemIdStr, callbackFn);
              return;
            } else {
              setVisibility(replaceElemIdStr, true);
            }
          }
          if (callbackFn) {
            callbackFn(callbackObj);
          }
        });
      } else {
        if (callbackFn) {
          callbackFn(callbackObj);
        }
      }
    },
    /**
     * @return {undefined}
     */
    switchOffAutoHideShow : function() {
      /** @type {boolean} */
      m = false;
    },
    ua : ua,
    /**
     * @return {?}
     */
    getFlashPlayerVersion : function() {
      return{
        major : ua.pv[0],
        minor : ua.pv[1],
        release : ua.pv[2]
      };
    },
    /** @type {function (string): ?} */
    hasFlashPlayerVersion : hasPlayerVersion,
    /**
     * @param {Object} attObj
     * @param {Object} parObj
     * @param {string} replaceElemIdStr
     * @return {?}
     */
    createSWF : function(attObj, parObj, replaceElemIdStr) {
      if (ua.w3) {
        return createSWF(attObj, parObj, replaceElemIdStr);
      } else {
        return undefined;
      }
    },
    /**
     * @param {Object} att
     * @param {?} par
     * @param {string} replaceElemIdStr
     * @param {(Element|string)} callbackFn
     * @return {undefined}
     */
    showExpressInstall : function(att, par, replaceElemIdStr, callbackFn) {
      if (ua.w3 && canExpressInstall()) {
        showExpressInstall(att, par, replaceElemIdStr, callbackFn);
      }
    },
    /**
     * @param {string} objElemIdStr
     * @return {undefined}
     */
    removeSWF : function(objElemIdStr) {
      if (ua.w3) {
        removeSWF(objElemIdStr);
      }
    },
    /**
     * @param {string} selStr
     * @param {string} declStr
     * @param {string} mediaStr
     * @param {?} deepDataAndEvents
     * @return {undefined}
     */
    createCSS : function(selStr, declStr, mediaStr, deepDataAndEvents) {
      if (ua.w3) {
        createCSS(selStr, declStr, mediaStr, deepDataAndEvents);
      }
    },
    /** @type {function (Function): undefined} */
    addDomLoadEvent : addDomLoadEvent,
    /** @type {function (Function): undefined} */
    addLoadEvent : addLoadEvent,
    /**
     * @param {string} param
     * @return {?}
     */
    getQueryParamValue : function(param) {
      /** @type {string} */
      var q = doc.location.search || doc.location.hash;
      if (q) {
        if (/\?/.test(q)) {
          /** @type {string} */
          q = q.split("?")[1];
        }
        if (param == null) {
          return urlEncodeIfNecessary(q);
        }
        /** @type {Array.<string>} */
        var codeSegments = q.split("&");
        /** @type {number} */
        var i = 0;
        for (;i < codeSegments.length;i++) {
          if (codeSegments[i].substring(0, codeSegments[i].indexOf("=")) == param) {
            return urlEncodeIfNecessary(codeSegments[i].substring(codeSegments[i].indexOf("=") + 1));
          }
        }
      }
      return "";
    },
    /**
     * @return {undefined}
     */
    expressInstallCallback : function() {
      if (a) {
        var obj = getElementById(EXPRESS_INSTALL_ID);
        if (obj && storedAltContent) {
          obj.parentNode.replaceChild(storedAltContent, obj);
          if (storedAltContentId) {
            setVisibility(storedAltContentId, true);
            if (ua.ie && ua.win) {
              /** @type {string} */
              storedAltContent.style.display = "block";
            }
          }
          if (storedCallbackFn) {
            storedCallbackFn(storedCallbackObj);
          }
        }
        /** @type {boolean} */
        a = false;
      }
    }
  };
}();