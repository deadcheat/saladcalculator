// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"S39F":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.app = app;
exports.h = h;

function h(name, attributes) {
  var rest = [];
  var children = [];
  var length = arguments.length;

  while (length-- > 2) rest.push(arguments[length]);

  while (rest.length) {
    var node = rest.pop();

    if (node && node.pop) {
      for (length = node.length; length--;) {
        rest.push(node[length]);
      }
    } else if (node != null && node !== true && node !== false) {
      children.push(node);
    }
  }

  return typeof name === "function" ? name(attributes || {}, children) : {
    nodeName: name,
    attributes: attributes || {},
    children: children,
    key: attributes && attributes.key
  };
}

function app(state, actions, view, container) {
  var map = [].map;
  var rootElement = container && container.children[0] || null;
  var oldNode = rootElement && recycleElement(rootElement);
  var lifecycle = [];
  var skipRender;
  var isRecycling = true;
  var globalState = clone(state);
  var wiredActions = wireStateToActions([], globalState, clone(actions));
  scheduleRender();
  return wiredActions;

  function recycleElement(element) {
    return {
      nodeName: element.nodeName.toLowerCase(),
      attributes: {},
      children: map.call(element.childNodes, function (element) {
        return element.nodeType === 3 // Node.TEXT_NODE
        ? element.nodeValue : recycleElement(element);
      })
    };
  }

  function resolveNode(node) {
    return typeof node === "function" ? resolveNode(node(globalState, wiredActions)) : node != null ? node : "";
  }

  function render() {
    skipRender = !skipRender;
    var node = resolveNode(view);

    if (container && !skipRender) {
      rootElement = patch(container, rootElement, oldNode, oldNode = node);
    }

    isRecycling = false;

    while (lifecycle.length) lifecycle.pop()();
  }

  function scheduleRender() {
    if (!skipRender) {
      skipRender = true;
      setTimeout(render);
    }
  }

  function clone(target, source) {
    var out = {};

    for (var i in target) out[i] = target[i];

    for (var i in source) out[i] = source[i];

    return out;
  }

  function setPartialState(path, value, source) {
    var target = {};

    if (path.length) {
      target[path[0]] = path.length > 1 ? setPartialState(path.slice(1), value, source[path[0]]) : value;
      return clone(source, target);
    }

    return value;
  }

  function getPartialState(path, source) {
    var i = 0;

    while (i < path.length) {
      source = source[path[i++]];
    }

    return source;
  }

  function wireStateToActions(path, state, actions) {
    for (var key in actions) {
      typeof actions[key] === "function" ? function (key, action) {
        actions[key] = function (data) {
          var result = action(data);

          if (typeof result === "function") {
            result = result(getPartialState(path, globalState), actions);
          }

          if (result && result !== (state = getPartialState(path, globalState)) && !result.then // !isPromise
          ) {
            scheduleRender(globalState = setPartialState(path, clone(state, result), globalState));
          }

          return result;
        };
      }(key, actions[key]) : wireStateToActions(path.concat(key), state[key] = clone(state[key]), actions[key] = clone(actions[key]));
    }

    return actions;
  }

  function getKey(node) {
    return node ? node.key : null;
  }

  function eventListener(event) {
    return event.currentTarget.events[event.type](event);
  }

  function updateAttribute(element, name, value, oldValue, isSvg) {
    if (name === "key") {} else if (name === "style") {
      if (typeof value === "string") {
        element.style.cssText = value;
      } else {
        if (typeof oldValue === "string") oldValue = element.style.cssText = "";

        for (var i in clone(oldValue, value)) {
          var style = value == null || value[i] == null ? "" : value[i];

          if (i[0] === "-") {
            element.style.setProperty(i, style);
          } else {
            element.style[i] = style;
          }
        }
      }
    } else {
      if (name[0] === "o" && name[1] === "n") {
        name = name.slice(2);

        if (element.events) {
          if (!oldValue) oldValue = element.events[name];
        } else {
          element.events = {};
        }

        element.events[name] = value;

        if (value) {
          if (!oldValue) {
            element.addEventListener(name, eventListener);
          }
        } else {
          element.removeEventListener(name, eventListener);
        }
      } else if (name in element && name !== "list" && name !== "type" && name !== "draggable" && name !== "spellcheck" && name !== "translate" && !isSvg) {
        element[name] = value == null ? "" : value;
      } else if (value != null && value !== false) {
        element.setAttribute(name, value);
      }

      if (value == null || value === false) {
        element.removeAttribute(name);
      }
    }
  }

  function createElement(node, isSvg) {
    var element = typeof node === "string" || typeof node === "number" ? document.createTextNode(node) : (isSvg = isSvg || node.nodeName === "svg") ? document.createElementNS("http://www.w3.org/2000/svg", node.nodeName) : document.createElement(node.nodeName);
    var attributes = node.attributes;

    if (attributes) {
      if (attributes.oncreate) {
        lifecycle.push(function () {
          attributes.oncreate(element);
        });
      }

      for (var i = 0; i < node.children.length; i++) {
        element.appendChild(createElement(node.children[i] = resolveNode(node.children[i]), isSvg));
      }

      for (var name in attributes) {
        updateAttribute(element, name, attributes[name], null, isSvg);
      }
    }

    return element;
  }

  function updateElement(element, oldAttributes, attributes, isSvg) {
    for (var name in clone(oldAttributes, attributes)) {
      if (attributes[name] !== (name === "value" || name === "checked" ? element[name] : oldAttributes[name])) {
        updateAttribute(element, name, attributes[name], oldAttributes[name], isSvg);
      }
    }

    var cb = isRecycling ? attributes.oncreate : attributes.onupdate;

    if (cb) {
      lifecycle.push(function () {
        cb(element, oldAttributes);
      });
    }
  }

  function removeChildren(element, node) {
    var attributes = node.attributes;

    if (attributes) {
      for (var i = 0; i < node.children.length; i++) {
        removeChildren(element.childNodes[i], node.children[i]);
      }

      if (attributes.ondestroy) {
        attributes.ondestroy(element);
      }
    }

    return element;
  }

  function removeElement(parent, element, node) {
    function done() {
      parent.removeChild(removeChildren(element, node));
    }

    var cb = node.attributes && node.attributes.onremove;

    if (cb) {
      cb(element, done);
    } else {
      done();
    }
  }

  function patch(parent, element, oldNode, node, isSvg) {
    if (node === oldNode) {} else if (oldNode == null || oldNode.nodeName !== node.nodeName) {
      var newElement = createElement(node, isSvg);
      parent.insertBefore(newElement, element);

      if (oldNode != null) {
        removeElement(parent, element, oldNode);
      }

      element = newElement;
    } else if (oldNode.nodeName == null) {
      element.nodeValue = node;
    } else {
      updateElement(element, oldNode.attributes, node.attributes, isSvg = isSvg || node.nodeName === "svg");
      var oldKeyed = {};
      var newKeyed = {};
      var oldElements = [];
      var oldChildren = oldNode.children;
      var children = node.children;

      for (var i = 0; i < oldChildren.length; i++) {
        oldElements[i] = element.childNodes[i];
        var oldKey = getKey(oldChildren[i]);

        if (oldKey != null) {
          oldKeyed[oldKey] = [oldElements[i], oldChildren[i]];
        }
      }

      var i = 0;
      var k = 0;

      while (k < children.length) {
        var oldKey = getKey(oldChildren[i]);
        var newKey = getKey(children[k] = resolveNode(children[k]));

        if (newKeyed[oldKey]) {
          i++;
          continue;
        }

        if (newKey != null && newKey === getKey(oldChildren[i + 1])) {
          if (oldKey == null) {
            removeElement(element, oldElements[i], oldChildren[i]);
          }

          i++;
          continue;
        }

        if (newKey == null || isRecycling) {
          if (oldKey == null) {
            patch(element, oldElements[i], oldChildren[i], children[k], isSvg);
            k++;
          }

          i++;
        } else {
          var keyedNode = oldKeyed[newKey] || [];

          if (oldKey === newKey) {
            patch(element, keyedNode[0], keyedNode[1], children[k], isSvg);
            i++;
          } else if (keyedNode[0]) {
            patch(element, element.insertBefore(keyedNode[0], oldElements[i]), keyedNode[1], children[k], isSvg);
          } else {
            patch(element, oldElements[i], null, children[k], isSvg);
          }

          newKeyed[newKey] = children[k];
          k++;
        }
      }

      while (i < oldChildren.length) {
        if (getKey(oldChildren[i]) == null) {
          removeElement(element, oldElements[i], oldChildren[i]);
        }

        i++;
      }

      for (var i in oldKeyed) {
        if (!newKeyed[i]) {
          removeElement(element, oldKeyed[i][0], oldKeyed[i][1]);
        }
      }
    }

    return element;
  }
}
},{}],"bDxD":[function(require,module,exports) {

},{}],"AaGI":[function(require,module,exports) {
module.exports = "salad_small.68cb9ad3.png";
},{}],"OGgv":[function(require,module,exports) {
"use strict";

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  }
  result["default"] = mod;
  return result;
};

