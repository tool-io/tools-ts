import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
import {
  calculate as harmony,
  example as harmonyExample,
} from "../analogous-hues-plus-minus-30/tool.js";
import {
  calculate as nearest,
  example as nearestExample,
} from "../pantone-approximate-nearest-rgb-lookup/tool.js";
import {
  calculate as material,
  example as materialExample,
} from "../material-design-palette-step-classify-50-900/tool.js";
import {
  calculate as cost,
  example as costExample,
} from "../spot-vs-process-cost-factor-lookup/tool.js";
import {
  calculate as paint,
  example as paintExample,
} from "../paint-coverage-two-coats-tint-base-lookup/tool.js";
import {
  calculate as spectrum,
  example as spectrumExample,
} from "../spectral-band-name-from-nm-lookup/tool.js";
import {
  calculate as white,
  example as whiteExample,
} from "../white-point-d50-vs-d65-delta-e/tool.js";
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
  it("retains APCA polarity rather than returning an unsigned WCAG contrast ratio", () => {
    expect(calculate(example.input).approximateSignedApcaLc).toBeGreaterThan(
      100,
    );
    expect(
      calculate({
        ...example.input,
        textEncodedSrgb: [1, 1, 1],
        backgroundEncodedSrgb: [0, 0, 0],
      }).approximateSignedApcaLc,
    ).toBeLessThan(-100);
  });
  it("reports identical opaque colors as zero contrast", () => {
    expect(
      calculate({
        ...example.input,
        textEncodedSrgb: [0.2, 0.2, 0.2],
        backgroundEncodedSrgb: [0.2, 0.2, 0.2],
      }).approximateSignedApcaLc,
    ).toBe(0);
  });
  it("clips the explicitly modeled APCA near-zero contrast zone", () => {
    expect(
      calculate({
        ...example.input,
        textEncodedSrgb: [0.5, 0.5, 0.5],
        backgroundEncodedSrgb: [0.50001, 0.50001, 0.50001],
      }).approximateSignedApcaLc,
    ).toBe(0);
  });
  it("requires chromatic hue evidence before generating hue-wheel harmony", () => {
    expect(() =>
      harmony({ ...harmonyExample.input, callerHueDefined: false }),
    ).toThrow();
  });
  it("wraps angular harmony across zero degrees", () => {
    expect(
      harmony({ ...harmonyExample.input, primaryHueDegrees: 0 })
        .harmonyHueDegrees,
    ).toEqual([330, 30]);
  });
  it("retains all equally near licensed swatches", () => {
    const r = nearest({
      ...nearestExample.input,
      callerSameWhitePantoneLabSwatches: [
        [50, 0, 0],
        [50, 0, 0],
      ],
      querySameWhiteLab: [50, 0, 0],
    });
    expect(r.nearestCallerIds).toEqual(["a", "b"]);
  });
  it("does not invent an undocumented Material accent step", () => {
    expect(() =>
      material({
        ...materialExample.input,
        callerMaterialEditionSteps: [50, 100, 150],
      }),
    ).toThrow();
  });
  it("rounds exact half-unit cost basis points away from zero", () => {
    expect(
      cost({
        ...costExample.input,
        callerSpotQuoteMinor: 1,
        callerProcessQuoteMinor: 20000,
      }).spotOverProcessCostBasisPoints,
    ).toBe(1);
  });
  it("does not multiply an already two-coat paint coverage calibration twice", () => {
    expect(
      paint({ ...paintExample.input, callerIndependentWasteFractions: [0, 0] })
        .conditionalRequiredPaintLiters,
    ).toBe(4);
  });
  it("uses lower-inclusive upper-exclusive spectral bands at a shared boundary", () => {
    expect(spectrum(spectrumExample.input).matchingCallerBandNames).toEqual([
      "long",
    ]);
  });
  it("compares measured whites in a common Lab reference instead of their own normalized whites", () => {
    expect(
      white({
        ...whiteExample.input,
        independentlyMeasuredD50WhiteLabInCommonReference: [100, 0, 0],
      }).commonReferenceWhiteDeltaECie76,
    ).toBe(0);
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
    const input = { ...example.input, textEncodedSrgb: [-1, 0, 0] };
    expect(() => calculate(input as unknown as Input)).toThrow();
    expect(tool.execute(input)).toMatchObject({ ok: false });
  });
  it("handles independent boundary evidence", () => {
    const input = {
      ...example.input,
      textEncodedSrgb: [1, 1, 1],
      backgroundEncodedSrgb: [0, 0, 0],
    };
    close(calculate(input), { approximateSignedApcaLc: -107.88473318309848 });
    const result = tool.execute(input);
    expect(result.ok).toBe(true);
    if (result.ok)
      close(result.output, { approximateSignedApcaLc: -107.88473318309848 });
  });
});
