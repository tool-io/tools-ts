import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
import {
  calculate as dimensions,
  example as dimensionsExample,
} from "../image-dimensions-for-print-size/tool.js";
import {
  calculate as ppi,
  example as ppiExample,
} from "../ppi-screen-diagonal-resolution/tool.js";
import {
  calculate as dpr,
  example as dprExample,
} from "../device-pixel-ratio-css-px-lookup/tool.js";
import {
  calculate as pages,
  example as pagesExample,
} from "../page-count-from-wordcount-standard/tool.js";
import {
  calculate as compression,
  example as compressionExample,
} from "../woff2-compression-ratio-ttf-lookup/tool.js";
import { calculate as weight } from "../font-weight-number-name-mapping/tool.js";
import {
  calculate as didot,
  example as didotExample,
} from "../didot-point-to-point-convert/tool.js";
const close = (actual: unknown, expected: unknown): void => {
  if (typeof expected === "number") {
    expect(typeof actual).toBe("number");
    expect(Math.abs((actual as number) - expected)).toBeLessThanOrEqual(
      Math.max(1, Math.abs(expected)) * 1e-8,
    );
  } else if (Array.isArray(expected)) {
    expect(Array.isArray(actual)).toBe(true);
    expect((actual as unknown[]).length).toBe(expected.length);
    expected.forEach((v, i) => close((actual as unknown[])[i], v));
  } else if (expected !== null && typeof expected === "object") {
    expect(Object.keys(actual as object).sort()).toEqual(
      Object.keys(expected).sort(),
    );
    for (const [k, v] of Object.entries(expected))
      close((actual as Record<string, unknown>)[k], v);
  } else expect(actual).toEqual(expected);
};
describe(tool.id, () => {
  it("uses the fourteen-point bold threshold rather than eighteen points for all text", () => {
    expect(
      calculate({
        ...example.input,
        observedCssFontPx: 56 / 3,
        independentlyBoldForWcag: true,
      }).wcagLargeTextSizeScreen,
    ).toBe(true);
    expect(
      calculate({
        ...example.input,
        observedCssFontPx: 56 / 3,
        independentlyBoldForWcag: false,
      }).wcagLargeTextSizeScreen,
    ).toBe(false);
  });
  it("does not classify immediately subthreshold bold text as large", () => {
    expect(
      calculate({
        ...example.input,
        observedCssFontPx: 56 / 3 - 0.001,
        independentlyBoldForWcag: true,
      }).wcagLargeTextSizeScreen,
    ).toBe(false);
  });
  it("ceil-rounds both required raster dimensions and retains excess", () => {
    const r = dimensions({
      ...dimensionsExample.input,
      desiredPrintWidthInches: 0.001,
      desiredPrintHeightInches: 0.001,
    });
    expect(r.requiredIntegerPixelDimensions).toEqual([1, 1]);
    expect(r.integerRasterExcessPixels).toEqual([0.7, 0.7]);
  });
  it("keeps physical pixel density separate from device-to-CSS ratio", () => {
    expect(ppi(ppiExample.input).physicalPixelsPerInch).toBeCloseTo(
      Math.hypot(1920, 1080) / 24,
    );
    expect(dpr(dprExample.input).observedDevicePixelRatio).toBe(2);
  });
  it("retains nontext pages when the word count is zero", () => {
    expect(pages({ ...pagesExample.input, observedWordCount: 0 })).toEqual({
      wholeProjectedPageCount: 2,
      lastTextPageWords: 0,
    });
  });
  it("does not fabricate positive WOFF2 savings when encoded bytes are larger", () => {
    expect(
      compression({
        ...compressionExample.input,
        observedMatchedWoff2Bytes: 1200,
      }).observedSavingsPercent,
    ).toBeCloseTo(-20);
  });
  it("requires independently matched glyph content before comparing encoded file sizes", () => {
    expect(() =>
      compression({
        ...compressionExample.input,
        independentlySameGlyphContentVerified: false,
      }),
    ).toThrow();
  });
  it("does not treat every valid CSS numeric weight as a canonical named hundred step", () => {
    expect(() => weight({ cssNominalWeight: 650 })).toThrow();
  });
  it("distinguishes a traditional Didot point from a PostScript point", () => {
    expect(
      didot({ ...didotExample.input, traditionalDidotPoints: 1 })
        .postscriptPoints,
    ).toBeCloseTo((0.3759715104 * 72) / 25.4);
  });
  it("computes independent canonical values", () => {
    close(calculate(example.input), example.output);
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (result.ok) close(result.output, example.output);
  });
  it("publishes valid contracts and schemas", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
  });
  it("rejects missing and unknown fields", () => {
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, unknown: true })).toMatchObject({
      ok: false,
    });
  });
  it("rejects wrong types and nonfinite evidence", () => {
    for (const [k, v] of Object.entries(example.input)) {
      expect(tool.execute({ ...example.input, [k]: null })).toMatchObject({
        ok: false,
      });
      if (typeof v === "number") {
        expect(tool.execute({ ...example.input, [k]: Infinity })).toMatchObject(
          { ok: false },
        );
        expect(() => calculate({ ...example.input, [k]: NaN })).toThrow();
      }
      if (Array.isArray(v))
        expect(tool.execute({ ...example.input, [k]: [NaN] })).toMatchObject({
          ok: false,
        });
    }
  });
  it("is deterministic and preserves evidence", () => {
    const input = JSON.parse(JSON.stringify(example.input)) as Input,
      before = JSON.stringify(input);
    close(calculate(input), example.output);
    close(calculate(input), example.output);
    expect(JSON.stringify(input)).toBe(before);
  });
  it("bounds evidence and refuses inherited sparse slots", () => {
    for (const [k, v] of Object.entries(example.input)) {
      if (Array.isArray(v)) {
        const invalid =
          typeof v[0] === "string"
            ? Array(129).fill("x")
            : Array.isArray(v[0])
              ? Array.from({ length: 129 }, () => [0, 0])
              : Array(10001).fill(0);
        expect(tool.execute({ ...example.input, [k]: invalid })).toMatchObject({
          ok: false,
        });
        const sparse = Array(1);
        Object.setPrototypeOf(
          sparse,
          Object.assign(Object.create(Array.prototype), { 0: v[0] }),
        );
        expect(() => calculate({ ...example.input, [k]: sparse })).toThrow();
      }
    }
  });
  it("rejects invalid domains", () => {
    const input = { ...example.input, observedCssFontPx: -1 };
    expect(() => calculate(input as unknown as Input)).toThrow();
    expect(tool.execute(input)).toMatchObject({ ok: false });
  });
  it("handles independent boundary evidence", () => {
    const input = {
      ...example.input,
      observedCssFontPx: 18.666666666666668,
      independentlyBoldForWcag: true,
    };
    close(calculate(input), {
      wcagLargeTextSizeScreen: true,
      requiredCssPxForDeclaredWeight: 18.666666666666668,
    });
    const result = tool.execute(input);
    expect(result.ok).toBe(true);
    if (result.ok)
      close(result.output, {
        wcagLargeTextSizeScreen: true,
        requiredCssPxForDeclaredWeight: 18.666666666666668,
      });
  });
});
