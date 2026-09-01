import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let initialized = false;

export function initSandboxApp() {
  if (initialized) {
    return () => {};
  }

  initialized = true;

  // 用 AbortController 统一管理 window 级事件监听，卸载时一次 abort 全部移除
  const eventController = new AbortController();
  const eventSignal = { signal: eventController.signal };
  const originalDocumentTitle = document.title;
  let rafId = null;

// 1. 数据定义
    const adultPaletteData = [
      // 绿色组 (大到小)
      { key: "item-15-green", shape: "peg", name: "15", hexColor: 0x4caf50, radius: 2.2, height: 6.5, head: 2.2, cssColor: "#4caf50" },
      { key: "item-14-green", shape: "cone-round", name: "14", hexColor: 0x4caf50, radius: 2.6, radiusTop: 1.2, height: 6.5, head: 2.2, cssColor: "#4caf50" },
      { key: "item-13-green", shape: "drop-point", name: "13", hexColor: 0x4caf50, radius: 2.4, height: 5.5, headWidth: 2.0, headHeight: 3.5, cssColor: "#4caf50" },
      { key: "item-12-green", shape: "flat-hat", name: "12", hexColor: 0x4caf50, radius: 2.4, height: 6, cssColor: "#4caf50" },
      { key: "item-11-green", shape: "pure-cone", name: "11", hexColor: 0x4caf50, radius: 2.2, height: 9.5, cssColor: "#4caf50" },
      { key: "item-10-green", shape: "peg", name: "10", hexColor: 0x4caf50, radius: 1.8, height: 6.0, head: 1.6, cssColor: "#4caf50" },
      { key: "item-9-green", shape: "cone-round", name: "9", hexColor: 0x4caf50, radius: 2.0, radiusTop: 1.0, height: 5.5, head: 1.5, cssColor: "#4caf50" },
      { key: "item-8-green", shape: "snowman", name: "8", hexColor: 0x4caf50, radius: 2.2, cssColor: "#4caf50" },

      // 积木组 (大到小)
      { key: "block-18-blue", shape: "cube", name: "18", hexColor: 0x3b8bcc, width: 3.5, depth: 3.5, height: 8.5, cssColor: "#3b8bcc" },
      { key: "block-17-green", shape: "cube", name: "17", hexColor: 0x6eb33b, width: 3.5, depth: 3.5, height: 6.5, cssColor: "#6eb33b" },
      { key: "block-16-red", shape: "cube", name: "16", hexColor: 0xdc4b38, width: 3.5, depth: 3.5, height: 4.5, cssColor: "#dc4b38" },
      
      // 直筒圆头组 (蓝/红交替，大到小)
      { key: "item-15-blue", shape: "peg", name: "15", hexColor: 0x3b8bcc, radius: 2.2, height: 6.5, head: 2.2, cssColor: "#3b8bcc" },
      { key: "item-15-red", shape: "peg", name: "15", hexColor: 0xdc4b38, radius: 2.2, height: 6.5, head: 2.2, cssColor: "#dc4b38" },
      { key: "item-10-blue", shape: "peg", name: "10", hexColor: 0x3b8bcc, radius: 1.8, height: 6.0, head: 1.6, cssColor: "#3b8bcc" },
      { key: "item-10-red", shape: "peg", name: "10", hexColor: 0xdc4b38, radius: 1.8, height: 6.0, head: 1.6, cssColor: "#dc4b38" },

      // 圆锥圆头组 (大到小)
      { key: "item-14-blue", shape: "cone-round", name: "14", hexColor: 0x3b8bcc, radius: 2.6, radiusTop: 1.2, height: 6.5, head: 2.2, cssColor: "#3b8bcc" },
      { key: "item-14-red", shape: "cone-round", name: "14", hexColor: 0xdc4b38, radius: 2.6, radiusTop: 1.2, height: 6.5, head: 2.2, cssColor: "#dc4b38" },
      { key: "item-9-blue", shape: "cone-round", name: "9", hexColor: 0x3b8bcc, radius: 2.0, radiusTop: 1.0, height: 5.5, head: 1.5, cssColor: "#3b8bcc" },
      { key: "item-9-red", shape: "cone-round", name: "9", hexColor: 0xdc4b38, radius: 2.0, radiusTop: 1.0, height: 5.5, head: 1.5, cssColor: "#dc4b38" },

      // 水滴尖头组
      { key: "item-13-blue", shape: "drop-point", name: "13", hexColor: 0x3b8bcc, radius: 2.4, height: 5.5, headWidth: 2.0, headHeight: 3.5, cssColor: "#3b8bcc" },
      { key: "item-13-red", shape: "drop-point", name: "13", hexColor: 0xdc4b38, radius: 2.4, height: 5.5, headWidth: 2.0, headHeight: 3.5, cssColor: "#dc4b38" },

      // 波浪扁帽组
      { key: "item-12-blue", shape: "flat-hat", name: "12", hexColor: 0x3b8bcc, radius: 2.4, height: 6, cssColor: "#3b8bcc" },
      { key: "item-12-red", shape: "flat-hat", name: "12", hexColor: 0xdc4b38, radius: 2.4, height: 6, cssColor: "#dc4b38" },

      // 纯圆锥组
      { key: "item-11-blue", shape: "pure-cone", name: "11", hexColor: 0x3b8bcc, radius: 2.2, height: 9.5, cssColor: "#3b8bcc" },
      { key: "item-11-red", shape: "pure-cone", name: "11", hexColor: 0xdc4b38, radius: 2.2, height: 9.5, cssColor: "#dc4b38" },

      // 葫芦形/雪人组
      { key: "item-8-blue", shape: "snowman", name: "8", hexColor: 0x3b8bcc, radius: 2.2, cssColor: "#3b8bcc" },
      { key: "item-8-red", shape: "snowman", name: "8", hexColor: 0xdc4b38, radius: 2.2, cssColor: "#dc4b38" },

      // 原木组 (大到小)
      { key: "wood-tall", shape: "peg", name: "原木高", hexColor: 0xe6ccaf, radius: 1.5, height: 9.0, head: 1.5, cssColor: "#e6ccaf" },
      { key: "wood-stout", shape: "cone-round", name: "原木胖", hexColor: 0xa87d55, radius: 3.0, radiusTop: 1.5, height: 4.5, head: 2.2, cssColor: "#a87d55" }
    ];

    const teachingToyColors = {
      red: { label: "红色", hexColor: 0xdc4b38, cssColor: "#dc4b38" },
      blue: { label: "蓝色", hexColor: 0x2f7fda, cssColor: "#2f7fda" },
      wood: { label: "原木色", hexColor: 0xd7bb95, cssColor: "#d7bb95" },
      green: { label: "绿色", hexColor: 0x4caf50, cssColor: "#4caf50" },
      yellow: { label: "黄色", hexColor: 0xe0b52f, cssColor: "#e0b52f" },
      gray: { label: "灰色", hexColor: 0xa4a8ae, cssColor: "#a4a8ae" }
    };

    const teachingToyRows = [
      "第一行（红色 1-9）",
      "第二行（蓝色 10-16）",
      "第三行（原木色 17-23）",
      "第四行（绿色 24-28）",
      "第五行（几何块 29-32）",
      "第六行（黄色 33-36）"
    ];

    function roundMetric(value) {
      return Math.round(value * 100) / 100;
    }

    function createTeachingToyMeta(no, rowIndex, base) {
      return {
        ...base,
        key: base.key || `toy-${String(no).padStart(2, "0")}`,
        name: base.name || `#${no}`,
        libraryVersion: "child",
        figureNo: String(no),
        paletteNumber: String(no),
        rowIndex,
        rowLabel: teachingToyRows[rowIndex - 1]
      };
    }

    function createPegToy(no, rowIndex, colorKey, name, options = {}) {
      const color = teachingToyColors[colorKey];
      return createTeachingToyMeta(no, rowIndex, {
        key: options.key || `toy-${String(no).padStart(2, "0")}-peg`,
        shape: options.shape || "peg",
        name,
        hexColor: color.hexColor,
        cssColor: color.cssColor,
        radius: options.radius ?? 1.72,
        height: options.height ?? 6.2,
        head: options.head ?? 1.35,
        eyeRadius: options.eyeRadius ?? 0.36,
        eyeYOffset: options.eyeYOffset,
        eyeForward: options.eyeForward,
        eyeInsetRatio: options.eyeInsetRatio,
        neckStyle: options.neckStyle
      });
    }

    function createConeRoundToy(no, rowIndex, colorKey, name, options = {}) {
      const color = teachingToyColors[colorKey];
      return createTeachingToyMeta(no, rowIndex, {
        key: options.key || `toy-${String(no).padStart(2, "0")}-cone-round`,
        shape: "curved-cone-round",
        name,
        hexColor: color.hexColor,
        cssColor: color.cssColor,
        radius: options.radius ?? 1.82,
        radiusTop: options.radiusTop ?? 0.82,
        height: options.height ?? 5.9,
        head: options.head ?? 1.3,
        bodyCurveStyle: options.bodyCurveStyle,
        eyeRadius: options.eyeRadius ?? 0.35,
        eyeYOffset: options.eyeYOffset,
        eyeForward: options.eyeForward,
        eyeInsetRatio: options.eyeInsetRatio,
        neckStyle: options.neckStyle
      });
    }

    function createPureConeToy(no, rowIndex, colorKey, name, options = {}) {
      const color = teachingToyColors[colorKey];
      return createTeachingToyMeta(no, rowIndex, {
        key: options.key || `toy-${String(no).padStart(2, "0")}-pure-cone`,
        shape: "pure-cone",
        name,
        hexColor: color.hexColor,
        cssColor: color.cssColor,
        radius: options.radius ?? 1.65,
        height: options.height ?? 6.8,
        eyeRadius: options.eyeRadius ?? 0.34,
        eyeYOffset: options.eyeYOffset,
        eyeForward: options.eyeForward,
        eyeInsetRatio: options.eyeInsetRatio,
        eyeScale: options.eyeScale,
        neckStyle: options.neckStyle
      });
    }

    function createPointedCylinderToy(no, rowIndex, colorKey, name, options = {}) {
      const color = teachingToyColors[colorKey];
      return createTeachingToyMeta(no, rowIndex, {
        key: options.key || `toy-${String(no).padStart(2, "0")}-pointed-cylinder`,
        shape: "pointed-cylinder",
        name,
        hexColor: color.hexColor,
        cssColor: color.cssColor,
        radius: options.radius ?? 1.58,
        height: options.height ?? 5.6,
        tipHeight: options.tipHeight ?? 1.35,
        eyeRadius: options.eyeRadius ?? 0.32,
        eyeYOffset: options.eyeYOffset,
        eyeForward: options.eyeForward,
        eyeInsetRatio: options.eyeInsetRatio,
        neckStyle: options.neckStyle
      });
    }

    function createWavyPegToy(no, rowIndex, colorKey, name, options = {}) {
      const color = teachingToyColors[colorKey];
      return createTeachingToyMeta(no, rowIndex, {
        key: options.key || `toy-${String(no).padStart(2, "0")}-wavy-peg`,
        shape: "wavy-peg",
        name,
        hexColor: color.hexColor,
        cssColor: color.cssColor,
        radius: options.radius ?? 1.6,
        height: options.height ?? 5.9,
        head: options.head ?? 1.2,
        waveAmplitude: options.waveAmplitude ?? 0.18,
        waveCount: options.waveCount ?? 4,
        eyeRadius: options.eyeRadius ?? 0.34,
        eyeYOffset: options.eyeYOffset,
        eyeForward: options.eyeForward,
        eyeInsetRatio: options.eyeInsetRatio
      });
    }

    function createStackedDropToy(no, rowIndex, colorKey, name, options = {}) {
      const color = teachingToyColors[colorKey];
      return createTeachingToyMeta(no, rowIndex, {
        key: options.key || `toy-${String(no).padStart(2, "0")}-stacked-drop`,
        shape: "stacked-drop",
        name,
        hexColor: color.hexColor,
        cssColor: color.cssColor,
        radius: options.radius ?? 1.66,
        upperRadius: options.upperRadius ?? 1.38,
        waistRadius: options.waistRadius ?? 1.02,
        lowerHeight: options.lowerHeight ?? 3.25,
        upperHeight: options.upperHeight ?? 3.1,
        tipRadius: options.tipRadius ?? 0.18,
        eyeRadius: options.eyeRadius ?? 0.34,
        eyeYOffset: options.eyeYOffset,
        eyeForward: options.eyeForward,
        eyeInsetRatio: options.eyeInsetRatio,
        eyeScale: options.eyeScale,
        neckStyle: options.neckStyle
      });
    }

    function createConeCapToy(no, rowIndex, colorKey, name, options = {}) {
      const color = teachingToyColors[colorKey];
      return createTeachingToyMeta(no, rowIndex, {
        key: options.key || `toy-${String(no).padStart(2, "0")}-cone-cap`,
        shape: "cone-cap",
        name,
        hexColor: color.hexColor,
        cssColor: color.cssColor,
        radius: options.radius ?? 1.62,
        waistRadius: options.waistRadius ?? 0.94,
        lowerHeight: options.lowerHeight ?? 3.34,
        headRadius: options.headRadius ?? 1.02,
        capRadius: options.capRadius ?? 1.24,
        capHeight: options.capHeight ?? 2.7,
        capYOffset: options.capYOffset,
        tipRadius: options.tipRadius ?? 0.22,
        eyeRadius: options.eyeRadius ?? 0.34,
        eyeYOffset: options.eyeYOffset,
        eyeForward: options.eyeForward,
        eyeInsetRatio: options.eyeInsetRatio,
        eyeScale: options.eyeScale,
        neckStyle: options.neckStyle
      });
    }

    function createBulbBaseToy(no, rowIndex, colorKey, name, options = {}) {
      const color = teachingToyColors[colorKey];
      return createTeachingToyMeta(no, rowIndex, {
        key: options.key || `toy-${String(no).padStart(2, "0")}-bulb-base`,
        shape: "bulb-base",
        name,
        hexColor: color.hexColor,
        cssColor: color.cssColor,
        radius: options.radius ?? 1.34,
        skirtHeight: options.skirtHeight ?? 2.06,
        skirtTopRadius: options.skirtTopRadius ?? 1.08,
        torsoRadius: options.torsoRadius ?? 1.12,
        headRadius: options.headRadius ?? 0.82,
        legRadius: options.legRadius ?? 0.8,
        legHeight: options.legHeight ?? 0.82,
        footRadius: options.footRadius ?? 1.0,
        footHeight: options.footHeight ?? 0.22,
        eyeRadius: options.eyeRadius ?? 0.34,
        eyeYOffset: options.eyeYOffset,
        eyeForward: options.eyeForward,
        eyeInsetRatio: options.eyeInsetRatio,
        eyeScale: options.eyeScale,
        neckStyle: options.neckStyle
      });
    }

    function createSkirtLegToy(no, rowIndex, colorKey, name, options = {}) {
      const color = teachingToyColors[colorKey];
      return createTeachingToyMeta(no, rowIndex, {
        key: options.key || `toy-${String(no).padStart(2, "0")}-skirt-leg`,
        shape: "skirt-leg",
        name,
        hexColor: color.hexColor,
        cssColor: color.cssColor,
        radius: options.radius ?? 1.18,
        skirtHeight: options.skirtHeight ?? 2.84,
        skirtTopRadius: options.skirtTopRadius ?? 0.96,
        bodyCurveStyle: options.bodyCurveStyle,
        headRadius: options.headRadius ?? 0.82,
        legRadius: options.legRadius ?? 0.66,
        legHeight: options.legHeight ?? 0.86,
        footRadius: options.footRadius ?? 0.96,
        footHeight: options.footHeight ?? 0.24,
        eyeRadius: options.eyeRadius ?? 0.34,
        eyeYOffset: options.eyeYOffset,
        eyeForward: options.eyeForward,
        eyeInsetRatio: options.eyeInsetRatio,
        eyeScale: options.eyeScale,
        neckStyle: options.neckStyle
      });
    }

    function createRoundCapToy(no, rowIndex, colorKey, name, options = {}) {
      const color = teachingToyColors[colorKey];
      return createTeachingToyMeta(no, rowIndex, {
        key: options.key || `toy-${String(no).padStart(2, "0")}-round-cap`,
        shape: "round-cap",
        name,
        hexColor: color.hexColor,
        cssColor: color.cssColor,
        radius: options.radius ?? 1.54,
        lowerHeight: options.lowerHeight ?? 3.84,
        waistRadius: options.waistRadius ?? 0.9,
        bodyCurveStyle: options.bodyCurveStyle,
        headRadius: options.headRadius ?? 1.16,
        headHeight: options.headHeight ?? 1.38,
        capRadius: options.capRadius ?? 1.28,
        capHeight: options.capHeight ?? 1.08,
        capTopRadius: options.capTopRadius ?? 0.56,
        eyeRadius: options.eyeRadius ?? 0.34,
        eyeYOffset: options.eyeYOffset,
        eyeForward: options.eyeForward,
        eyeInsetRatio: options.eyeInsetRatio,
        eyeScale: options.eyeScale,
        neckStyle: options.neckStyle,
        headYOffset: options.headYOffset,
        hatYOffset: options.hatYOffset,
        topBallYOffset: options.topBallYOffset
      });
    }

    function createRoundedPegToy(no, rowIndex, colorKey, name, options = {}) {
      const color = teachingToyColors[colorKey];
      return createTeachingToyMeta(no, rowIndex, {
        key: options.key || `toy-${String(no).padStart(2, "0")}-rounded-peg`,
        shape: "rounded-peg",
        name,
        hexColor: color.hexColor,
        cssColor: color.cssColor,
        radius: options.radius ?? 1.68,
        height: options.height ?? 3.58,
        head: options.head ?? 1.08,
        eyeRadius: options.eyeRadius ?? 0.34,
        eyeYOffset: options.eyeYOffset,
        eyeForward: options.eyeForward,
        eyeInsetRatio: options.eyeInsetRatio,
        neckStyle: options.neckStyle
      });
    }

    function createBallCylinderToy(no, rowIndex, colorKey, name, options = {}) {
      const color = teachingToyColors[colorKey];
      return createTeachingToyMeta(no, rowIndex, {
        key: options.key || `toy-${String(no).padStart(2, "0")}-ball-cylinder`,
        shape: "ball-cylinder",
        name,
        hexColor: color.hexColor,
        cssColor: color.cssColor,
        radius: options.radius ?? 1.08,
        height: options.height ?? 3.58,
        head: options.head ?? 1.08,
        eyeRadius: options.eyeRadius ?? 0.34,
        eyeYOffset: options.eyeYOffset,
        eyeForward: options.eyeForward,
        eyeInsetRatio: options.eyeInsetRatio,
        neckStyle: options.neckStyle
      });
    }

    function createHatToy(no, rowIndex, colorKey, name, options = {}) {
      const color = teachingToyColors[colorKey];
      return createTeachingToyMeta(no, rowIndex, {
        key: options.key || `toy-${String(no).padStart(2, "0")}-hat-peg`,
        shape: options.shape || "hat-peg",
        name,
        hexColor: color.hexColor,
        cssColor: color.cssColor,
        radius: options.radius ?? 1.58,
        height: options.height ?? 5.4,
        bodyHeight: options.bodyHeight ?? options.height ?? 5.4,
        hatRadius: options.hatRadius ?? 1.08,
        hatTopRadius: options.hatTopRadius,
        brimRadius: options.brimRadius ?? 1.48,
        hatHeight: options.hatHeight ?? 1.04,
        upperRadius: options.upperRadius,
        waistRadius: options.waistRadius,
        neckRadius: options.neckRadius,
        bottomRadius: options.bottomRadius,
        headRadius: options.headRadius,
        brimOffsetY: options.brimOffsetY,
        hatOffsetY: options.hatOffsetY,
        wavy: options.wavy ?? false,
        waveAmplitude: options.waveAmplitude ?? 0.16,
        waveCount: options.waveCount ?? 4,
        eyeRadius: options.eyeRadius ?? 0.34,
        eyeYOffset: options.eyeYOffset,
        eyeForward: options.eyeForward,
        eyeInsetRatio: options.eyeInsetRatio,
        neckStyle: options.neckStyle
      });
    }

    function createBlockToy(no, rowIndex, colorKey, name, options = {}) {
      const color = teachingToyColors[colorKey];
      return createTeachingToyMeta(no, rowIndex, {
        key: options.key || `toy-${String(no).padStart(2, "0")}-block`,
        shape: "block",
        name,
        hexColor: color.hexColor,
        cssColor: color.cssColor,
        width: options.width ?? 3.6,
        depth: options.depth ?? 2.6,
        height: options.height ?? 5.2,
        eyeYOffset: options.eyeYOffset
      });
    }

    function buildChildPaletteData() {
      return [
        createPegToy(1, 1, "red", "#1 红色高圆柱体人偶", { radius: 1.28, height: 6.2, head: 1.28, neckStyle: "flat-cylinder" }),
        createConeRoundToy(2, 1, "red", "#2 红色高锥形人偶", { radius: 1.82, radiusTop: 0.8, height: 6.2, head: 1.28, neckStyle: "flat-cylinder", bodyCurveStyle: "bell-reference" }),
        createPegToy(3, 1, "red", "#3 红色中等高度圆柱体人偶", { radius: 1.18, height: 5.2, head: 1.18, neckStyle: "flat-cylinder" }),
        createConeRoundToy(4, 1, "red", "#4 红色中等高度锥形人偶", { radius: 1.72, radiusTop: 0.72, height: 5.24, head: 1.16, neckStyle: "flat-cylinder", bodyCurveStyle: "bell-reference" }),
        createPureConeToy(5, 1, "red", "#5 红色尖顶圆锥形人偶", { radius: 1.25, height: 6.84, sharpTop: true, eyeYOffset: 5.4, eyeForward: 0.55, eyeScale: 0.5, embedRatio: 1.05 }),
        createConeCapToy(6, 1, "red", "#6 红色尖帽球头人偶", { radius: 1.62, waistRadius: 0.94, lowerHeight: 2.72, headRadius: 1.02, capRadius: 1.18, capHeight: 3.5, capYOffset: 0.26, tipRadius: 0.0, sharpTop: true, eyeYOffset: -0.05, eyeForward: 0.98, eyeInsetRatio: 0.1, eyeScale: 0.72 }),
        createBulbBaseToy(7, 1, "red", "#7 红色球头裙身人偶", { radius: 1.34, skirtHeight: 2.06, skirtTopRadius: 1.08, torsoRadius: 1.08, headRadius: 1.08, legRadius: 0.78, legHeight: 0.82, footRadius: 1.0, footHeight: 0.22, eyeYOffset: 0, eyeInsetRatio: 0.16, eyeScale: 1.02, neckStyle: "flat-cylinder" }),
        createSkirtLegToy(8, 1, "red", "#8 红色球头裙身人偶", { radius: 1.16, skirtHeight: 3.34, skirtTopRadius: 0.94, headRadius: 1.02, legRadius: 0.64, legHeight: 1.4, footRadius: 0.98, footHeight: 0.24, eyeYOffset: 0, eyeForward: 0.86, eyeInsetRatio: 0.16, eyeScale: 1.02, neckStyle: "flat-cylinder", bodyCurveStyle: "bell-reference" }),
        createPegToy(9, 1, "red", "#9 红色矮圆柱体人偶", { shape: "stout-peg", radius: 1.45, height: 3.1, head: 1.02, eyeYOffset: -0.02, eyeForward: 0.92, neckStyle: "flat-cylinder" }),

        createPegToy(10, 2, "blue", "#10 蓝色高圆柱体人偶", { radius: 1.28, height: 6.2, head: 1.28, neckStyle: "flat-cylinder" }),
        createConeRoundToy(11, 2, "blue", "#11 蓝色高锥形人偶", { radius: 1.82, radiusTop: 0.8, height: 6.2, head: 1.28, neckStyle: "flat-cylinder", bodyCurveStyle: "bell-reference" }),
        createPegToy(12, 2, "blue", "#12 蓝色中等高度圆柱体人偶", { radius: 1.18, height: 5.2, head: 1.18, neckStyle: "flat-cylinder" }),
        createConeRoundToy(13, 2, "blue", "#13 蓝色中等高度锥形人偶", { radius: 1.72, radiusTop: 0.72, height: 5.24, head: 1.16, neckStyle: "flat-cylinder", bodyCurveStyle: "bell-reference" }),
        createRoundCapToy(14, 2, "blue", "#14 蓝色圆帽长身人偶", { radius: 1.48, lowerHeight: 4.17, waistRadius: 1.06, headRadius: 1.08, headHeight: 1.34, capRadius: 1.04, capHeight: 1.22, capTopRadius: 0.34, eyeYOffset: -0.02, eyeForward: 1.0, eyeInsetRatio: 0.22, neckStyle: "flat-cylinder", bodyCurveStyle: "bell-reference", headYOffset: -0.16, topBallYOffset: -0.30 }),
        createPureConeToy(15, 2, "blue", "#15 蓝色高窄尖顶圆锥形人偶", { radius: 1.25, height: 6.7, eyeYOffset: 5.1, eyeForward: 0.55, eyeScale: 0.5 }),
        createHatToy(16, 2, "blue", "#16 蓝色圆肚礼帽人偶", { shape: "hat-rounded", radius: 1.28, upperRadius: 1.16, waistRadius: 0.94, neckRadius: 0.9, bottomRadius: 1.28, headRadius: 1.1, height: 3.1, bodyHeight: 2.2, hatRadius: 0.82, hatTopRadius: 0.68, brimRadius: 1.2, hatHeight: 0.8, brimOffsetY: 0.28, hatOffsetY: 0.4, eyeYOffset: 0.05, eyeForward: 1.02, eyeInsetRatio: 0.28, neckStyle: "none" }),

        createPegToy(17, 3, "wood", "#17 原木色高圆柱体人偶", { radius: 1.28, height: 6.2, head: 1.28, neckStyle: "flat-cylinder" }),
        createConeRoundToy(18, 3, "wood", "#18 原木色高锥形人偶", { radius: 1.82, radiusTop: 0.8, height: 5.0, head: 1.28, neckStyle: "flat-cylinder", bodyCurveStyle: "bell-reference" }),
        createPegToy(19, 3, "wood", "#19 原木色中等高度圆柱体人偶", { radius: 1.26, height: 5.04, head: 1.26, neckStyle: "flat-cylinder" }),
        createConeRoundToy(20, 3, "wood", "#20 原木色中等高度锥形人偶", { radius: 1.76, radiusTop: 0.78, height: 4.2, head: 1.22, neckStyle: "flat-cylinder", bodyCurveStyle: "bell-reference" }),
        createPegToy(21, 3, "wood", "#21 原木色圆柱体人偶", { radius: 1.28, height: 4.2, head: 1.28, neckStyle: "flat-cylinder" }),
        createRoundedPegToy(22, 3, "wood", "#22 原木色波浪形圆柱体人偶", { radius: 1.27, height: 3.1, head: 1.02, eyeYOffset: -0.02, eyeForward: 0.92, neckStyle: "flat-cylinder" }),
        createBallCylinderToy(23, 3, "wood", "#23 原木色矮圆柱体人偶", { radius: 1.27, height: 3.1, head: 1.02, eyeYOffset: -0.02, eyeForward: 0.92, neckStyle: "flat-cylinder" }),

        createPegToy(24, 4, "green", "#24 绿色高圆柱体人偶", { radius: 1.28, height: 6.2, head: 1.28, neckStyle: "flat-cylinder" }),
        createConeRoundToy(25, 4, "green", "#25 绿色高锥形人偶", { radius: 1.82, radiusTop: 0.8, height: 6.2, head: 1.28, neckStyle: "flat-cylinder", bodyCurveStyle: "bell-reference" }),
        createPegToy(26, 4, "green", "#26 绿色矮圆柱体人偶", { radius: 1.18, height: 5.2, head: 1.18, neckStyle: "flat-cylinder" }),
        createConeRoundToy(27, 4, "green", "#27 绿色矮锥形人偶", { radius: 1.72, radiusTop: 0.72, height: 5.24, head: 1.16, neckStyle: "flat-cylinder", bodyCurveStyle: "bell-reference" }),
        createHatToy(28, 4, "green", "#28 绿色小帽收腰人偶", { shape: "hat-stacked", radius: 1.5, upperRadius: 1.2, waistRadius: 0.82, neckRadius: 0.92, headRadius: 1.08, height: 5.48, bodyHeight: 4.54, hatRadius: 0.75, hatTopRadius: 0.6, brimRadius: 1.1, hatHeight: 0.75, brimOffsetY: 0.25, hatOffsetY: 0.35, eyeYOffset: 0, eyeForward: 1.0, eyeInsetRatio: 0.28, neckStyle: "flat-cylinder" }),

        createBlockToy(29, 5, "red", "#29 红色大长方体块", { width: 2.8, depth: 2.8, height: 5.8, eyeYOffset: 1.5 }),
        createBlockToy(30, 5, "gray", "#30 灰色大长方体块", { width: 2.8, depth: 2.8, height: 5.8, eyeYOffset: 1.5 }),
        createBlockToy(31, 5, "gray", "#31 灰色小长方体块", { width: 2.1, depth: 2.1, height: 4.2, eyeYOffset: 1.1 }),
        createBlockToy(32, 5, "red", "#32 红色小长方体块", { width: 2.1, depth: 2.1, height: 4.2, eyeYOffset: 1.1 }),
        createPegToy(33, 5, "yellow", "#33 黄色高圆柱体人偶", { radius: 1.34, height: 6.2, head: 1.34, neckStyle: "flat-cylinder" }),
        createConeRoundToy(34, 5, "yellow", "#34 黄色高锥形人偶", { radius: 1.9, radiusTop: 0.82, height: 6.2, head: 1.32, neckStyle: "flat-cylinder", bodyCurveStyle: "bell-reference" }),
        createPegToy(35, 5, "yellow", "#35 黄色矮圆柱体人偶", { radius: 1.18, height: 5.2, head: 1.18, neckStyle: "flat-cylinder" }),
        createConeRoundToy(36, 5, "yellow", "#36 黄色矮锥形人偶", { radius: 1.72, radiusTop: 0.72, height: 5.24, head: 1.16, neckStyle: "flat-cylinder", bodyCurveStyle: "bell-reference" })
      ];
    }

    // Vue 新站点只保留学动版沙盘，不再从 URL 切换成人版。
    const activeLibraryVersion = "child";
    const paletteData = buildChildPaletteData();
    const storageKey = `psych-sand-table-3d-${activeLibraryVersion}-v3`;
    const settingsKey = `psych-sand-table-settings-${activeLibraryVersion}`;
    let pieces = [];
    let autoIndex = 1;
    let selectedMesh = null;
    let draggedMesh = null;
    let dragOffset = new THREE.Vector3();
    let palettePreviewConfig = null;

    // 2. 初始化 Three.js 场景
    const container = document.getElementById('stage-container');
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf4efe6);
    scene.fog = new THREE.Fog(0xf4efe6, 100, 300); // 大幅推远雾化距离，去灰

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    // 俯仰角30°: y = 85 * sin(30°) = 42.5, z = 85 * cos(30°) = 73.6
    camera.position.set(0, 42.5, 73.6);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true; // 开启阴影
    renderer.shadowMap.type = THREE.PCFShadowMap; // 柔和阴影（PCFSoftShadowMap 已弃用）
    container.appendChild(renderer.domElement);

    // 移除 Loading
    document.getElementById('loading').style.display = 'none';

    function updateLibraryInfo() {
      const isChild = activeLibraryVersion === "child";
      document.title = `心理沙盘 3D 摆盘 (${isChild ? "学动版" : "标准版"})`;
    }

    updateLibraryInfo();

    // 3. 灯光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); // 降低环境光，加深阴影对比
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff5e6, 2.2); // 提高主光源强度，使受光面更亮
    dirLight.position.set(40, 60, 30);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048; // 提高阴影分辨率
    dirLight.shadow.mapSize.height = 2048;
    // 扩大阴影相机范围以覆盖整个沙盘
    dirLight.shadow.camera.left = -70;
    dirLight.shadow.camera.right = 70;
    dirLight.shadow.camera.top = 70;
    dirLight.shadow.camera.bottom = -70;
    dirLight.shadow.radius = 2.5; // 降低阴影模糊度，边缘更锐利
    dirLight.shadow.bias = -0.0001; // 减小 bias 以解决阴影脱离 (Peter Panning) 问题
    dirLight.shadow.normalBias = 0.02; // 添加 normalBias 改善自阴影和平滑表面的贴合
    scene.add(dirLight);
    
    const fillLight = new THREE.DirectionalLight(0xe6f0ff, 0.5); // 降低背光补光，增强立体感
    fillLight.position.set(-40, 30, -30);
    scene.add(fillLight);

    function createGlassTexture(width, height, options = {}) {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      const baseColor = options.baseColor || '#0a0510';
      ctx.fillStyle = baseColor;
      ctx.fillRect(0, 0, width, height);

      // 玻璃质感：细微的渐变和反光点，不再有流线感
      const grad = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/2);
      grad.addColorStop(0, 'rgba(255,255,255,0.02)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      return new THREE.CanvasTexture(canvas);
    }

    function createWoodTexture(width, height, options = {}) {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      // 基础深色木板颜色
      const baseColor = options.baseColor || '#2a1e16';
      ctx.fillStyle = baseColor;
      ctx.fillRect(0, 0, width, height);

      // 绘制木纹纹理
      ctx.fillStyle = options.grainColor || '#1a100a';
      for (let i = 0; i < 200; i++) {
        ctx.globalAlpha = Math.random() * 0.15 + 0.05;
        const y = Math.random() * height;
        const h = Math.random() * 4 + 1;
        ctx.fillRect(0, y, width, h);
      }
      


      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      return texture;
    }

    function createBoardTopTexture() {
      const texture = createWoodTexture(1024, 1024, {
        baseColor: '#281b12' // 稍微调淡一点的深色木板材质
      });
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      return texture;
    }

    // 4. 沙盘
    let tableWidth = 100;
    let tableDepth = 100;
    const tableTopTexture = createBoardTopTexture();
    const tableSideTexture = createWoodTexture(512, 256, { baseColor: '#18100a' });
    
    const tableGeo = new THREE.BoxGeometry(tableWidth, 2, tableDepth);
    const tableMat = new THREE.MeshStandardMaterial({
      map: tableSideTexture,
      roughness: 0.85, // 恢复木质粗糙度
      metalness: 0.05,
      envMapIntensity: 0.5
    });
    const tableBase = new THREE.Mesh(tableGeo, tableMat);
    tableBase.position.y = -1;
    tableBase.receiveShadow = true;
    scene.add(tableBase);

    const sandGeo = new THREE.PlaneGeometry(tableWidth - 2, tableDepth - 2);
    const sandMat = new THREE.MeshStandardMaterial({
      map: tableTopTexture,
      roughness: 0.8, // 恢复木质表面粗糙度
      metalness: 0.1,
      envMapIntensity: 0.5
    });
    const sandPlane = new THREE.Mesh(sandGeo, sandMat);
    sandPlane.rotation.x = -Math.PI / 2;
    sandPlane.position.y = 0.01;
    sandPlane.receiveShadow = true;
    scene.add(sandPlane);

    // 使用全局变量代替被移除的 slider DOM 元素
    let currentSettings = {
      pitch: 30,
      yaw: 0,
      zoom: 85,
      width: 100,
      depth: 100
    };

    // 视角同步逻辑
    function updateCameraFromSliders() {
      const pitch = THREE.MathUtils.degToRad(currentSettings.pitch);
      const yaw = THREE.MathUtils.degToRad(currentSettings.yaw);
      const zoom = currentSettings.zoom;
      
      const x = zoom * Math.sin(yaw) * Math.cos(pitch);
      const y = zoom * Math.sin(pitch);
      const z = zoom * Math.cos(yaw) * Math.cos(pitch);
      
      camera.position.set(orbit.target.x + x, orbit.target.y + y, orbit.target.z + z);
      camera.lookAt(orbit.target);
      orbit.update();
      // 数值显示统一由 syncSettingUI 管理
    }

    // 辅助网格 (隐形交互面)
    const interactPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

    // 鼠标坐标转换助手 (适配移动端强制横屏)
    function updateMousePos(e, rect, mouse) {
      if (window.matchMedia("(orientation: portrait)").matches) {
        mouse.x = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        mouse.y = ((e.clientX - rect.right) / rect.width) * 2 + 1;
      } else {
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      }
    }

    // 选中光圈
    const selectRing = new THREE.Group();
    // 基础人偶最大半径(radius)约为2.6，这里设内圈为2.8，外圈为3.3
    const selectRingGeo = new THREE.RingGeometry(2.8, 3.3, 48);
    const selectRingMat = new THREE.MeshBasicMaterial({ color: 0xffd700, side: THREE.DoubleSide, transparent: true, opacity: 0.82 });
    const selectRingBody = new THREE.Mesh(selectRingGeo, selectRingMat);
    selectRingBody.rotation.x = -Math.PI / 2;
    selectRing.add(selectRingBody);

    // 箭头也等比缩小并靠近内圈
    const selectArrowGeo = new THREE.ConeGeometry(0.35, 0.8, 3);
    const selectArrowMat = new THREE.MeshBasicMaterial({ color: 0xffd700, transparent: true, opacity: 0.95 });
    const selectArrow = new THREE.Mesh(selectArrowGeo, selectArrowMat);
    selectArrow.rotation.x = Math.PI / 2;
    selectArrow.position.set(0, 0.06, 3.25); // 定位在圆环边缘
    selectRing.add(selectArrow);

    selectRing.position.y = 0.05;
    selectRing.visible = false;
    scene.add(selectRing);

    // 5. 控制器
    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.enableDamping = true;
    orbit.enableRotate = false; // 禁用旋转，固定视角避免误触
    orbit.maxPolarAngle = Math.PI / 2 - 0.05; 
    orbit.minDistance = 20;
    orbit.maxDistance = 150;

    // 6. 模型生成工厂
    // 木纹贴图只与形状有关、与颜色无关（颜色由材质 color 提供），全站共享一份
    let sharedWoodTexture = null;
    function getSharedWoodTexture() {
      if (sharedWoodTexture) return sharedWoodTexture;

      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 256, 256);

      // 柔和的木纹年轮
      ctx.fillStyle = 'rgba(0,0,0,0.03)';
      const centerX = 128;
      const centerY = 128;
      for (let r = 10; r < 200; r += Math.random() * 8 + 4) {
        ctx.beginPath();
        // 扭曲的圆
        for (let a = 0; a <= Math.PI * 2; a += 0.1) {
          const distortion = Math.sin(a * 4) * 3 + Math.cos(a * 3) * 4;
          const x = centerX + Math.cos(a) * (r + distortion);
          const y = centerY + Math.sin(a) * (r * 1.5 + distortion); // 拉长成椭圆模拟纵向木纹
          if (a === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.lineWidth = Math.random() * 1.5 + 0.5;
        ctx.strokeStyle = 'rgba(0,0,0,0.04)';
        ctx.stroke();
      }

      // 添加一些细微的噪点增强木材质感
      const imgData = ctx.getImageData(0, 0, 256, 256);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 10;
        data[i] = Math.max(0, Math.min(255, data[i] + noise));
        data[i+1] = Math.max(0, Math.min(255, data[i+1] + noise));
        data[i+2] = Math.max(0, Math.min(255, data[i+2] + noise));
      }
      ctx.putImageData(imgData, 0, 0);

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1, 2); // 纵向拉伸木纹
      sharedWoodTexture = texture;
      return texture;
    }

    // 人偶原型缓存：同一种人偶的几何体/材质只构建一次，之后 clone 复用（clone 共享 geometry/material 引用）
    const meshPrototypeCache = new Map();

    function createPieceMesh(meta, options = {}) {
      const cacheKey = `${meta.key}|${options.eyeColor ?? ''}|${options.eyeRadius ?? ''}`;
      if (!meshPrototypeCache.has(cacheKey)) {
        meshPrototypeCache.set(cacheKey, buildPieceMesh(meta, options));
      }
      return meshPrototypeCache.get(cacheKey).clone(true);
    }

    function getMeta(key) {
      return paletteData.find(item => item.key === key) || paletteData[0];
    }

    function getPieceFootprint(meta) {
      let baseFootprint = 0;
      switch (meta.shape) {
        case 'cube':
        case 'block':
          baseFootprint = Math.max(meta.width || 0, meta.depth || 0) * 0.5 + 0.1;
          break;
        case 'pointed-cylinder':
          baseFootprint = (meta.radius || 1.6) + 0.05;
          break;
        case 'stacked-drop':
        case 'cone-cap':
        case 'bulb-base':
        case 'skirt-leg':
          baseFootprint = Math.max(meta.radius || 1.6, meta.upperRadius || 0) + 0.05;
          break;
        case 'ball-cylinder':
        case 'rounded-peg':
        case 'stout-peg':
        case 'curved-cone-round':
        case 'cone-round':
        case 'drop-point':
        case 'snowman':
        case 'pure-cone':
        case 'wavy-peg':
          baseFootprint = (meta.radius || meta.headWidth || 2) + 0.05;
          break;
        case 'flat-hat':
        case 'hat-peg':
        case 'hat-stacked':
        case 'hat-rounded':
          baseFootprint = Math.max(meta.radius || 2, meta.brimRadius || 0) + 0.05;
          break;
        case 'peg':
        case 'cylinder':
        default:
          baseFootprint = Math.max(meta.radius || 1.8, meta.head || 0) + 0.05;
          break;
      }
      // 人物整体放大 50%，占地半径也同步乘以 1.5
      return baseFootprint * 1.5;
    }

    function isPositionFree(x, z, meta, excludeMesh = null) {
      const footprint = getPieceFootprint(meta);
      return pieces.every(piece => {
        if (piece === excludeMesh) return true;
        const otherRadius = piece.userData.footprint || getPieceFootprint(piece.userData.meta || getMeta(piece.userData.kind));
        // 紧贴在一起：减少碰撞缓冲距离
        const minDistance = footprint + otherRadius + 0.02;
        return piece.position.distanceTo(new THREE.Vector3(x, 0, z)) >= minDistance;
      });
    }

    function findNonOverlappingPosition(x, z, meta, excludeMesh = null) {
      const footprint = getPieceFootprint(meta);
      const minX = -tableWidth / 2 + footprint;
      const maxX = tableWidth / 2 - footprint;
      const minZ = -tableDepth / 2 + footprint;
      const maxZ = tableDepth / 2 - footprint;
      const baseX = THREE.MathUtils.clamp(x, minX, maxX);
      const baseZ = THREE.MathUtils.clamp(z, minZ, maxZ);
      if (isPositionFree(baseX, baseZ, meta, excludeMesh)) return { x: baseX, z: baseZ };

      const step = 0.5; // 减小步长，允许更精细的紧贴放置
      for (let ring = 1; ring <= 25; ring++) {
        for (let i = 0; i < 16; i++) {
          const angle = (i / 16) * Math.PI * 2;
          const testX = THREE.MathUtils.clamp(baseX + Math.cos(angle) * ring * step, minX, maxX);
          const testZ = THREE.MathUtils.clamp(baseZ + Math.sin(angle) * ring * step, minZ, maxZ);
          if (isPositionFree(testX, testZ, meta, excludeMesh)) {
            return { x: testX, z: testZ };
          }
        }
      }

      return { x: baseX, z: baseZ };
    }

    function getShapeOrder(shape) {
      const order = {
        'peg': 1,
        'ball-cylinder': 1,
        'rounded-peg': 1,
        'stout-peg': 1,
        'curved-cone-round': 2,
        'cone-round': 2,
        'drop-point': 3,
        'flat-hat': 4,
        'pure-cone': 5,
        'stacked-drop': 6,
        'cone-cap': 6,
        'bulb-base': 6,
        'skirt-leg': 6,
        'round-cap': 6,
        'snowman': 6,
        'cube': 7,
        'block': 8,
        'pointed-cylinder': 9,
        'wavy-peg': 10,
        'hat-peg': 11,
        'hat-stacked': 11,
        'hat-rounded': 11,
        'cylinder': 12
      };
      return order[shape] || 99;
    }

    function getPieceSortSize(meta) {
      if (meta.shape === 'cube' || meta.shape === 'block') return meta.height || 0;
      if (meta.shape === 'snowman') return (meta.radius || 0) * 2.2;
      return Math.max(meta.height || 0, (meta.radius || 0) * 2, (meta.headHeight || 0));
    }

    function getPaletteEntries() {
      if (activeLibraryVersion === 'child') {
        return paletteData.map((meta, index) => ({
          meta,
          paletteNumber: meta.paletteNumber || String(index + 1)
        }));
      }

      const sorted = [...paletteData].sort((a, b) => {
        const shapeDiff = getShapeOrder(a.shape) - getShapeOrder(b.shape);
        if (shapeDiff !== 0) return shapeDiff;

        const sizeDiff = getPieceSortSize(b) - getPieceSortSize(a);
        if (sizeDiff !== 0) return sizeDiff;

        return a.key.localeCompare(b.key);
      });

      return sorted.map((meta, index) => ({
        meta,
        paletteNumber: String(index + 1)
      }));
    }

    function buildPieceMesh(meta, options = {}) {
      const group = new THREE.Group();
      const eyeColor = options.eyeColor ?? 0x1a1a1a;
      const eyeRadius = options.eyeRadius ?? meta.eyeRadius ?? 0.32;

      // 复用共享木纹贴图，避免每个人偶重复绘制 canvas 并生成纹理
      const texture = getSharedWoodTexture();

      const mat = new THREE.MeshStandardMaterial({
        color: meta.hexColor, 
        roughness: 0.45,     // 降低粗糙度，让人偶表面更有光泽，强化体积感
        metalness: 0.15,     // 增加一点金属度，使受光面反射更强烈
        map: texture 
      });
      
      let mainBody;
      let faceAnchor = null;
      const addRoundedNeck = (baseY, headCenterY, headRadius, bodyRadius) => {
        const isFlatCylinderNeck = meta.neckStyle === "flat-cylinder";
        const neckBaseY = baseY - headRadius * (isFlatCylinderNeck ? 0.07 : 0.04);
        const neckTopY = headCenterY - headRadius * (isFlatCylinderNeck ? 0.8 : 0.74);
        const neckHeight = Math.max(headRadius * (isFlatCylinderNeck ? 0.15 : 0.16), neckTopY - neckBaseY);
        const neckRadius = Math.min(
          Math.max(bodyRadius * (isFlatCylinderNeck ? 0.6 : 0.24), headRadius * (isFlatCylinderNeck ? 0.51 : 0.2)),
          headRadius * (isFlatCylinderNeck ? 0.87 : 0.38)
        );
        const neckBottomRadius = neckRadius * (isFlatCylinderNeck ? 1.1 : 1.16);
        const neckTopRadius = neckRadius * (isFlatCylinderNeck ? 0.74 : 1.1);
        const neckProfile = isFlatCylinderNeck
          ? [
              new THREE.Vector2(0, 0),
              new THREE.Vector2(neckBottomRadius * 0.78, 0.01),
              new THREE.Vector2(neckBottomRadius, neckHeight * 0.1),
              new THREE.Vector2(neckRadius * 1.01, neckHeight * 0.22),
              new THREE.Vector2(neckRadius, neckHeight * 0.48),
              new THREE.Vector2(neckRadius * 0.9, neckHeight * 0.72),
              new THREE.Vector2(neckTopRadius * 1.06, neckHeight * 0.88),
              new THREE.Vector2(neckTopRadius, neckHeight),
              new THREE.Vector2(neckTopRadius * 0.58, neckHeight + 0.02),
              new THREE.Vector2(0, neckHeight + 0.04)
            ]
          : [
              new THREE.Vector2(0, 0),
              new THREE.Vector2(neckBottomRadius * 0.94, 0.01),
              new THREE.Vector2(neckBottomRadius, neckHeight * 0.14),
              new THREE.Vector2(neckRadius * 1.02, neckHeight * 0.28),
              new THREE.Vector2(neckRadius, neckHeight * 0.72),
              new THREE.Vector2(neckTopRadius * 0.98, neckHeight * 0.88),
              new THREE.Vector2(neckTopRadius, neckHeight),
              new THREE.Vector2(neckTopRadius * 0.78, neckHeight + 0.02),
              new THREE.Vector2(0, neckHeight + 0.04)
            ];
        const neckGeo = new THREE.LatheGeometry(neckProfile, 32);
        const neck = new THREE.Mesh(neckGeo, mat);
        neck.position.y = neckBaseY;
        neck.castShadow = true;
        group.add(neck);
      };

      switch(meta.shape) {
        case 'peg': // 直筒圆头
          const pegUsesFlatCylinderNeck = meta.neckStyle === "flat-cylinder";
          const pegShoulderTop = pegUsesFlatCylinderNeck ? meta.height : meta.height + meta.radius * 0.16;
          const pegBodyProfile = pegUsesFlatCylinderNeck
            ? [
                new THREE.Vector2(0, 0),
                new THREE.Vector2(meta.radius * 0.96, 0.02),
                new THREE.Vector2(meta.radius, meta.height * 0.08),
                new THREE.Vector2(meta.radius, meta.height * 0.78),
                new THREE.Vector2(meta.radius * 0.985, meta.height * 0.9),
                new THREE.Vector2(meta.radius * 0.95, meta.height * 0.965),
                new THREE.Vector2(meta.radius * 0.88, meta.height),
                new THREE.Vector2(0, meta.height + 0.02)
              ]
            : [
                new THREE.Vector2(0, 0),
                new THREE.Vector2(meta.radius * 0.98, 0.02),
                new THREE.Vector2(meta.radius, meta.height * 0.7),
                new THREE.Vector2(meta.radius, meta.height * 0.88),
                new THREE.Vector2(meta.radius * 0.95, meta.height * 0.95),
                new THREE.Vector2(meta.radius * 0.84, meta.height + meta.radius * 0.02),
                new THREE.Vector2(meta.radius * 0.66, meta.height + meta.radius * 0.1),
                new THREE.Vector2(meta.radius * 0.5, pegShoulderTop),
                new THREE.Vector2(0, pegShoulderTop + 0.02)
              ];
          const pegBodyGeo = new THREE.LatheGeometry(pegBodyProfile, 48);
          const pegBody = new THREE.Mesh(pegBodyGeo, mat);
          pegBody.castShadow = true;
          group.add(pegBody);

          const pegHeadGeo = new THREE.SphereGeometry(meta.head, 32, 32);
          const pegHead = new THREE.Mesh(pegHeadGeo, mat);
          pegHead.position.y = pegUsesFlatCylinderNeck
            ? meta.height + meta.head * 1.04
            : meta.height + meta.head * 0.68;
          pegHead.castShadow = true;
          group.add(pegHead);
          addRoundedNeck(pegShoulderTop, pegHead.position.y, meta.head, meta.radius);
          mainBody = pegBody;
          faceAnchor = pegHead;
          break;

        case 'stout-peg': // 矮胖圆身圆头
          const stoutUsesFlatCylinderNeck = meta.neckStyle === "flat-cylinder";
          const stoutShoulderTop = meta.height + meta.radius * (stoutUsesFlatCylinderNeck ? 0.12 : 0.08);
          const stoutBodyProfile = stoutUsesFlatCylinderNeck
            ? [
                new THREE.Vector2(0, 0),
                new THREE.Vector2(meta.radius * 0.75, 0.02),
                new THREE.Vector2(meta.radius * 0.88, meta.height * 0.08),
                new THREE.Vector2(meta.radius * 0.98, meta.height * 0.18),
                new THREE.Vector2(meta.radius * 1.06, meta.height * 0.4),
                new THREE.Vector2(meta.radius * 1.02, meta.height * 0.64),
                new THREE.Vector2(meta.radius * 0.9, meta.height * 0.82),
                new THREE.Vector2(meta.radius * 0.76, meta.height * 0.92),
                new THREE.Vector2(meta.radius * 0.62, meta.height * 0.985),
                new THREE.Vector2(meta.radius * 0.48, stoutShoulderTop),
                new THREE.Vector2(0, stoutShoulderTop + 0.02)
              ]
            : [
                new THREE.Vector2(0, 0),
                new THREE.Vector2(meta.radius * 0.75, 0.02),
                new THREE.Vector2(meta.radius * 0.88, meta.height * 0.08),
                new THREE.Vector2(meta.radius * 0.98, meta.height * 0.18),
                new THREE.Vector2(meta.radius * 1.06, meta.height * 0.38),
                new THREE.Vector2(meta.radius * 1.0, meta.height * 0.62),
                new THREE.Vector2(meta.radius * 0.82, meta.height * 0.82),
                new THREE.Vector2(meta.radius * 0.56, meta.height * 0.94),
                new THREE.Vector2(meta.radius * 0.4, stoutShoulderTop),
                new THREE.Vector2(0, stoutShoulderTop + 0.02)
              ];
          const stoutBodyGeo = new THREE.LatheGeometry(stoutBodyProfile, 48);
          const stoutBody = new THREE.Mesh(stoutBodyGeo, mat);
          stoutBody.castShadow = true;
          group.add(stoutBody);

          const stoutHeadGeo = new THREE.SphereGeometry(meta.head, 32, 32);
          const stoutHead = new THREE.Mesh(stoutHeadGeo, mat);
          stoutHead.position.y = meta.height + meta.head * (stoutUsesFlatCylinderNeck ? 1.02 : 0.64);
          stoutHead.castShadow = true;
          group.add(stoutHead);
          addRoundedNeck(stoutShoulderTop, stoutHead.position.y, meta.head, meta.radius);
          mainBody = stoutBody;
          faceAnchor = stoutHead;
          break;

        case 'rounded-peg': // 圆润直身圆头
          const roundedUsesFlatCylinderNeck = meta.neckStyle === "flat-cylinder";
          const roundedShoulderTop = meta.height + meta.radius * (roundedUsesFlatCylinderNeck ? 0.12 : 0.1);
          const roundedBodyProfile = roundedUsesFlatCylinderNeck
            ? [
                new THREE.Vector2(0, 0),
                new THREE.Vector2(meta.radius * 0.7, 0.02),
                new THREE.Vector2(meta.radius * 0.85, meta.height * 0.08),
                new THREE.Vector2(meta.radius * 0.98, meta.height * 0.22),
                new THREE.Vector2(meta.radius * 1.04, meta.height * 0.42),
                new THREE.Vector2(meta.radius * 0.99, meta.height * 0.54),
                new THREE.Vector2(meta.radius * 0.96, meta.height * 0.74),
                new THREE.Vector2(meta.radius * 0.88, meta.height * 0.86),
                new THREE.Vector2(meta.radius * 0.74, meta.height * 0.94),
                new THREE.Vector2(meta.radius * 0.6, meta.height * 0.99),
                new THREE.Vector2(meta.radius * 0.46, roundedShoulderTop),
                new THREE.Vector2(0, roundedShoulderTop + 0.02)
              ]
            : [
                new THREE.Vector2(0, 0),
                new THREE.Vector2(meta.radius * 0.7, 0.02),
                new THREE.Vector2(meta.radius * 0.85, meta.height * 0.08),
                new THREE.Vector2(meta.radius * 0.98, meta.height * 0.22),
                new THREE.Vector2(meta.radius * 1.04, meta.height * 0.42),
                new THREE.Vector2(meta.radius * 0.99, meta.height * 0.52),
                new THREE.Vector2(meta.radius * 0.96, meta.height * 0.78),
                new THREE.Vector2(meta.radius * 0.82, meta.height * 0.94),
                new THREE.Vector2(meta.radius * 0.58, roundedShoulderTop),
                new THREE.Vector2(0, roundedShoulderTop + 0.02)
              ];
          const roundedBodyGeo = new THREE.LatheGeometry(roundedBodyProfile, 48);
          const roundedBody = new THREE.Mesh(roundedBodyGeo, mat);
          roundedBody.castShadow = true;
          group.add(roundedBody);

          const roundedHeadGeo = new THREE.SphereGeometry(meta.head, 32, 32);
          const roundedHead = new THREE.Mesh(roundedHeadGeo, mat);
          roundedHead.position.y = meta.height + meta.head * (roundedUsesFlatCylinderNeck ? 1.02 : 0.66);
          roundedHead.castShadow = true;
          group.add(roundedHead);
          addRoundedNeck(roundedShoulderTop, roundedHead.position.y, meta.head, meta.radius);
          mainBody = roundedBody;
          faceAnchor = roundedHead;
          break;

        case 'ball-cylinder': // 球头 + 直圆柱身，顶部圆滑过渡到头部
          const bcUsesFlatCylinderNeck = meta.neckStyle === "flat-cylinder";
          const bcShoulderTop = bcUsesFlatCylinderNeck ? meta.height : meta.height + meta.radius * 0.14;
          const bcBodyProfile = bcUsesFlatCylinderNeck
            ? [
                new THREE.Vector2(0, 0),
                new THREE.Vector2(meta.radius * 0.96, 0.02),
                new THREE.Vector2(meta.radius, meta.height * 0.08),
                new THREE.Vector2(meta.radius, meta.height * 0.78),
                new THREE.Vector2(meta.radius * 0.985, meta.height * 0.9),
                new THREE.Vector2(meta.radius * 0.95, meta.height * 0.965),
                new THREE.Vector2(meta.radius * 0.88, meta.height),
                new THREE.Vector2(0, meta.height + 0.02)
              ]
            : [
                new THREE.Vector2(0, 0),
                new THREE.Vector2(meta.radius * 0.98, 0.02),
                new THREE.Vector2(meta.radius, meta.height * 0.72),
                new THREE.Vector2(meta.radius, meta.height * 0.88),
                new THREE.Vector2(meta.radius * 0.94, meta.height * 0.95),
                new THREE.Vector2(meta.radius * 0.8, meta.height + meta.radius * 0.02),
                new THREE.Vector2(meta.radius * 0.62, meta.height + meta.radius * 0.08),
                new THREE.Vector2(meta.radius * 0.46, bcShoulderTop),
                new THREE.Vector2(0, bcShoulderTop + 0.02)
              ];
          const bcBodyGeo = new THREE.LatheGeometry(bcBodyProfile, 48);
          const bcBody = new THREE.Mesh(bcBodyGeo, mat);
          bcBody.castShadow = true;
          group.add(bcBody);

          const bcHeadGeo = new THREE.SphereGeometry(meta.head, 32, 32);
          const bcHead = new THREE.Mesh(bcHeadGeo, mat);
          bcHead.position.y = bcUsesFlatCylinderNeck
            ? meta.height + meta.head * 1.04
            : meta.height + meta.head * 0.68;
          bcHead.castShadow = true;
          group.add(bcHead);
          addRoundedNeck(bcShoulderTop, bcHead.position.y, meta.head, meta.radius);
          mainBody = bcBody;
          faceAnchor = bcHead;
          break;

        case 'cone-round': // 圆锥圆头
          const crBodyGeo = new THREE.CylinderGeometry(meta.radiusTop, meta.radius, meta.height, 32);
          const crBody = new THREE.Mesh(crBodyGeo, mat);
          crBody.position.y = meta.height / 2;
          crBody.castShadow = true;
          group.add(crBody);

          const crHeadGeo = new THREE.SphereGeometry(meta.head, 32, 32);
          const crHead = new THREE.Mesh(crHeadGeo, mat);
          crHead.position.y = meta.height + meta.head * 0.6;
          crHead.castShadow = true;
          group.add(crHead);
          addRoundedNeck(meta.height, crHead.position.y, meta.head, meta.radiusTop);
          mainBody = crBody;
          faceAnchor = crHead;
          break;

        case 'curved-cone-round': // 带弧度的圆头锥身
          const ccrUsesFlatCylinderNeck = meta.neckStyle === "flat-cylinder";
          const ccrUsesBellReference = meta.bodyCurveStyle === "bell-reference";
          
          const ccrNeckRadius = Math.min(
            Math.max(meta.radiusTop * 0.6, meta.head * 0.51),
            meta.head * 0.87
          );
          const ccrNeckBottomRadius = ccrNeckRadius * 1.1;
          const ccrNeckBottomY = meta.height + meta.head * 0.05;

          const ccrProfile = ccrUsesBellReference
            ? [
                new THREE.Vector2(0, 0),
                new THREE.Vector2(meta.radius * 0.98, 0.02),
                new THREE.Vector2(meta.radius, meta.height * 0.1),
                new THREE.Vector2(meta.radius * 0.95 + ccrNeckBottomRadius * 0.05, meta.height * 0.25),
                new THREE.Vector2(meta.radius * 0.85 + ccrNeckBottomRadius * 0.15, meta.height * 0.45),
                new THREE.Vector2(meta.radius * 0.65 + ccrNeckBottomRadius * 0.35, meta.height * 0.65),
                new THREE.Vector2(meta.radius * 0.4 + ccrNeckBottomRadius * 0.6, meta.height * 0.8),
                new THREE.Vector2(meta.radius * 0.15 + ccrNeckBottomRadius * 0.85, meta.height * 0.92),
                new THREE.Vector2(ccrNeckBottomRadius * 1.03, ccrNeckBottomY - 0.04),
                new THREE.Vector2(ccrNeckBottomRadius * 1.01, ccrNeckBottomY + 0.02),
                new THREE.Vector2(ccrNeckBottomRadius * 0.9, ccrNeckBottomY + 0.06),
                new THREE.Vector2(0, ccrNeckBottomY + 0.1)
              ]
            : ccrUsesFlatCylinderNeck
            ? [
                new THREE.Vector2(0, 0),
                new THREE.Vector2(meta.radius * 0.92, 0.02),
                new THREE.Vector2(meta.radius, meta.height * 0.08),
                new THREE.Vector2(meta.radius * 1.0, meta.height * 0.2),
                new THREE.Vector2(meta.radius * 0.99, meta.height * 0.46),
                new THREE.Vector2(meta.radius * 0.95, meta.height * 0.7),
                new THREE.Vector2(meta.radius * 0.88, meta.height * 0.85),
                new THREE.Vector2(meta.radiusTop * 0.94, meta.height * 0.92),
                new THREE.Vector2(meta.radiusTop * 0.82, meta.height * 0.975),
                new THREE.Vector2(meta.radiusTop * 0.68, meta.height + meta.radius * 0.03),
                new THREE.Vector2(meta.radiusTop * 0.68, meta.height + meta.radius * 0.08),
                new THREE.Vector2(0, meta.height + meta.radius * 0.12)
              ]
            : [
                new THREE.Vector2(0, 0),
                new THREE.Vector2(meta.radius * 0.92, 0.02),
                new THREE.Vector2(meta.radius, meta.height * 0.08),
                new THREE.Vector2(meta.radius * 1.01, meta.height * 0.18),
                new THREE.Vector2(meta.radius * 0.98, meta.height * 0.38),
                new THREE.Vector2(meta.radius * 0.9, meta.height * 0.6),
                new THREE.Vector2(meta.radius * 0.76, meta.height * 0.82),
                new THREE.Vector2(meta.radiusTop * 1.22, meta.height * 0.96),
                new THREE.Vector2(meta.radiusTop * 1.02, meta.height + meta.radius * 0.04),
                new THREE.Vector2(0, meta.height + meta.radius * 0.06)
              ];
          const ccrBodyGeo = new THREE.LatheGeometry(ccrProfile, 48);
          const ccrBody = new THREE.Mesh(ccrBodyGeo, mat);
          ccrBody.castShadow = true;
          group.add(ccrBody);

          const ccrHeadGeo = new THREE.SphereGeometry(meta.head, 32, 32);
          const ccrHead = new THREE.Mesh(ccrHeadGeo, mat);
          ccrHead.position.y = meta.height + meta.head * (ccrUsesFlatCylinderNeck ? 1.04 : 0.62);
          ccrHead.castShadow = true;
          group.add(ccrHead);
          addRoundedNeck(meta.height + meta.radius * (ccrUsesFlatCylinderNeck ? 0.08 : 0.04), ccrHead.position.y, meta.head, meta.radiusTop);
          mainBody = ccrBody;
          faceAnchor = ccrHead;
          break;

        case 'pointed-cylinder': // 圆柱身 + 尖顶
          const ptBodyGeo = new THREE.CylinderGeometry(meta.radius, meta.radius, meta.height, 32);
          const ptBody = new THREE.Mesh(ptBodyGeo, mat);
          ptBody.position.y = meta.height / 2;
          ptBody.castShadow = true;
          group.add(ptBody);

          const ptTipGeo = new THREE.ConeGeometry(meta.radius * 0.92, meta.tipHeight, 32);
          const ptTip = new THREE.Mesh(ptTipGeo, mat);
          ptTip.position.y = meta.height + meta.tipHeight / 2 - 0.04;
          ptTip.castShadow = true;
          group.add(ptTip);
          mainBody = ptBody;
          faceAnchor = ptBody;
          break;

        case 'stacked-drop': // 上下双段圆润身形，中间收腰
          const sdTotalHeight = (meta.lowerHeight || 3.2) + (meta.upperHeight || 3.0);
          const sdLowerTop = meta.lowerHeight || 3.2;
          const sdWaistY = sdLowerTop + 0.06;
          const sdProfile = [
            new THREE.Vector2(0, 0),
            new THREE.Vector2(meta.radius * 0.96, 0.02),
            new THREE.Vector2(meta.radius, sdLowerTop * 0.18),
            new THREE.Vector2(meta.radius * 0.98, sdLowerTop * 0.54),
            new THREE.Vector2(meta.radius * 0.92, sdLowerTop * 0.82),
            new THREE.Vector2(meta.waistRadius * 1.04, sdLowerTop - 0.06),
            new THREE.Vector2(meta.waistRadius, sdWaistY),
            new THREE.Vector2(meta.upperRadius * 0.84, sdWaistY + meta.upperHeight * 0.16),
            new THREE.Vector2(meta.upperRadius, sdWaistY + meta.upperHeight * 0.46),
            new THREE.Vector2(meta.upperRadius * 0.94, sdWaistY + meta.upperHeight * 0.68),
            new THREE.Vector2(meta.upperRadius * 0.76, sdWaistY + meta.upperHeight * 0.86),
            new THREE.Vector2(meta.upperRadius * 0.5, sdWaistY + meta.upperHeight * 0.97),
            new THREE.Vector2(meta.upperRadius * 0.26, sdTotalHeight * 1.01),
            new THREE.Vector2(meta.tipRadius || 0.18, sdTotalHeight * 1.03),
            new THREE.Vector2(0, sdTotalHeight * 1.045)
          ];
          const sdGeo = new THREE.LatheGeometry(sdProfile, 48);
          const sdMesh = new THREE.Mesh(sdGeo, mat);
          sdMesh.castShadow = true;
          group.add(sdMesh);
          mainBody = sdMesh;
          faceAnchor = sdMesh;
          break;

        case 'cone-cap': // 原下身 + 球头 + 高圆润尖帽
          const ccLowerTop = meta.lowerHeight || 3.34;
          const ccWaistY = ccLowerTop + 0.06;
          const ccHeadRadius = meta.headRadius || 1.02;
          const ccHeadCenterY = ccWaistY + ccHeadRadius * 0.7; // 0.7：头部多埋入身体，缩短脖子
          const ccCapBaseY = ccHeadCenterY + ccHeadRadius * (meta.capYOffset !== undefined ? meta.capYOffset : 0.54);
          const ccCapHeight = meta.capHeight || 2.74;
          const ccCapTopY = ccCapBaseY + ccCapHeight;
          const ccProfile = [
            // 裙形下身：轮廓参考 7 号裙子，裙摆在低处即达满宽，向上缓慢收窄
            new THREE.Vector2(0, 0),
            new THREE.Vector2(meta.radius * 0.94, 0.02),
            new THREE.Vector2(meta.radius, ccLowerTop * 0.1),
            new THREE.Vector2(meta.radius * 0.99, ccLowerTop * 0.24),
            new THREE.Vector2(meta.radius * 0.95, ccLowerTop * 0.48),
            new THREE.Vector2(meta.radius * 0.88, ccLowerTop * 0.72),
            new THREE.Vector2(meta.radius * 0.76, ccLowerTop * 0.88),
            new THREE.Vector2((meta.waistRadius || 0.94) * 1.02, ccLowerTop * 0.95),
            new THREE.Vector2(meta.waistRadius || 0.94, ccWaistY),
            new THREE.Vector2((meta.waistRadius || 0.94) * 0.94, ccWaistY + 0.03),
            new THREE.Vector2(0, ccWaistY + 0.04)
          ];
          const ccBodyGeo = new THREE.LatheGeometry(ccProfile, 48);
          const ccBody = new THREE.Mesh(ccBodyGeo, mat);
          ccBody.castShadow = true;
          group.add(ccBody);

          const ccHeadGeo = new THREE.SphereGeometry(ccHeadRadius, 32, 32);
          const ccHead = new THREE.Mesh(ccHeadGeo, mat);
          ccHead.position.y = ccHeadCenterY;
          ccHead.castShadow = true;
          group.add(ccHead);
          addRoundedNeck(ccWaistY, ccHead.position.y, ccHeadRadius, meta.waistRadius || 0.94);

          const isCcSharp = meta.sharpTop;
          const capR = meta.capRadius || 1.22;
          const ccCapProfile = isCcSharp ? [
            // 直筒尖帽：从帽檐起保持平直，上部快速收窄成尖顶
            new THREE.Vector2(0, 0),
            new THREE.Vector2(capR, 0),
            new THREE.Vector2(capR, ccCapHeight * 0.4),
            new THREE.Vector2(capR * 0.99, ccCapHeight * 0.55),
            new THREE.Vector2(capR * 0.94, ccCapHeight * 0.67),
            new THREE.Vector2(capR * 0.80, ccCapHeight * 0.78),
            new THREE.Vector2(capR * 0.60, ccCapHeight * 0.88),
            new THREE.Vector2(capR * 0.38, ccCapHeight * 0.95),
            new THREE.Vector2(meta.tipRadius || 0.01, ccCapTopY - ccCapBaseY),
            new THREE.Vector2(0, ccCapTopY - ccCapBaseY + 0.01)
          ] : [
            new THREE.Vector2(0, 0),
            new THREE.Vector2(capR * 0.96, 0.02),
            new THREE.Vector2(capR, ccCapHeight * 0.14),
            new THREE.Vector2(capR * 0.98, ccCapHeight * 0.28),
            new THREE.Vector2(capR * 0.92, ccCapHeight * 0.48),
            new THREE.Vector2(capR * 0.78, ccCapHeight * 0.68),
            new THREE.Vector2(capR * 0.58, ccCapHeight * 0.84),
            new THREE.Vector2(capR * 0.4, ccCapHeight * 0.94),
            new THREE.Vector2(capR * 0.28, ccCapHeight * 0.99),
            new THREE.Vector2(meta.tipRadius || 0.24, ccCapTopY - ccCapBaseY),
            new THREE.Vector2((meta.tipRadius || 0.24) * 0.78, ccCapTopY - ccCapBaseY + 0.06),
            new THREE.Vector2(0, ccCapTopY - ccCapBaseY + 0.08)
          ];
          const ccCapGeo = new THREE.LatheGeometry(ccCapProfile, 48);
          const ccCap = new THREE.Mesh(ccCapGeo, mat);
          ccCap.position.y = ccCapBaseY;
          ccCap.castShadow = true;
          group.add(ccCap);
          mainBody = ccBody;
          faceAnchor = ccHead;
          break;

        case 'bulb-base': // 头球 + 胸球 + 裙子 + 腿部 + 脚
          const bbUsesFlatCylinderNeck = meta.neckStyle === "flat-cylinder";
          const bbSkirtRadius = meta.radius || 1.34;
          const bbSkirtHeight = meta.skirtHeight || 2.06;
          const bbSkirtTopRadius = meta.skirtTopRadius || 1.08;
          const bbTorsoRadius = meta.torsoRadius || 1.08;
          const bbHeadRadius = meta.headRadius || 0.8;
          const bbLegRadius = meta.legRadius || 0.78;
          const bbLegHeight = meta.legHeight || 0.82;
          const bbFootRadius = meta.footRadius || 1.0;
          const bbFootHeight = meta.footHeight || 0.22;

          const bbFootProfile = [
            new THREE.Vector2(0, 0),
            new THREE.Vector2(bbFootRadius * 0.96, 0.02),
            new THREE.Vector2(bbFootRadius, bbFootHeight * 0.32),
            new THREE.Vector2(bbFootRadius * 0.98, bbFootHeight * 0.8),
            new THREE.Vector2(bbFootRadius * 0.9, bbFootHeight),
            new THREE.Vector2(0, bbFootHeight + 0.02)
          ];
          const bbFootGeo = new THREE.LatheGeometry(bbFootProfile, 48);
          const bbFoot = new THREE.Mesh(bbFootGeo, mat);
          bbFoot.castShadow = true;
          group.add(bbFoot);

          const bbLegProfile = [
            new THREE.Vector2(0, 0),
            new THREE.Vector2(bbLegRadius * 0.82, 0.02),
            new THREE.Vector2(bbLegRadius, bbLegHeight * 0.18),
            new THREE.Vector2(bbLegRadius * 0.98, bbLegHeight * 0.78),
            new THREE.Vector2(bbLegRadius * 0.84, bbLegHeight),
            new THREE.Vector2(0, bbLegHeight + 0.02)
          ];
          const bbLegGeo = new THREE.LatheGeometry(bbLegProfile, 48);
          const bbLeg = new THREE.Mesh(bbLegGeo, mat);
          bbLeg.position.y = bbFootHeight - 0.02;
          bbLeg.castShadow = true;
          group.add(bbLeg);

          const bbSkirtProfile = [
            new THREE.Vector2(0, 0),
            new THREE.Vector2(bbSkirtRadius * 0.94, 0.02),
            new THREE.Vector2(bbSkirtRadius, bbSkirtHeight * 0.1),
            new THREE.Vector2(bbSkirtRadius * 0.99, bbSkirtHeight * 0.24),
            new THREE.Vector2(bbSkirtRadius * 0.95, bbSkirtHeight * 0.48),
            new THREE.Vector2(bbSkirtRadius * 0.88, bbSkirtHeight * 0.72),
            new THREE.Vector2(bbSkirtRadius * 0.76, bbSkirtHeight * 0.88),
            new THREE.Vector2(bbSkirtTopRadius * 0.86, bbSkirtHeight * 0.95),
            new THREE.Vector2(bbSkirtTopRadius * 0.82, bbSkirtHeight),
            new THREE.Vector2(bbSkirtTopRadius * 0.54, bbSkirtHeight + 0.08),
            new THREE.Vector2(0, bbSkirtHeight + 0.12)
          ];
          const bbSkirtGeo = new THREE.LatheGeometry(bbSkirtProfile, 48);
          const bbSkirt = new THREE.Mesh(bbSkirtGeo, mat);
          bbSkirt.position.y = bbFootHeight + bbLegHeight - 0.04;
          bbSkirt.castShadow = true;
          group.add(bbSkirt);

          const bbTorsoGeo = new THREE.SphereGeometry(bbTorsoRadius, 32, 32);
          const bbTorso = new THREE.Mesh(bbTorsoGeo, mat);
          bbTorso.position.y = bbFootHeight + bbLegHeight + bbSkirtHeight + bbTorsoRadius * 0.64;
          bbTorso.castShadow = true;
          group.add(bbTorso);

          const bbHeadGeo = new THREE.SphereGeometry(bbHeadRadius, 32, 32);
          const bbHead = new THREE.Mesh(bbHeadGeo, mat);
          bbHead.position.y = bbTorso.position.y
            + bbTorsoRadius * (bbUsesFlatCylinderNeck ? 0.9 : 0.82)
            + bbHeadRadius * (bbUsesFlatCylinderNeck ? 1.02 : 0.7);
          bbHead.castShadow = true;
          group.add(bbHead);
          addRoundedNeck(
            bbTorso.position.y + bbTorsoRadius * (bbUsesFlatCylinderNeck ? 0.56 : 0.28),
            bbHead.position.y,
            bbHeadRadius,
            bbTorsoRadius
          );
          mainBody = bbSkirt;
          faceAnchor = bbHead;
          break;

        case 'skirt-leg': // 头球 + 裙子 + 腿部 + 脚部
          const slUsesFlatCylinderNeck = meta.neckStyle === "flat-cylinder";
          const slUsesBellReference = meta.bodyCurveStyle === "bell-reference";
          const slSkirtRadius = meta.radius || 1.16;
          const slSkirtHeight = meta.skirtHeight || 2.9;
          const slSkirtTopRadius = meta.skirtTopRadius || 0.94;
          const slHeadRadius = meta.headRadius || 0.82;
          const slLegRadius = meta.legRadius || 0.64;
          const slLegHeight = meta.legHeight || 0.9;
          const slFootRadius = meta.footRadius || 0.98;
          const slFootHeight = meta.footHeight || 0.24;

          const slFootProfile = [
            new THREE.Vector2(0, 0),
            new THREE.Vector2(slFootRadius * 0.96, 0.02),
            new THREE.Vector2(slFootRadius, slFootHeight * 0.34),
            new THREE.Vector2(slFootRadius * 0.98, slFootHeight * 0.82),
            new THREE.Vector2(slFootRadius * 0.9, slFootHeight),
            new THREE.Vector2(0, slFootHeight + 0.02)
          ];
          const slFootGeo = new THREE.LatheGeometry(slFootProfile, 48);
          const slFoot = new THREE.Mesh(slFootGeo, mat);
          slFoot.castShadow = true;
          group.add(slFoot);

          const slLegProfile = [
            new THREE.Vector2(0, 0),
            new THREE.Vector2(slLegRadius * 0.82, 0.02),
            new THREE.Vector2(slLegRadius, slLegHeight * 0.18),
            new THREE.Vector2(slLegRadius * 0.98, slLegHeight * 0.8),
            new THREE.Vector2(slLegRadius * 0.84, slLegHeight),
            new THREE.Vector2(0, slLegHeight + 0.02)
          ];
          const slLegGeo = new THREE.LatheGeometry(slLegProfile, 48);
          const slLeg = new THREE.Mesh(slLegGeo, mat);
          slLeg.position.y = slFootHeight - 0.02;
          slLeg.castShadow = true;
          group.add(slLeg);

          const slNeckRadius = Math.min(
            Math.max(slSkirtTopRadius * 0.6, slHeadRadius * 0.51),
            slHeadRadius * 0.87
          );
          const slNeckBottomRadius = slNeckRadius * 1.1;
          const slNeckBottomLocalY = slSkirtHeight + 0.04 - slHeadRadius * 0.07;

          const slSkirtProfile = slUsesBellReference
            ? [
                new THREE.Vector2(0, 0),
                new THREE.Vector2(slSkirtRadius * 0.98, 0.02),
                new THREE.Vector2(slSkirtRadius, slSkirtHeight * 0.1),
                new THREE.Vector2(slSkirtRadius * 0.95 + slNeckBottomRadius * 0.05, slSkirtHeight * 0.25),
                new THREE.Vector2(slSkirtRadius * 0.85 + slNeckBottomRadius * 0.15, slSkirtHeight * 0.45),
                new THREE.Vector2(slSkirtRadius * 0.65 + slNeckBottomRadius * 0.35, slSkirtHeight * 0.65),
                new THREE.Vector2(slSkirtRadius * 0.4 + slNeckBottomRadius * 0.6, slSkirtHeight * 0.8),
                new THREE.Vector2(slSkirtRadius * 0.15 + slNeckBottomRadius * 0.85, slSkirtHeight * 0.92),
                new THREE.Vector2(slNeckBottomRadius * 1.03, slNeckBottomLocalY - 0.04),
                new THREE.Vector2(slNeckBottomRadius * 1.01, slNeckBottomLocalY + 0.02),
                new THREE.Vector2(slNeckBottomRadius * 0.9, slNeckBottomLocalY + 0.06),
                new THREE.Vector2(0, slNeckBottomLocalY + 0.1)
              ]
            : [
                new THREE.Vector2(0, 0),
                new THREE.Vector2(slSkirtRadius * 0.94, 0.02),
                new THREE.Vector2(slSkirtRadius, slSkirtHeight * 0.1),
                new THREE.Vector2(slSkirtRadius * 0.99, slSkirtHeight * 0.24),
                new THREE.Vector2(slSkirtRadius * 0.95, slSkirtHeight * 0.48),
                new THREE.Vector2(slSkirtRadius * 0.8, slSkirtHeight * 0.7),
                new THREE.Vector2(slSkirtRadius * 0.62, slSkirtHeight * 0.86),
                new THREE.Vector2(slSkirtTopRadius * 0.76, slSkirtHeight * 0.94),
                new THREE.Vector2(slSkirtTopRadius * 0.72, slSkirtHeight),
                new THREE.Vector2(slSkirtTopRadius * 0.5, slSkirtHeight + 0.08),
                new THREE.Vector2(0, slSkirtHeight + 0.12)
              ];
          const slSkirtGeo = new THREE.LatheGeometry(slSkirtProfile, 48);
          const slSkirt = new THREE.Mesh(slSkirtGeo, mat);
          slSkirt.position.y = slFootHeight + slLegHeight - 0.04;
          slSkirt.castShadow = true;
          group.add(slSkirt);

          const slHeadGeo = new THREE.SphereGeometry(slHeadRadius, 32, 32);
          const slHead = new THREE.Mesh(slHeadGeo, mat);
          slHead.position.y = slFootHeight + slLegHeight + slSkirtHeight + slHeadRadius * (slUsesFlatCylinderNeck ? 1.02 : 0.58);
          slHead.castShadow = true;
          group.add(slHead);
          addRoundedNeck(
            slFootHeight + slLegHeight + slSkirtHeight + (slUsesFlatCylinderNeck ? 0.04 : 0),
            slHead.position.y,
            slHeadRadius,
            slSkirtTopRadius
          );
          mainBody = slSkirt;
          faceAnchor = slHead;
          break;

        case 'round-cap': // 躯干 + 球头 + 小圆帽 + 顶部小球
          const rcUsesFlatCylinderNeck = meta.neckStyle === "flat-cylinder";
          const rcUsesBellReference = meta.bodyCurveStyle === "bell-reference";
          const rcBodyHeight = meta.lowerHeight || 3.84;
          const rcBodyTopRadius = meta.waistRadius || 0.9;
          const rcHeadRadius = meta.headRadius || 1.08;
          const rcHatRadius = meta.capRadius || 1.04;
          const rcHatHeight = meta.capHeight || 0.78;
          const rcTopBallRadius = meta.capTopRadius || 0.34;
          
          const rcNeckRadius = Math.min(
            Math.max(rcBodyTopRadius * 0.6, rcHeadRadius * 0.51),
            rcHeadRadius * 0.87
          );
          const rcNeckBottomRadius = rcNeckRadius * 1.1;
          const rcNeckBottomLocalY = rcBodyHeight + rcHeadRadius * 0.05;

          const rcBodyProfile = rcUsesBellReference
            ? [
                new THREE.Vector2(0, 0),
                new THREE.Vector2((meta.radius || 1.48) * 0.98, 0.02),
                new THREE.Vector2(meta.radius || 1.48, rcBodyHeight * 0.1),
                new THREE.Vector2((meta.radius || 1.48) * 0.95 + rcNeckBottomRadius * 0.05, rcBodyHeight * 0.25),
                new THREE.Vector2((meta.radius || 1.48) * 0.85 + rcNeckBottomRadius * 0.15, rcBodyHeight * 0.45),
                new THREE.Vector2((meta.radius || 1.48) * 0.65 + rcNeckBottomRadius * 0.35, rcBodyHeight * 0.65),
                new THREE.Vector2((meta.radius || 1.48) * 0.4 + rcNeckBottomRadius * 0.6, rcBodyHeight * 0.8),
                new THREE.Vector2((meta.radius || 1.48) * 0.15 + rcNeckBottomRadius * 0.85, rcBodyHeight * 0.92),
                new THREE.Vector2(rcNeckBottomRadius * 1.03, rcNeckBottomLocalY - 0.04),
                new THREE.Vector2(rcNeckBottomRadius * 1.01, rcNeckBottomLocalY + 0.02),
                new THREE.Vector2(rcNeckBottomRadius * 0.9, rcNeckBottomLocalY + 0.06),
                new THREE.Vector2(0, rcNeckBottomLocalY + 0.1)
              ]
            : rcUsesFlatCylinderNeck
            ? [
                new THREE.Vector2(0, 0),
                new THREE.Vector2((meta.radius || 1.48) * 0.96, 0.02),
                new THREE.Vector2(meta.radius || 1.48, rcBodyHeight * 0.18),
                new THREE.Vector2((meta.radius || 1.48) * 1.0, rcBodyHeight * 0.5),
                new THREE.Vector2((meta.radius || 1.48) * 0.98, rcBodyHeight * 0.72),
                new THREE.Vector2((meta.radius || 1.48) * 0.92, rcBodyHeight * 0.86),
                new THREE.Vector2(rcBodyTopRadius * 0.94, rcBodyHeight * 0.92),
                new THREE.Vector2(rcBodyTopRadius * 0.82, rcBodyHeight * 0.975),
                new THREE.Vector2(rcBodyTopRadius * 0.68, rcBodyHeight + 0.03),
                new THREE.Vector2(rcBodyTopRadius * 0.58, rcBodyHeight + 0.09),
                new THREE.Vector2(0, rcBodyHeight + 0.11)
              ]
            : [
                new THREE.Vector2(0, 0),
                new THREE.Vector2((meta.radius || 1.48) * 0.96, 0.02),
                new THREE.Vector2(meta.radius || 1.48, rcBodyHeight * 0.18),
                new THREE.Vector2((meta.radius || 1.48) * 0.99, rcBodyHeight * 0.56),
                new THREE.Vector2((meta.radius || 1.48) * 0.92, rcBodyHeight * 0.82),
                new THREE.Vector2(rcBodyTopRadius * 1.06, rcBodyHeight - 0.08),
                new THREE.Vector2(rcBodyTopRadius, rcBodyHeight),
                new THREE.Vector2(0, rcBodyHeight + 0.02)
              ];
          const rcBodyGeo = new THREE.LatheGeometry(rcBodyProfile, 48);
          const rcBody = new THREE.Mesh(rcBodyGeo, mat);
          rcBody.castShadow = true;
          group.add(rcBody);

          const rcHeadGeo = new THREE.SphereGeometry(rcHeadRadius, 32, 32);
          const rcHead = new THREE.Mesh(rcHeadGeo, mat);
          rcHead.position.y = rcBodyHeight + rcHeadRadius * (rcUsesFlatCylinderNeck ? 1.08 : 0.78) + (meta.headYOffset || 0);
          rcHead.castShadow = true;
          group.add(rcHead);
          addRoundedNeck(rcBodyHeight + (rcUsesFlatCylinderNeck ? 0.04 : 0), rcHead.position.y, rcHeadRadius, rcBodyTopRadius);

          const rcHatGeo = new THREE.SphereGeometry(rcHatRadius, 32, 32);
          const rcHat = new THREE.Mesh(rcHatGeo, mat);
          rcHat.scale.y = rcHatHeight / (rcHatRadius * 2);
          rcHat.position.y = rcHead.position.y + rcHeadRadius * 0.94 + (meta.hatYOffset || 0);
          rcHat.castShadow = true;
          group.add(rcHat);

          const rcTopBallGeo = new THREE.SphereGeometry(rcTopBallRadius, 24, 24);
          const rcTopBall = new THREE.Mesh(rcTopBallGeo, mat);
          rcTopBall.position.y = rcHat.position.y + rcHatHeight * 0.44 + rcTopBallRadius * 0.68 + (meta.topBallYOffset || 0);
          rcTopBall.castShadow = true;
          group.add(rcTopBall);

          mainBody = rcBody;
          faceAnchor = rcHead;
          break;

        case 'wavy-peg': // 波浪形圆柱 + 顶球
          const waveAmplitude = meta.waveAmplitude || 0.18;
          const waveCount = meta.waveCount || 4;
          const wpProfile = [
            new THREE.Vector2(0, 0),
            ...Array.from({ length: 11 }, (_, index) => {
              const t = index / 10;
              const radius = meta.radius * (0.92 + Math.sin(t * Math.PI * waveCount) * waveAmplitude);
              return new THREE.Vector2(radius, meta.height * t);
            }),
            new THREE.Vector2(meta.radius * 0.48, meta.height + meta.radius * 0.18),
            new THREE.Vector2(0, meta.height + meta.radius * 0.22)
          ];
          const wpBodyGeo = new THREE.LatheGeometry(wpProfile, 48);
          const wpBody = new THREE.Mesh(wpBodyGeo, mat);
          wpBody.castShadow = true;
          group.add(wpBody);

          const wpHeadGeo = new THREE.SphereGeometry(meta.head, 32, 32);
          const wpHead = new THREE.Mesh(wpHeadGeo, mat);
          wpHead.position.y = meta.height + meta.head * 0.74;
          wpHead.castShadow = true;
          group.add(wpHead);
          addRoundedNeck(meta.height + meta.radius * 0.08, wpHead.position.y, meta.head, meta.radius * 0.58);
          mainBody = wpBody;
          faceAnchor = wpHead;
          break;

        case 'hat-peg': // 圆柱或波浪身 + 小礼帽
          let hpBody;
          if (meta.wavy) {
            const hpWaveProfile = [
              new THREE.Vector2(0, 0),
              ...Array.from({ length: 11 }, (_, index) => {
                const t = index / 10;
                const radius = meta.radius * (0.94 + Math.sin(t * Math.PI * (meta.waveCount || 4)) * (meta.waveAmplitude || 0.16));
                return new THREE.Vector2(radius, meta.height * t);
              }),
              new THREE.Vector2(meta.radius * 0.64, meta.height + meta.radius * 0.08),
              new THREE.Vector2(0, meta.height + meta.radius * 0.1)
            ];
            const hpBodyGeo = new THREE.LatheGeometry(hpWaveProfile, 48);
            hpBody = new THREE.Mesh(hpBodyGeo, mat);
          } else {
            const hpBodyGeo = new THREE.CylinderGeometry(meta.radius * 0.9, meta.radius, meta.height, 32);
            hpBody = new THREE.Mesh(hpBodyGeo, mat);
            hpBody.position.y = meta.height / 2;
          }
          hpBody.castShadow = true;
          group.add(hpBody);

          const hpBrimGeo = new THREE.CylinderGeometry(meta.brimRadius, meta.brimRadius, 0.22, 32);
          const hpBrim = new THREE.Mesh(hpBrimGeo, mat);
          hpBrim.position.y = meta.height + 0.18;
          hpBrim.castShadow = true;
          group.add(hpBrim);

          const hpHatGeo = new THREE.CylinderGeometry(meta.hatRadius, meta.hatRadius, meta.hatHeight, 32);
          const hpHat = new THREE.Mesh(hpHatGeo, mat);
          hpHat.position.y = meta.height + meta.hatHeight * 0.5 + 0.28;
          hpHat.castShadow = true;
          group.add(hpHat);
          mainBody = hpBody;
          faceAnchor = hpHat;
          break;

        case 'hat-stacked': // 小帽 + 鼓肚收腰长身
          const hsUsesFlatCylinderNeck = meta.neckStyle === "flat-cylinder";
          const hsBodyHeight = meta.bodyHeight || meta.height || 5;
          const hsTopRadius = Math.max((meta.waistRadius || meta.radius * 0.56) * 1.18, meta.radius * 0.72);
          const hsHeadRadius = meta.headRadius || hsTopRadius * 1.12;
          const hsHeadCenterY = hsBodyHeight + hsHeadRadius * (hsUsesFlatCylinderNeck ? 1.04 : 0.6);
          const hsBrimY = hsHeadCenterY + hsHeadRadius * 0.82;
          const hsBodyTop = hsBodyHeight * 0.98;
          const hsProfile = hsUsesFlatCylinderNeck
            ? [
                new THREE.Vector2(0, 0),
                new THREE.Vector2(meta.radius * 0.99, 0.02),
                new THREE.Vector2(meta.radius, hsBodyTop * 0.14),
                new THREE.Vector2(meta.radius * 1.0, hsBodyTop * 0.42),
                new THREE.Vector2(meta.radius * 0.97, hsBodyTop * 0.66),
                new THREE.Vector2(meta.radius * 0.9, hsBodyTop * 0.84),
                new THREE.Vector2(hsTopRadius * 0.94, hsBodyTop * 0.92),
                new THREE.Vector2(hsTopRadius * 0.82, hsBodyTop * 0.975),
                new THREE.Vector2(hsTopRadius * 0.68, hsBodyHeight + 0.04),
                new THREE.Vector2(hsTopRadius * 0.64, hsBodyHeight + 0.08),
                new THREE.Vector2(0, hsBodyHeight + 0.1)
              ]
            : [
                new THREE.Vector2(0, 0),
                new THREE.Vector2(meta.radius * 0.99, 0.02),
                new THREE.Vector2(meta.radius, hsBodyTop * 0.14),
                new THREE.Vector2(meta.radius * 0.98, hsBodyTop * 0.42),
                new THREE.Vector2(meta.radius * 0.94, hsBodyTop * 0.72),
                new THREE.Vector2(hsTopRadius * 1.08, hsBodyTop * 0.88),
                new THREE.Vector2(hsTopRadius * 1.03, hsBodyTop * 0.95),
                new THREE.Vector2(hsTopRadius, hsBodyTop * 1.0),
                new THREE.Vector2(hsTopRadius * 0.98, hsBodyHeight),
                new THREE.Vector2(hsTopRadius * 0.94, hsBodyHeight + 0.03),
                new THREE.Vector2(0, hsBodyHeight + 0.05)
              ];
          const hsBodyGeo = new THREE.LatheGeometry(hsProfile, 48);
          const hsBody = new THREE.Mesh(hsBodyGeo, mat);
          hsBody.castShadow = true;
          group.add(hsBody);

          const hsHeadGeo = new THREE.SphereGeometry(hsHeadRadius, 32, 32);
          const hsHead = new THREE.Mesh(hsHeadGeo, mat);
          hsHead.position.y = hsHeadCenterY;
          hsHead.castShadow = true;
          group.add(hsHead);
          addRoundedNeck(hsBodyHeight + (hsUsesFlatCylinderNeck ? 0.04 : 0), hsHead.position.y, hsHeadRadius, hsTopRadius);

          const hsBrimGeo = new THREE.CylinderGeometry(meta.brimRadius, meta.brimRadius, 0.24, 32);
          const hsBrim = new THREE.Mesh(hsBrimGeo, mat);
          hsBrim.position.y = hsBrimY;
          hsBrim.castShadow = true;
          group.add(hsBrim);

          const hsHatGeo = new THREE.CylinderGeometry(meta.hatTopRadius || meta.hatRadius * 0.82, meta.hatRadius, meta.hatHeight, 32);
          const hsHat = new THREE.Mesh(hsHatGeo, mat);
          hsHat.position.y = hsBrimY + meta.hatHeight * 0.5 + 0.12;
          hsHat.castShadow = true;
          group.add(hsHat);
          mainBody = hsBody;
          faceAnchor = hsHead;
          break;

        case 'hat-rounded': // 小礼帽 + 矮胖圆肚身
          const hrUsesFlatCylinderNeck = meta.neckStyle === "flat-cylinder";
          const hrBodyHeight = meta.bodyHeight || meta.height || 4;
          const hrBottomRadius = meta.bottomRadius || meta.radius * 0.92;
          const hrTopRadius = Math.max((meta.waistRadius || meta.radius * 0.62) * 1.08, meta.radius * 0.74);
          const hrHeadRadius = meta.headRadius || hrTopRadius * 1.14;
          const hrHeadCenterY = hrBodyHeight + hrHeadRadius * (hrUsesFlatCylinderNeck ? 1.04 : 0.6);
          const hrBrimY = hrHeadCenterY + hrHeadRadius * 0.82;
          const hrBodyTop = hrBodyHeight * 0.98;
          const hrProfile = hrUsesFlatCylinderNeck
            ? [
                new THREE.Vector2(0, 0),
                new THREE.Vector2(meta.radius * 0.75, 0.02),
                new THREE.Vector2(meta.radius * 0.88, hrBodyTop * 0.08),
                new THREE.Vector2(meta.radius * 0.98, hrBodyTop * 0.18),
                new THREE.Vector2(meta.radius * 1.06, hrBodyTop * 0.4),
                new THREE.Vector2(meta.radius * 1.02, hrBodyTop * 0.64),
                new THREE.Vector2(meta.radius * 0.9, hrBodyTop * 0.82),
                new THREE.Vector2(meta.radius * 0.76, hrBodyTop * 0.92),
                new THREE.Vector2(meta.radius * 0.62, hrBodyTop * 0.985),
                new THREE.Vector2(meta.radius * 0.48, hrBodyHeight + 0.04),
                new THREE.Vector2(0, hrBodyHeight + 0.1)
              ]
            : [
                new THREE.Vector2(0, 0),
                new THREE.Vector2(meta.radius * 0.75, 0.02),
                new THREE.Vector2(meta.radius * 0.88, hrBodyTop * 0.08),
                new THREE.Vector2(meta.radius * 0.98, hrBodyTop * 0.18),
                new THREE.Vector2(meta.radius * 1.06, hrBodyTop * 0.38),
                new THREE.Vector2(meta.radius * 1.0, hrBodyTop * 0.62),
                new THREE.Vector2(meta.radius * 0.82, hrBodyTop * 0.82),
                new THREE.Vector2(meta.radius * 0.56, hrBodyTop * 0.94),
                new THREE.Vector2(meta.radius * 0.4, hrBodyHeight),
                new THREE.Vector2(0, hrBodyHeight + 0.05)
              ];
          const hrBodyGeo = new THREE.LatheGeometry(hrProfile, 48);
          const hrBody = new THREE.Mesh(hrBodyGeo, mat);
          hrBody.castShadow = true;
          group.add(hrBody);

          const hrHeadGeo = new THREE.SphereGeometry(hrHeadRadius, 32, 32);
          const hrHead = new THREE.Mesh(hrHeadGeo, mat);
          hrHead.position.y = hrHeadCenterY;
          hrHead.castShadow = true;
          group.add(hrHead);
          addRoundedNeck(hrBodyHeight + (hrUsesFlatCylinderNeck ? 0.04 : 0), hrHead.position.y, hrHeadRadius, hrTopRadius);

          const hrBrimGeo = new THREE.CylinderGeometry(meta.brimRadius, meta.brimRadius, 0.24, 32);
          const hrBrim = new THREE.Mesh(hrBrimGeo, mat);
          hrBrim.position.y = hrBrimY;
          hrBrim.castShadow = true;
          group.add(hrBrim);

          const hrHatGeo = new THREE.CylinderGeometry(meta.hatTopRadius || meta.hatRadius * 0.82, meta.hatRadius, meta.hatHeight, 32);
          const hrHat = new THREE.Mesh(hrHatGeo, mat);
          hrHat.position.y = hrBrimY + meta.hatHeight * 0.5 + 0.12;
          hrHat.castShadow = true;
          group.add(hrHat);
          mainBody = hrBody;
          faceAnchor = hrHead;
          break;

        case 'drop-point': // 水滴尖头
          const dpBodyGeo = new THREE.SphereGeometry(meta.radius, 32, 32);
          const dpBody = new THREE.Mesh(dpBodyGeo, mat);
          dpBody.position.y = meta.radius;
          dpBody.scale.set(1, meta.height / (meta.radius*2), 1);
          dpBody.castShadow = true;
          group.add(dpBody);

          const dpHeadGeo = new THREE.ConeGeometry(meta.headWidth, meta.headHeight, 32);
          const dpHead = new THREE.Mesh(dpHeadGeo, mat);
          dpHead.position.y = meta.height + meta.headHeight / 2 - 0.5;

          dpHead.castShadow = true;
          group.add(dpHead);
          mainBody = dpBody;
          faceAnchor = dpHead;
          break;

        case 'flat-hat': // 波浪扁帽
          const fhBodyGeo = new THREE.CylinderGeometry(meta.radius * 0.5, meta.radius, meta.height, 32);
          const fhBody = new THREE.Mesh(fhBodyGeo, mat);
          fhBody.position.y = meta.height / 2;
          fhBody.castShadow = true;
          group.add(fhBody);

          const fhNeckGeo = new THREE.TorusGeometry(meta.radius * 0.7, 0.4, 16, 32);
          const fhNeck = new THREE.Mesh(fhNeckGeo, mat);
          fhNeck.position.y = meta.height;
          fhNeck.rotation.x = Math.PI / 2;
          fhNeck.castShadow = true;
          group.add(fhNeck);

          const fhHatGeo = new THREE.CylinderGeometry(meta.radius * 0.8, meta.radius * 0.8, 1.2, 32);
          const fhHat = new THREE.Mesh(fhHatGeo, mat);
          fhHat.position.y = meta.height + 1.0;
          
          const fhHatTopGeo = new THREE.SphereGeometry(meta.radius * 0.8, 32, 16, 0, Math.PI*2, 0, Math.PI/2);
          const fhHatTop = new THREE.Mesh(fhHatTopGeo, mat);
          fhHatTop.position.y = 0.6;
          fhHat.add(fhHatTop);

          fhHat.castShadow = true;
          group.add(fhHat);
          mainBody = fhBody;
          faceAnchor = fhBody;
          break;

        case 'pure-cone': // 圆润长锥体
          const isSharp = meta.sharpTop;
          const pcProfile = isSharp ? [
            new THREE.Vector2(0, 0),
            new THREE.Vector2(meta.radius * 0.97, 0.02),
            new THREE.Vector2(meta.radius, meta.height * 0.12),
            new THREE.Vector2(meta.radius * 0.96, meta.height * 0.28),
            new THREE.Vector2(meta.radius * 0.72, meta.height * 0.485),
            new THREE.Vector2(meta.radius * 0.48, meta.height * 0.69),
            new THREE.Vector2(meta.radius * 0.24, meta.height * 0.895),
            new THREE.Vector2(0, meta.height * 1.1)
          ] : [
            new THREE.Vector2(0, 0),
            new THREE.Vector2(meta.radius * 0.97, 0.02),
            new THREE.Vector2(meta.radius, meta.height * 0.12),
            new THREE.Vector2(meta.radius * 0.96, meta.height * 0.28),
            new THREE.Vector2(meta.radius * 0.86, meta.height * 0.54),
            new THREE.Vector2(meta.radius * 0.72, meta.height * 0.74),
            new THREE.Vector2(meta.radius * 0.56, meta.height * 0.87),
            new THREE.Vector2(meta.radius * 0.45, meta.height * 0.94),
            new THREE.Vector2(meta.radius * 0.35, meta.height * 0.98),
            new THREE.Vector2(meta.radius * 0.25, meta.height * 1.01),
            new THREE.Vector2(meta.radius * 0.15, meta.height * 1.03),
            new THREE.Vector2(meta.radius * 0.05, meta.height * 1.04),
            new THREE.Vector2(0, meta.height * 1.045)
          ];
          const pcGeo = new THREE.LatheGeometry(pcProfile, 48);
          const pcMesh = new THREE.Mesh(pcGeo, mat);
          pcMesh.castShadow = true;
          group.add(pcMesh);
          mainBody = pcMesh;
          faceAnchor = pcMesh;
          break;

        case 'snowman': // 葫芦形
          const smBaseGeo = new THREE.SphereGeometry(meta.radius, 32, 32);
          const smBase = new THREE.Mesh(smBaseGeo, mat);
          smBase.position.y = meta.radius * 0.8;
          smBase.scale.set(1, 1.2, 1);
          smBase.castShadow = true;
          group.add(smBase);

          const smHeadGeo = new THREE.SphereGeometry(meta.radius * 0.7, 32, 32);
          const smHead = new THREE.Mesh(smHeadGeo, mat);
          smHead.position.y = meta.radius * 2.2;
          smHead.castShadow = true;
          group.add(smHead);
          addRoundedNeck(meta.radius * 1.58, smHead.position.y, meta.radius * 0.7, meta.radius);

          const smHatGeo = new THREE.CylinderGeometry(meta.radius * 0.5, meta.radius * 0.5, 0.8, 32);
          const smHat = new THREE.Mesh(smHatGeo, mat);
          smHat.position.y = meta.radius * 2.2 + meta.radius * 0.6;
          smHat.castShadow = true;
          group.add(smHat);
          mainBody = smBase;
          faceAnchor = smHead;
          break;

        case 'cube':
        case 'block': // 方形积木
          const cubeGeo = new THREE.BoxGeometry(meta.width, meta.height, meta.depth);
          const cube = new THREE.Mesh(cubeGeo, mat);
          cube.position.y = meta.height / 2;
          cube.castShadow = true;
          group.add(cube);
          mainBody = cube;
          break;

        case 'cylinder':
        default:
          const cylGeo = new THREE.CylinderGeometry(meta.radius, meta.radius, meta.height, 32);
          const cyl = new THREE.Mesh(cylGeo, mat);
          cyl.position.y = meta.height / 2;
          cyl.castShadow = true;
          group.add(cyl);
          mainBody = cyl;
          break;
      }

      // 添加面部特征或标记点
      if (meta.shape !== 'cube' && meta.shape !== 'block' && meta.shape !== 'cylinder') {
        // 恢复原本的突出球体样式，但半径调大（原半径乘以1.6）
        const scaledEyeRadius = eyeRadius * 1.6;
        const eyeGeo = new THREE.SphereGeometry(scaledEyeRadius, 32, 32);
        const eyeMat = new THREE.MeshBasicMaterial({ color: eyeColor });
        const singleEye = new THREE.Mesh(eyeGeo, eyeMat);
        let eyeScale = 1;
        
        let eyeX = 0;
        let eyeY = 0;
        let eyeZ = meta.radius;

        // 根据不同的形状，把单眼贴到对应头部/身体网格表面
        switch(meta.shape) {
          case 'peg': // 直筒圆头
          case 'ball-cylinder':
          case 'rounded-peg':
          case 'stout-peg':
            eyeY = meta.head * 0.02; 
            break;
          case 'curved-cone-round':
          case 'cone-round': // 圆锥圆头
            eyeY = 0.05; 
            break;
          case 'drop-point': // 水滴尖头
            eyeY = meta.headHeight * 0.02;
            break;
          case 'flat-hat': // 波浪扁帽
            eyeY = meta.height * 0.78;
            break;
          case 'pure-cone': // 圆润长锥体
            eyeY = meta.eyeYOffset || meta.height * 0.78;
            eyeScale = 1.28;
            break;
          case 'stacked-drop':
            eyeY = (meta.lowerHeight || 3.2) - 0.12;
            eyeScale = 1.08;
            break;
          case 'cone-cap':
            eyeY = 0;
            eyeScale = 1.08;
            break;
          case 'bulb-base':
            eyeY = 0.02;
            eyeScale = 1.04;
            break;
          case 'skirt-leg':
            eyeY = 0.02;
            eyeScale = 1.02;
            break;
          case 'round-cap':
            eyeY = 0.02;
            eyeScale = 1.08;
            break;
          case 'pointed-cylinder':
            eyeY = meta.height * 0.56;
            break;
          case 'wavy-peg':
            eyeY = meta.head * 0.02;
            break;
          case 'hat-peg':
            eyeY = 0;
            break;
          case 'hat-stacked':
            eyeY = 0;
            break;
          case 'hat-rounded':
            eyeY = 0;
            break;
          case 'snowman': // 葫芦形
            eyeY = 0.02;
            eyeScale = 1.35;
            break;
          default:
            eyeY = 0;
        }

        if (typeof meta.eyeXOffset === 'number') eyeX = meta.eyeXOffset;
        if (typeof meta.eyeYOffset === 'number') eyeY = meta.eyeYOffset;
        if (typeof meta.eyeScale === 'number') eyeScale = meta.eyeScale;

        // 使用 Raycaster 动态计算表面的精确 Z 坐标，防止扁平眼睛被埋在模型内部
        let targetMesh = faceAnchor || group;
        targetMesh.updateMatrixWorld(true);
        
        // 从局部坐标的正前方 (z=50) 向后发射射线
        const originLocal = new THREE.Vector3(eyeX, eyeY, 50);
        const originWorld = targetMesh.localToWorld(originLocal);
        const dirLocal = new THREE.Vector3(0, 0, -1);
        const dirWorld = targetMesh.localToWorld(dirLocal).sub(originWorld).normalize();

        const raycaster = new THREE.Raycaster(originWorld, dirWorld);
        const intersects = raycaster.intersectObject(targetMesh, true);
        
        if (intersects.length > 0) {
          const localPoint = targetMesh.worldToLocal(intersects[0].point.clone());
          eyeZ = localPoint.z;
        } else {
          // fallback 如果射线未命中
          if (typeof meta.eyeForward === 'number') eyeZ = meta.eyeForward;
          else if (meta.head) eyeZ = meta.head;
          else eyeZ = meta.radius * 0.9;
        }

        // 贴合表面，使用普通的球体缩放
        singleEye.scale.setScalar(eyeScale);
        // 将眼球向模型内部深深嵌入，让大眼球只露出一小部分弧面
        let embedRatio = 0.92; // 所有人偶的眼球统一往内收，显得小一点
        if (meta.shape === 'pure-cone') {
          embedRatio = 1.75; // 纯圆锥(5,15) 极大幅度增加嵌入深度，确保只有最表面的一层弧度露出来
        } else if (meta.figureNo === '6') {
          embedRatio = 0.82; // 6号 眼球少嵌入一些，让黑眼睛露出更大的弧面
        }
        const embedDepth = scaledEyeRadius * eyeScale * embedRatio;
        singleEye.position.set(eyeX, eyeY, eyeZ - embedDepth);
        targetMesh.add(singleEye);

      } else if (meta.shape === 'cube' || meta.shape === 'block' || meta.shape === 'cylinder') {
        // 积木类标记点恢复为普通球体，并将其调大后嵌入
        const markRadius = 0.576; // 与1号人偶相同的眼球大小 (0.36 * 1.6)
        const markGeo = new THREE.SphereGeometry(markRadius, 32, 32);
        const isBlock = meta.shape === 'cube' || meta.shape === 'block';
        const markColor = isBlock ? 0x1a1a1a : 0xffffff;
        const markMat = new THREE.MeshBasicMaterial({ color: markColor, transparent: true, opacity: 0.8 });
        const mark = new THREE.Mesh(markGeo, markMat);
        
        // 恢复正常缩放
        mark.scale.setScalar(1);
        
        // 方块积木稍微往内收（深度加深），让凸出的眼睛显得更小
        const blockEmbedDepth = isBlock ? markRadius * 0.85 : markRadius * 0.92;
        
        if (isBlock) {
          const blockEyeY = typeof meta.eyeYOffset === 'number' ? meta.eyeYOffset : meta.height * 0.25;
          mark.position.set(0, blockEyeY, meta.depth / 2 - blockEmbedDepth);
        } else {
          mark.position.set(0, meta.height * 0.25, meta.radius - blockEmbedDepth);
        }
        mainBody.add(mark);
      }

      // 整体比例放大50%
      group.scale.set(1.5, 1.5, 1.5);

      return group;
    }

    function getPalettePreviewConfig() {
      if (palettePreviewConfig) return palettePreviewConfig;

      let maxRadius = 1;
      let maxCenterY = 0;

      paletteData.forEach(meta => {
        const mesh = createPieceMesh(meta);
        const bounds = new THREE.Box3().setFromObject(mesh);
        const sphere = bounds.getBoundingSphere(new THREE.Sphere());
        maxRadius = Math.max(maxRadius, sphere.radius);
        maxCenterY = Math.max(maxCenterY, sphere.center.y);
      });

      palettePreviewConfig = {
        radius: maxRadius,
        centerY: maxCenterY
      };

      return palettePreviewConfig;
    }

    function spawnItem(kind, x, z, rotationY = 0, customName = null) {
      const meta = getMeta(kind);
      
      // 每个人偶只能在沙盘展示一个：如果已存在同类型，先移除旧的
      const existingIndex = pieces.findIndex(p => p.userData.kind === meta.key);
      if (existingIndex !== -1) {
        const existing = pieces[existingIndex];
        scene.remove(existing);
        pieces.splice(existingIndex, 1);
        if (selectedMesh === existing) selectedMesh = null;
      }

      const mesh = createPieceMesh(meta);
      const position = findNonOverlappingPosition(x, z, meta);
      mesh.position.set(position.x, 0, position.z);
      mesh.rotation.y = rotationY;
      
      mesh.userData = {
        id: `item-${Date.now()}-${Math.random().toString(16).slice(2,8)}`,
        kind: meta.key,
        name: customName || `${meta.name}${autoIndex++}`,
        meta: meta,
        footprint: getPieceFootprint(meta)
      };

      scene.add(mesh);
      pieces.push(mesh);
      selectItem(mesh);
      if (!suppressSave) saveLayout();
      return mesh;
    }

    function getRootPieceFromObject(object) {
      let current = object;
      while (current && !pieces.includes(current)) {
        current = current.parent;
      }
      return current;
    }

    // 7. 交互逻辑
    function updateSelectionUI() {
      if (!selectedMesh) {
        selectRing.visible = false;
        return;
      }
      selectRing.position.x = selectedMesh.position.x;
      selectRing.position.z = selectedMesh.position.z;
      selectRing.rotation.y = selectedMesh.rotation.y;
      selectRing.visible = true;
    }

    function updatePaletteHighlight() {
      const placedKinds = new Set(pieces.map(p => p.userData.kind));
      const selectedKind = selectedMesh ? selectedMesh.userData.kind : null;
      
      document.querySelectorAll('.palette-card').forEach(card => {
        const key = card.dataset.key;
        if (!key) return;
        
        card.classList.toggle('placed', placedKinds.has(key));
        card.classList.toggle('selected', key === selectedKind);
      });
    }

    function selectItem(mesh) {
      selectedMesh = mesh;
      updateSelectionUI();
      updatePaletteHighlight();
      
      const personControls = document.getElementById('person-controls');
      const sidebarPerson = document.getElementById('sidebar-person');
      const sidebarSandbox = document.getElementById('sidebar-sandbox');
      
      if (personControls) {
        const isSidebarActive = (sidebarPerson && sidebarPerson.classList.contains('active')) || 
                                (sidebarSandbox && sidebarSandbox.classList.contains('active'));
                                
        if (mesh && !isSidebarActive) {
          personControls.classList.remove('disabled-controls');
        } else {
          personControls.classList.add('disabled-controls');
        }
      }
    }

    function deleteSelected() {
      if (!selectedMesh) return;
      scene.remove(selectedMesh);
      pieces = pieces.filter(p => p !== selectedMesh);
      selectedMesh = null;
      updateSelectionUI();
      updatePaletteHighlight();
      saveLayout();
    }

    function rotateSelectedBy(degrees) {
      if (!selectedMesh) return;
      
      // 获取当前实际角度（转换为度数）
      let currentDeg = THREE.MathUtils.radToDeg(selectedMesh.rotation.y);
      
      // 消除可能存在的 5 度偏转，将其对齐到最近的 45 度倍数，得到"逻辑角度"
      let logicalDeg = Math.round(currentDeg / 45) * 45;
      
      // 计算新的逻辑角度
      let newLogicalDeg = logicalDeg - degrees;
      
      // 标准化到 0-360 范围以便判断朝向
      let normalizedDeg = ((newLogicalDeg % 360) + 360) % 360;
      
      let finalDeg = newLogicalDeg;
      // 当人偶面向正左或正右时，向正前方（0度）偏转 5 度，方便用户看清眼睛
      if (normalizedDeg === 90) {
        finalDeg = newLogicalDeg - 5;
      } else if (normalizedDeg === 270) {
        finalDeg = newLogicalDeg + 5;
      }
      
      selectedMesh.rotation.y = THREE.MathUtils.degToRad(finalDeg);
      updateSelectionUI();
      saveLayout();
    }

    // 鼠标选取与拖拽
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let pointerDownMesh = null;
    let pointerDragMoved = false;
    let rotateOnPointerUp = false;

    renderer.domElement.addEventListener('pointerdown', e => {
      // 点击沙盘区域时，自动收起左侧设置栏
      const sidebarPerson = document.getElementById('sidebar-person');
      const sidebarSandbox = document.getElementById('sidebar-sandbox');
      const navPerson = document.getElementById('nav-person');
      const navSandbox = document.getElementById('nav-sandbox');
      if (sidebarPerson && sidebarSandbox) {
        sidebarPerson.classList.remove('active');
        sidebarSandbox.classList.remove('active');
        navPerson.classList.remove('active');
        navSandbox.classList.remove('active');
        updateNavPosition();
      }

      if (e.button !== 0) return; // 仅左键
      pointerDownMesh = null;
      pointerDragMoved = false;
      rotateOnPointerUp = false;
      const rect = renderer.domElement.getBoundingClientRect();
      updateMousePos(e, rect, mouse);

      raycaster.setFromCamera(mouse, camera);
      // 检测所有 piece 的子网格
      const hitObjects = pieces.flatMap(p => p.children);
      const intersects = raycaster.intersectObjects(hitObjects);

      if (intersects.length > 0) {
        // 找到点击的 Group
        const hitMesh = getRootPieceFromObject(intersects[0].object);
        if (!hitMesh) return;
        const wasSelected = hitMesh === selectedMesh;
        selectItem(hitMesh); // 在按下时立即触发选中，显示操作面板
        draggedMesh = hitMesh;
        pointerDownMesh = hitMesh;
        rotateOnPointerUp = wasSelected;
        orbit.enabled = false;

        // 计算偏移量，防止模型中心瞬间跳到鼠标位置
        const hitPoint = new THREE.Vector3();
        raycaster.ray.intersectPlane(interactPlane, hitPoint);
        dragOffset.copy(hitMesh.position).sub(hitPoint);
      } else {
        selectItem(null);
      }
    });

    renderer.domElement.addEventListener('pointermove', e => {
      if (!draggedMesh) return;
      const rect = renderer.domElement.getBoundingClientRect();
      updateMousePos(e, rect, mouse);

      raycaster.setFromCamera(mouse, camera);
      const target = new THREE.Vector3();
      if (raycaster.ray.intersectPlane(interactPlane, target)) {
        // 限制在沙盘范围内
        const desiredX = THREE.MathUtils.clamp(target.x + dragOffset.x, -tableWidth/2 + 2, tableWidth/2 - 2);
        const desiredZ = THREE.MathUtils.clamp(target.z + dragOffset.z, -tableDepth/2 + 2, tableDepth/2 - 2);
        const movedDistance = Math.hypot(desiredX - draggedMesh.position.x, desiredZ - draggedMesh.position.z);
        if (movedDistance > 0.08) pointerDragMoved = true;
        
        // 拖动时允许穿过其他人偶：不再实时检测 isPositionFree
        draggedMesh.position.set(desiredX, 0, desiredZ);
        updateSelectionUI();
      }
    });

    renderer.domElement.addEventListener('dblclick', e => {
      const rect = renderer.domElement.getBoundingClientRect();
      updateMousePos(e, rect, mouse);

      raycaster.setFromCamera(mouse, camera);
      const hitObjects = pieces.flatMap(p => p.children);
      const intersects = raycaster.intersectObjects(hitObjects);

      if (intersects.length === 0) return;
      const hitMesh = getRootPieceFromObject(intersects[0].object);
      if (!hitMesh) return;
      if (hitMesh !== selectedMesh) return;

      rotateSelectedBy(90);
    });

    window.addEventListener('pointerup', e => {
      if (draggedMesh) {
        const releasedMesh = draggedMesh;
        draggedMesh = null;
        orbit.enabled = true;
        
        // 松开时确保不重叠：寻找最近的空闲位置
        const finalPos = findNonOverlappingPosition(releasedMesh.position.x, releasedMesh.position.z, releasedMesh.userData.meta, releasedMesh);
        releasedMesh.position.set(finalPos.x, 0, finalPos.z);
        updateSelectionUI();

        if (!pointerDragMoved && rotateOnPointerUp && pointerDownMesh === releasedMesh) {
          rotateSelectedBy(90);
        } else {
          saveLayout();
        }
      }
      pointerDownMesh = null;
      pointerDragMoved = false;
      rotateOnPointerUp = false;
    }, eventSignal);

    // 8. 拖放 API (HTML Sidebar -> WebGL Canvas)
    
    const thumbScene = new THREE.Scene();
    const thumbCamera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    thumbScene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const thumbLight = new THREE.DirectionalLight(0xffffff, 2.2);
    thumbLight.position.set(7, 10, 9);
    thumbScene.add(thumbLight);
    const thumbRenderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true
    });
    thumbRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    thumbRenderer.setSize(160, 160, false);
    thumbRenderer.setClearColor(0x000000, 0);

    function mountThumbnail(meta, iconEl) {
      const canvas = document.createElement("canvas");
      canvas.width = 160;
      canvas.height = 160;
      iconEl.appendChild(canvas);
      const ctx = canvas.getContext("2d");

      const thumbMeshOptions = { eyeColor: 0x1a1a1a };
      if (typeof meta.eyeRadius !== "number") {
        thumbMeshOptions.eyeRadius = 0.42;
      }
      const mesh = createPieceMesh(meta, thumbMeshOptions);
      mesh.rotation.y = activeLibraryVersion === "child" ? Math.PI / 4 : -Math.PI / 6;
      thumbScene.add(mesh);

      const previewConfig = getPalettePreviewConfig();
      const bounds = new THREE.Box3().setFromObject(mesh);
      const sphere = bounds.getBoundingSphere(new THREE.Sphere());
      const radius = Math.max(previewConfig.radius, 1);
      const center = sphere.center;
      const fov = THREE.MathUtils.degToRad(thumbCamera.fov);
      const isChildLibrary = activeLibraryVersion === "child";
      // 再次推远相机距离 (从 0.86/0.90 增加到 0.91/0.95)，使人物在卡片中再缩小约 5%
      const distance = (radius / Math.tan(fov / 2)) * (isChildLibrary ? 0.91 : 0.95);
      const targetY = previewConfig.centerY * (isChildLibrary ? 0.96 : 0.98);
      const cameraOffsetX = radius * (isChildLibrary ? 0.2 : 0.3);
      const cameraOffsetY = radius * (isChildLibrary ? 0.15 : 0.25);

      thumbCamera.position.set(
        center.x + cameraOffsetX,
        targetY + cameraOffsetY,
        center.z + distance
      );
      thumbCamera.lookAt(center.x, targetY, center.z);
      thumbCamera.updateProjectionMatrix();

      thumbRenderer.clear();
      thumbRenderer.render(thumbScene, thumbCamera);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(thumbRenderer.domElement, 0, 0, canvas.width, canvas.height);

      thumbScene.remove(mesh);
    }

    function resizePalette() {
      const sidebar = document.getElementById('sidebar-person');
      const toolbox = document.getElementById('toolbox');
      if (!toolbox || !sidebar) return;

      const appNode = document.querySelector('.sandbox-app');
      const isPortrait = window.matchMedia("(orientation: portrait)").matches;
      
      let appW = window.innerWidth;
      let appH = window.innerHeight;
      
      if (isPortrait) {
        const temp = appW; appW = appH; appH = temp;
      }
      
      const isMobileViewport = Math.min(window.innerWidth, window.innerHeight) <= 768;
      
      const trays = document.querySelectorAll('.tray');
      const numRows = trays.length;
      if (numRows === 0) return;

      // 计算单排最多的人偶数量
      let maxCols = 0;
      document.querySelectorAll('.palette').forEach(p => {
        maxCols = Math.max(maxCols, p.children.length);
      });
      if (maxCols === 0) return;

      // 获取 CSS 中定义的间距
      const firstPalette = document.querySelector('.palette');
      const gapX = parseFloat(window.getComputedStyle(firstPalette).gap) || 8;
      const gapY = parseFloat(window.getComputedStyle(toolbox).gap) || 16;
      
      // 获取侧拉栏内边距
      const sidebarStyle = window.getComputedStyle(sidebar);
      const padY = parseFloat(sidebarStyle.paddingTop) + parseFloat(sidebarStyle.paddingBottom);
      const padX = parseFloat(sidebarStyle.paddingLeft) + parseFloat(sidebarStyle.paddingRight);

      // 减去标签(tray-label)占据的高度
      let labelHeightTotal = 0;
      document.querySelectorAll('.tray-label').forEach(l => {
        const style = window.getComputedStyle(l);
        labelHeightTotal += l.offsetHeight + parseFloat(style.marginTop) + parseFloat(style.marginBottom);
      });

      // 1. 核心算法：通过人物栏的总高度和行数先计算出人偶的最大高度
      // 不依赖 sidebar 的实际高度，因为动画和旋转期间容易获取错误，直接用容器高度计算
      const availableH = appH - padY - labelHeightTotal;
      let cardH = (availableH - gapY * (numRows - 1)) / numRows;

      // 设置一个最大高度上限，防止在大屏幕上人偶过大
      cardH = Math.min(cardH, 200); 

      // 根据 3:4 比例推算宽度
      let cardW = cardH * 0.75;

      // 2. 动态决定人物栏的总宽度
      let requiredSidebarWidth = cardW * maxCols + gapX * (maxCols - 1) + padX;

      // 3. 桌面端人物栏不超过 75%，移动端允许达到 100% (页面总宽度)
      const maxSidebarWidth = appW * (isMobileViewport ? 1.0 : 0.75);
      if (requiredSidebarWidth > maxSidebarWidth) {
        requiredSidebarWidth = maxSidebarWidth;
        // 如果超宽，则根据宽度瓶颈反推缩小卡片
        const availableW = requiredSidebarWidth - padX;
        cardW = (availableW - gapX * (maxCols - 1)) / maxCols;
        cardH = cardW / 0.75;
      }

      // 向下取整避免小数点导致换行溢出
      cardW = Math.floor(cardW);
      cardH = Math.floor(cardH);
      requiredSidebarWidth = Math.ceil(requiredSidebarWidth);

      // 应用变量
      document.documentElement.style.setProperty('--card-w', `${cardW}px`);
      document.documentElement.style.setProperty('--card-h', `${cardH}px`);
      
      // 动态设置侧拉栏的物理宽度，覆盖掉 CSS 中的 75vw 或 90vw
      sidebar.style.setProperty('width', `${requiredSidebarWidth}px`, 'important');
      
      // 触发标签位置重算
      setTimeout(updateNavPosition, 50);
    }

    function schedulePaletteResize(delay = 0) {
      setTimeout(() => {
        resizePalette();
        updateNavPosition();
      }, delay);
    }

    function renderPalette() {
      const toolbox = document.getElementById("toolbox");
      toolbox.innerHTML = "";

      const entries = getPaletteEntries();
      const groups = activeLibraryVersion === "child"
        ? teachingToyRows.map((rowLabel, rowIndex) => ({
            name: rowLabel,
            items: entries.filter(entry => entry.meta.rowIndex === rowIndex + 1),
            columns: entries.filter(entry => entry.meta.rowIndex === rowIndex + 1).length
          }))
        : [
            {
              name: "group-1",
              items: entries.filter(entry => ['peg', 'cone-round'].includes(entry.meta.shape))
            },
            {
              name: "group-2",
              items: entries.filter(entry => ['drop-point', 'flat-hat', 'pure-cone'].includes(entry.meta.shape))
            },
             {
              name: "group-3",
              items: entries.filter(entry => ['snowman', 'cube', 'cylinder'].includes(entry.meta.shape))
            }
          ];

      groups.forEach(group => {
        if (!group.items.length) return;
        const tray = document.createElement("div");
        tray.className = "tray";

        if (group.name && activeLibraryVersion !== "child") {
          const trayLabel = document.createElement("div");
          trayLabel.className = "tray-label";
          trayLabel.textContent = `${group.name} 大小`;
          tray.appendChild(trayLabel);
        }
        
        const palette = document.createElement("div");
        palette.className = "palette";

        group.items.forEach(({ meta, paletteNumber }) => {
          const div = document.createElement("div");
          div.className = "palette-card";
          div.dataset.key = meta.key;
          div.draggable = true;
          const icon = document.createElement("div");
          icon.className = "palette-icon";
          div.appendChild(icon);
          const num = document.createElement("div");
          num.className = "palette-num";
          num.textContent = paletteNumber;
          div.appendChild(num);
          mountThumbnail(meta, icon);
          
          div.addEventListener("dragstart", e => {
            e.dataTransfer.setData("text/plain", meta.key);
            document.getElementById("drop-overlay").classList.add("active");
          });
          div.addEventListener("dragend", () => {
            document.getElementById("drop-overlay").classList.remove("active");
          });
          div.addEventListener("click", () => {
            // 将默认生成位置从 (0, 0) 调整为 (0, 25)，使人偶离镜头更近，视觉上显得更大
            spawnItem(meta.key, 0, 25);
          });
          
          palette.appendChild(div);
        });

        tray.appendChild(palette);
        toolbox.appendChild(tray);
      });
      
      updatePaletteHighlight();
      
      // 渲染完成后触发一次计算
      resizePalette();
    }

    container.addEventListener('dragover', e => {
      e.preventDefault(); // 允许放置
    });

    container.addEventListener('drop', e => {
      e.preventDefault();
      document.getElementById("drop-overlay").classList.remove("active");
      const kind = e.dataTransfer.getData("text/plain");
      if (!kind) return;

      const rect = renderer.domElement.getBoundingClientRect();
      updateMousePos(e, rect, mouse);
      raycaster.setFromCamera(mouse, camera);
      
      const target = new THREE.Vector3();
      if (raycaster.ray.intersectPlane(interactPlane, target)) {
        const newX = THREE.MathUtils.clamp(target.x, -tableWidth/2 + 2, tableWidth/2 - 2);
        const newZ = THREE.MathUtils.clamp(target.z, -tableDepth/2 + 2, tableDepth/2 - 2);
        spawnItem(kind, newX, newZ);
      }
    });

    // 9. 存储逻辑
    // 批量加载时置为 true，spawnItem 不逐个触发 saveLayout，避免写入风暴
    let suppressSave = false;

    // 简易非阻塞提示，替代 alert()
    let toastTimer = null;
    function showToast(message) {
      let toast = document.querySelector('.sandbox-toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.className = 'sandbox-toast';
        document.body.appendChild(toast);
      }
      toast.textContent = message;
      toast.classList.add('visible');
      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toast.classList.remove('visible');
        toastTimer = null;
      }, 2000);
    }

    function saveLayout() {
      const data = pieces.map(p => ({
        kind: p.userData.kind,
        name: p.userData.name,
        x: p.position.x,
        z: p.position.z,
        ry: p.rotation.y
      }));
      localStorage.setItem(storageKey, JSON.stringify(data));
    }

    function saveSandboxSettings() {
      const settings = {
        pitch: currentSettings.pitch,
        yaw: currentSettings.yaw,
        zoom: currentSettings.zoom,
        width: currentSettings.width,
        depth: currentSettings.depth
      };
      localStorage.setItem(settingsKey, JSON.stringify(settings));
      showToast("沙盘设置已保存");
    }

    function loadSandboxSettings() {
      const raw = localStorage.getItem(settingsKey);
      if (!raw) return;
      try {
        const s = JSON.parse(raw);
        currentSettings.pitch = parseFloat(s.pitch) || 30;
        currentSettings.yaw = parseFloat(s.yaw) || 0;
        currentSettings.zoom = parseFloat(s.zoom) || 85;
        currentSettings.width = parseFloat(s.width) || 100;
        currentSettings.depth = parseFloat(s.depth) || 100;

        tableWidth = currentSettings.width;
        tableDepth = currentSettings.depth;

        Object.keys(currentSettings).forEach(syncSettingUI);
        
        updateSandboxSize();
        updateCameraFromSliders();
      } catch(e) {}
    }

    function loadLayout() {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      try {
        const data = JSON.parse(raw);
        // 清理旧的
        pieces.forEach(p => scene.remove(p));
        pieces = [];
        // 批量恢复布局，最后统一保存一次
        suppressSave = true;
        try {
          data.forEach(item => {
            spawnItem(item.kind, item.x, item.z, item.ry, item.name);
          });
        } finally {
          suppressSave = false;
        }
        autoIndex = pieces.length + 1;
        selectItem(pieces[pieces.length - 1] || null);
      } catch(e) {}
    }

    // 10. 按钮事件与键盘
    document.querySelectorAll("[data-rotate]").forEach(btn => {
      btn.addEventListener("click", () => {
        rotateSelectedBy(Number(btn.dataset.rotate));
      });
    });

    const deleteBtn = document.getElementById("deleteBtn");
    if (deleteBtn) deleteBtn.addEventListener("click", deleteSelected);

    const clearBtn = document.getElementById("clearBtn");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        pieces.forEach(p => scene.remove(p));
        pieces = [];
        selectItem(null);
        saveLayout();
      });
    }

    const saveBtn = document.getElementById("saveBtn");
    if (saveBtn) saveBtn.addEventListener("click", saveSandboxSettings);

    const loadBtn = document.getElementById("loadBtn");
    if (loadBtn) loadBtn.addEventListener("click", loadLayout);

    const centerBtn = document.getElementById("centerBtn");
    if (centerBtn) {
      centerBtn.addEventListener("click", () => {
        camera.position.set(0, 45, 60);
        orbit.target.set(0, 0, 0);
        orbit.update();
      });
    }

    const sidebarPerson = document.getElementById('sidebar-person');
    const sidebarSandbox = document.getElementById('sidebar-sandbox');
    const navPerson = document.getElementById('nav-person');
    const navSandbox = document.getElementById('nav-sandbox');
    const sidebarNav = document.getElementById('sidebar-nav');

    function updateNavPosition() {
      const activeSidebar = document.querySelector('.sidebar.active');
      if (activeSidebar && activeSidebar.classList.contains('active')) {
        // 增加一点小偏移量确保不完全重叠，并强制触发重绘
        const offset = activeSidebar.offsetWidth;
        sidebarNav.style.transform = `translateY(-50%) translateX(${offset}px)`;
      } else {
        sidebarNav.style.transform = `translateY(-50%) translateX(0)`;
      }
    }

    function switchSidebar(target) {
      const isPerson = target === 'person';
      sidebarPerson.classList.toggle('active', isPerson);
      sidebarSandbox.classList.toggle('active', !isPerson);
      navPerson.classList.toggle('active', isPerson);
      navSandbox.classList.toggle('active', !isPerson);
      
      updateNavPosition();
      selectItem(selectedMesh); // 刷新悬浮操作条显示状态
      schedulePaletteResize(0);
      schedulePaletteResize(350);
      setTimeout(() => window.dispatchEvent(new Event('resize')), 350);
    }

    navPerson.addEventListener('click', () => {
      if (sidebarPerson.classList.contains('active')) {
        sidebarPerson.classList.remove('active');
        navPerson.classList.remove('active');
        updateNavPosition();
        selectItem(selectedMesh); // 刷新悬浮操作条显示状态
        schedulePaletteResize(0);
        schedulePaletteResize(350);
        setTimeout(() => window.dispatchEvent(new Event('resize')), 350);
      } else {
        switchSidebar('person');
      }
    });

    navSandbox.addEventListener('click', () => {
      if (sidebarSandbox.classList.contains('active')) {
        sidebarSandbox.classList.remove('active');
        navSandbox.classList.remove('active');
        updateNavPosition();
        selectItem(selectedMesh); // 刷新悬浮操作条显示状态
        schedulePaletteResize(0);
        schedulePaletteResize(350);
        setTimeout(() => window.dispatchEvent(new Event('resize')), 350);
      } else {
        switchSidebar('sandbox');
      }
    });

    // 监听侧拉栏外部点击以关闭
    document.getElementById('stage-container').addEventListener('click', (e) => {
      // 避免与点选人偶冲突：如果点击到了人偶则不主动关闭侧拉栏，除非点在空白处
      if (e.target.id === 'stage-container' || e.target.tagName === 'CANVAS') {
        if (sidebarPerson.classList.contains('active') || sidebarSandbox.classList.contains('active')) {
          sidebarPerson.classList.remove('active');
          sidebarSandbox.classList.remove('active');
          navPerson.classList.remove('active');
          navSandbox.classList.remove('active');
          updateNavPosition();
          selectItem(selectedMesh); // 刷新悬浮操作条显示状态
          schedulePaletteResize(0);
          schedulePaletteResize(350);
          setTimeout(() => window.dispatchEvent(new Event('resize')), 350);
        }
      }
    });

    window.addEventListener('resize', () => {
      // 窗口调整大小可能导致侧边栏宽度改变，重新计算标签位置和人偶卡片大小
      schedulePaletteResize(0);
      schedulePaletteResize(400); // 动画结束后再次校准
    }, eventSignal);

    window.addEventListener('orientationchange', () => {
      // 屏幕旋转时强制重置
      setTimeout(() => {
        schedulePaletteResize(0);
        window.dispatchEvent(new Event('resize'));
      }, 500);
    }, eventSignal);

    // 设置项的取值范围与显示后缀（滑块与步进按钮共用）
    const settingLimits = {
      pitch: { min: 10, max: 85, unit: '°' },
      yaw: { min: -180, max: 180, unit: '°' },
      zoom: { min: 20, max: 150, unit: '' },
      width: { min: 40, max: 120, unit: '' },
      depth: { min: 30, max: 150, unit: '' }
    };

    // 统一的设置应用入口：钳制范围 → 更新状态 → 同步滑块/数值显示 → 应用到场景
    function applySetting(id, value, { fromSlider = false } = {}) {
      const limits = settingLimits[id];
      if (!limits) return;

      let newVal = Math.round(value / 5) * 5; // 步长对齐 5，滑块与按钮行为一致
      newVal = Math.max(limits.min, Math.min(limits.max, newVal));
      if (newVal === currentSettings[id]) {
        if (!fromSlider) syncSettingUI(id); // 值没变也把滑块位置拉回有效值
        return;
      }

      currentSettings[id] = newVal;
      syncSettingUI(id);

      if (id === 'pitch' || id === 'yaw' || id === 'zoom') {
        updateCameraFromSliders();
      } else if (id === 'width') {
        tableWidth = newVal;
        updateSandboxSize();
      } else if (id === 'depth') {
        tableDepth = newVal;
        updateSandboxSize();
      }
    }

    // 同步滑块位置与数值显示
    function syncSettingUI(id) {
      const slider = document.querySelector(`.setting-slider[data-id="${id}"]`);
      if (slider) slider.value = currentSettings[id];
      const label = document.getElementById(`val-${id}`);
      if (label) {
        label.textContent = currentSettings[id] + settingLimits[id].unit;
      }
    }

    // 滑块拖动（step=5，触屏友好）
    document.querySelectorAll('.setting-slider').forEach(slider => {
      slider.addEventListener('input', () => {
        applySetting(slider.dataset.id, parseFloat(slider.value), { fromSlider: true });
      });
    });

    // 步进按钮点击事件（±5，与滑块步长一致）
    document.querySelectorAll('.step-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        applySetting(id, currentSettings[id] + parseFloat(btn.dataset.step));
      });
    });

    function updateSandboxSize() {
      tableBase.geometry.dispose();
      tableBase.geometry = new THREE.BoxGeometry(tableWidth, 2, tableDepth);
      sandPlane.geometry.dispose();
      sandPlane.geometry = new THREE.PlaneGeometry(tableWidth - 2, tableDepth - 2);
    }

    document.getElementById('resetBtn').addEventListener('click', () => {
      currentSettings = {
        pitch: 30,
        yaw: 0,
        zoom: 85,
        width: 100,
        depth: 100
      };
      tableWidth = 100;
      tableDepth = 100;
      Object.keys(currentSettings).forEach(syncSettingUI);
      updateCameraFromSliders();
      updateSandboxSize();
      localStorage.removeItem(settingsKey);
    });

    // 初始位置设置：沙盘上边缘距离屏幕上边1/5
    function initSandboxPosition() {
      loadSandboxSettings(); // 加载并应用设置，此时 tableDepth 可能会被更新
      orbit.target.set(0, -tableDepth * 0.1, 0); 
      updateCameraFromSliders();
    }

    initSandboxPosition();

    // 禁用右键和双指缩放/平移的 OrbitControls 设置
    orbit.enablePan = false;
    orbit.enableZoom = false; // 禁用鼠标滚轮和手势缩放，完全由左侧滑块控制
    orbit.enableRotate = false; // 禁用手势旋转，由滑块控制
    // 拦截 touch 事件防止 OrbitControls 干扰
    renderer.domElement.addEventListener('touchstart', e => {
      if (e.touches.length > 1) e.preventDefault();
    }, { passive: false });
    window.addEventListener("keydown", e => {
      // 焦点在输入类控件上时不拦截按键，避免误删人偶
      const target = e.target;
      const isFormTarget = target instanceof HTMLElement && (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable
      );
      if (isFormTarget) return;

      if (e.key === "Delete" || e.key === "Backspace") deleteSelected();
      if (!selectedMesh) return;
      if (e.key.toLowerCase() === "q") rotateSelectedBy(-45);
      if (e.key.toLowerCase() === "e") rotateSelectedBy(45);
    }, eventSignal);

    window.addEventListener('resize', () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }, eventSignal);

    function animate() {
      rafId = requestAnimationFrame(animate);
      orbit.update();
      renderer.render(scene, camera);
    }

    renderPalette();
    loadLayout();
    schedulePaletteResize(0);
    schedulePaletteResize(300);
    animate();

  // 11. 清理：停掉渲染循环、移除事件监听、释放 WebGL 资源
  function disposeObject(object) {
    object.traverse(node => {
      if (node.geometry) node.geometry.dispose();
      if (node.material) {
        const materials = Array.isArray(node.material) ? node.material : [node.material];
        materials.forEach(material => {
          // 释放材质引用的贴图（木纹 CanvasTexture 等）
          if (material.map) material.map.dispose();
          material.dispose();
        });
      }
    });
  }

  return () => {
    // 停止渲染循环
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }

    // 移除所有 window 级事件监听
    eventController.abort();

    // 释放场景内所有几何体 / 材质 / 贴图（原型缓存与克隆共享同一份资源，重复 dispose 无害）
    disposeObject(scene);
    disposeObject(thumbScene);
    meshPrototypeCache.forEach(prototype => disposeObject(prototype));

    // 释放两个 WebGL 上下文（主渲染器 + 缩略图渲染器），避免反复进出页面耗尽上下文
    renderer.dispose();
    renderer.forceContextLoss();
    thumbRenderer.dispose();
    thumbRenderer.forceContextLoss();

    // 恢复被修改的全局状态
    document.title = originalDocumentTitle;
    if (toastTimer) {
      clearTimeout(toastTimer);
      toastTimer = null;
    }
    document.querySelectorAll('.sandbox-toast').forEach(el => el.remove());

    initialized = false;
  };
}