exports.__esModule = true;

var hyperapp_1 = require("hyperapp");

require("bulma/css/bulma.css");

var logo = __importStar(require("./assets/salad_small.png"));

var toppingCountMap = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
  7: 0,
  8: 0,
  9: 0,
  10: 0,
  11: 0,
  12: 0,
  13: 0,
  14: 0,
  15: 0,
  16: 0,
  17: 0,
  18: 0,
  19: 0,
  20: 0,
  21: 0,
  22: 0,
  23: 0,
  24: 0,
  25: 0,
  26: 0,
  27: 0,
  28: 0,
  29: 0,
  30: 0,
  31: 0,
  32: 0,
  33: 0,
  34: 0,
  35: 0,
  36: 0,
  37: 0,
  38: 0,
  39: 0,
  40: 0
};
var state = {
  total: 0,
  countMap: {
    "base": 0,
    "topping": 0,
    "dressing": 0
  },
  toppingCountMap: toppingCountMap
};
var baseIds = [1, 2, 3];
var baseCalorieMap = {
  1: 22,
  2: 14,
  3: 270
};
var toppingIds = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
var toppingCalorieMap = {
  4: 70,
  5: 60,
  6: 85,
  7: 85,
  8: 100,
  9: 8,
  10: 9,
  11: 20,
  12: 14,
  13: 10,
  14: 16,
  15: 1,
  16: 1,
  17: 29,
  18: 4,
  19: 16,
  20: 51,
  21: 55,
  22: 38,
  23: 34
};
var premiumIds = [24, 25, 26, 27, 28, 29];
var premiumCalorieMap = {
  24: 127,
  25: 157,
  26: 89,
  27: 83,
  28: 52,
  29: 47
};
var dressingIds = [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40];
var dressingCalorieMap = {
  30: 118,
  31: 92,
  32: 122,
  33: 91,
  34: 111,
  35: 191,
  36: 70,
  37: 153,
  38: 228,
  39: 2,
  40: 2
};
var toppingNameMapper = {
  1: "ロメインレタス",
  2: "ほうれん草",
  3: "ワイルドライス＋雑穀米",
  4: "自家製クルトン",
  5: "レーズン",
  6: "サンフラワーシード",
  7: "アーモンド",
  8: "ウォルナッツ",
  9: "スナップエンドウ",
  10: "セロリ",
  11: "キャロット",
  12: "赤玉ねぎ",
  13: "トマト",
  14: "赤キャベツ",
  15: "シラントロ",
  16: "バジル",
  17: "アップル",
  18: "オレンジ",
  19: "スパイシーブロッコリ",
  20: "グリルドコーン",
  21: "ブラックビーンズ",
  22: "ハードボイルド・エッグ",
  23: "ロースト豆腐",
  24: "グリルドチキン",
  25: "自家製ハム",
  26: "アボカド",
  27: "ホワイトチェダーチーズ",
  28: "フェタチーズ",
  29: "パルメザンチーズ",
  30: "バルサミックビネグレット",
  31: "バターミルクランチ",
  32: "クリーミーシラチャー",
  33: "メキシカンハニービネグレット",
  34: "シーザー",
  35: "レモンタヒに",
  36: "バジルオニオン",
  37: "キャロットチリビネグレット",
  38: "EXバージンオリーブオイル",
  39: "レモンスクイーズ",
  40: "ライムスクイーズ"
};
var actions = {
  addTopping: function addTopping(tId) {
    return function (state) {
      state.countMap.topping = state.countMap.topping + toppingCalorieMap[tId];
      state.toppingCountMap[tId] = state.toppingCountMap[tId] + 1;
      return;
    };
  },
  removeTopping: function removeTopping(tId) {
    return function (state) {
      if (state.toppingCountMap[tId] == 0) {
        return;
      }

      state.countMap.topping = state.countMap.topping - toppingCalorieMap[tId];
      state.toppingCountMap[tId] = state.toppingCountMap[tId] - 1;
      return;
    };
  },
  addPremiumTopping: function addPremiumTopping(tId) {
    return function (state) {
      state.countMap.topping = state.countMap.topping + premiumCalorieMap[tId];
      state.toppingCountMap[tId] = state.toppingCountMap[tId] + 1;
      return;
    };
  },
  removePremiumTopping: function removePremiumTopping(tId) {
    return function (state) {
      if (state.toppingCountMap[tId] == 0) {
        return;
      }

      state.countMap.topping = state.countMap.topping - premiumCalorieMap[tId];
      state.toppingCountMap[tId] = state.toppingCountMap[tId] - 1;
      return;
    };
  },
  setDressing: function setDressing(tId) {
    return function (state) {
      if (tId == 0 || dressingCalorieMap[tId] == 0) {
        return;
      }

      state.countMap.dressing = dressingCalorieMap[tId];
      return;
    };
  },
  setBase: function setBase(tId) {
    return function (state) {
      console.log(tId);

      if (tId == 0 || baseCalorieMap[tId] == 0) {
        return;
      }

      state.countMap.base = baseCalorieMap[tId];
      return;
    };
  },
  sum: function sum() {
    return function (state) {
      state.total = state.countMap.base + state.countMap.dressing + state.countMap.topping;
      return state;
    };
  },
  total: function total() {
    return function (total) {
      return state.countMap.base + state.countMap.dressing + state.countMap.topping;
    };
  },
  name: function name(tId) {
    return function (name) {
      return toppingNameMapper[tId];
    };
  },
  toppingCount: function toppingCount(tId) {
    return function (count) {
      return state.toppingCountMap[tId];
    };
  },
  toppingCalorie: function toppingCalorie(tId) {
    return function (count) {
      return toppingCalorieMap[tId];
    };
  },
  premiumToppingCalorie: function premiumToppingCalorie(tId) {
    return function (count) {
      return premiumCalorieMap[tId];
    };
  }
};

var view = function view(state, actions) {
  return hyperapp_1.h("div", {
    className: "container"
  }, hyperapp_1.h("nav", {
    "class": "navbar",
    role: "navigation",
    "aria-label": "main navigation"
  }, hyperapp_1.h("div", {
    "class": "navbar-brand"
  }, hyperapp_1.h("div", {
    "class": "navbar-item",
    href: ""
  }, hyperapp_1.h("img", {
    src: logo["default"],
    alt: "icon is here",
    width: "32",
    height: "28"
  }), "\xA0\u30AB\u30B9\u30BF\u30E0\u30B5\u30E9\u30C0\u306E\u30AB\u30ED\u30EA\u30FC\u8A08\u7B97\u3059\u308B\u3084\u30FC\u3064"))), hyperapp_1.h("div", null, hyperapp_1.h("header", null, hyperapp_1.h("section", {
    "class": "section hero is-bold is-danger"
  }, hyperapp_1.h("div", {
    "class": "hero-body"
  }, hyperapp_1.h("div", {
    "class": "container"
  }, hyperapp_1.h("div", {
    "class": "title is-bold is-danger"
  }, "\u3053\u306E\u30B5\u30E9\u30C0\u306E\u30AB\u30ED\u30EA\u30FC\uFF1A", actions.total, " KCal"), hyperapp_1.h("div", {
    "class": "title is-bold is-danger"
  }, "\u203B \u8868\u793A\u3055\u308C\u3066\u3044\u308B\u30AB\u30ED\u30EA\u30FC\u306F\u76EE\u5B89\u3068\u306A\u308A\u307E\u3059"))))), hyperapp_1.h("table", {
    "class": "table is-fullwidth"
  }, hyperapp_1.h("tr", null, hyperapp_1.h("td", null, hyperapp_1.h("div", {
    "class": "field"
  }, hyperapp_1.h("label", {
    "class": "label"
  }, "\u30B5\u30E9\u30C0\u306E\u30D9\u30FC\u30B9\u3092\u9078\u3073\u307E\u3059"), hyperapp_1.h("div", {
    "class": "select"
  }, hyperapp_1.h("form", {
    name: "baseform"
  }, hyperapp_1.h("select", {
    name: "base",
    onchange: function onchange(e) {
      actions.setBase(document.baseform.base.options[document.baseform.base.selectedIndex].value);
    }
  }, hyperapp_1.h("option", {
    value: "0",
    selected: true
  }, "\u304A\u9078\u3073\u304F\u3060\u3055\u3044"), baseIds.map(function (tId) {
    return hyperapp_1.h("option", {
      value: tId
    }, function () {
      return actions.name(tId);
    });
  })))))), hyperapp_1.h("td", null, hyperapp_1.h("div", {
    "class": "field"
  }, hyperapp_1.h("label", {
    "class": "label"
  }, "\u30C9\u30EC\u30C3\u30B7\u30F3\u30B0\u3092\u9078\u3073\u307E\u3059"), hyperapp_1.h("div", {
    "class": "select"
  }, hyperapp_1.h("form", {
    name: "dressingform"
  }, hyperapp_1.h("select", {
    name: "dressing",
    onchange: function onchange(e) {
      actions.setDressing(document.dressingform.dressing.options[document.dressingform.dressing.selectedIndex].value);
    }
  }, hyperapp_1.h("option", {
    value: "0",
    selected: true
  }, "\u304A\u9078\u3073\u304F\u3060\u3055\u3044"), dressingIds.map(function (tId) {
    return hyperapp_1.h("option", {
      value: tId
    }, function () {
      return actions.name(tId);
    });
  })))))))), hyperapp_1.h("div", {
    "class": "field"
  }, hyperapp_1.h("label", {
    "class": "label"
  }, "\u30C8\u30C3\u30D4\u30F3\u30B0\u3092\u9078\u3073\u307E\u3059\uFF08\uFF14\u3064\u307E\u3067\u7121\u6599\uFF09"), hyperapp_1.h("table", {
    className: "table is-striped is-hoverable is-fullwidth"
  }, hyperapp_1.h("thead", null, hyperapp_1.h("tr", null, hyperapp_1.h("th", null, "\u30C8\u30C3\u30D4\u30F3\u30B0"), hyperapp_1.h("th", null, "\uFF11\u5358\u4F4D\u3042\u305F\u308A\u306E\u30AB\u30ED\u30EA\u30FC"), hyperapp_1.h("th", null, "\u500B\u6570"))), hyperapp_1.h("tbody", null, toppingIds.map(function (tId) {
    return hyperapp_1.h("tr", null, hyperapp_1.h("td", null, function () {
      return actions.name(tId);
    }), hyperapp_1.h("td", null, function () {
      return actions.toppingCalorie(tId);
    }, "\xA0KCal"), hyperapp_1.h("td", null, function () {
      return actions.toppingCount(tId);
    }, "\xA0", hyperapp_1.h("button", {
      onclick: function onclick() {
        return actions.addTopping(tId);
      }
    }, "\xA0+\xA0"), "\xA0", hyperapp_1.h("button", {
      onclick: function onclick() {
        return actions.removeTopping(tId);
      }
    }, "\xA0-\xA0")));
  })))), hyperapp_1.h("div", {
    "class": "field"
  }, hyperapp_1.h("label", {
    "class": "label"
  }, "\u30D7\u30EC\u30DF\u30A2\u30E0\u30C8\u30C3\u30D4\u30F3\u30B0\u3092\u9078\u3073\u307E\u3059\uFF08\u8FFD\u52A0\u6599\u91D1\u304C\u304B\u304B\u308A\u307E\u3059\uFF09"), hyperapp_1.h("table", {
    className: "table is-striped is-hoverable is-fullwidth"
  }, hyperapp_1.h("thead", null, hyperapp_1.h("tr", null, hyperapp_1.h("th", null, "\u30C8\u30C3\u30D4\u30F3\u30B0"), hyperapp_1.h("th", null, "\uFF11\u5358\u4F4D\u3042\u305F\u308A\u306E\u30AB\u30ED\u30EA\u30FC"), hyperapp_1.h("th", null, "\u500B\u6570"))), hyperapp_1.h("tbody", null, premiumIds.map(function (tId) {
    return hyperapp_1.h("tr", null, hyperapp_1.h("td", null, function () {
      return actions.name(tId);
    }), hyperapp_1.h("td", null, function () {
      return actions.premiumToppingCalorie(tId);
    }, "\xA0KCal"), hyperapp_1.h("td", null, function () {
      return actions.toppingCount(tId);
    }, "\xA0", hyperapp_1.h("button", {
      onclick: function onclick() {
        return actions.addPremiumTopping(tId);
      }
    }, "\xA0+\xA0"), "\xA0", hyperapp_1.h("button", {
      onclick: function onclick() {
        return actions.removePremiumTopping(tId);
      }
    }, "\xA0-\xA0")));
  }))))));
};

var main = hyperapp_1.app(state, actions, view, document.body);
},{"hyperapp":"S39F","bulma/css/bulma.css":"bDxD","./assets/salad_small.png":"AaGI"}]},{},["OGgv"], null)