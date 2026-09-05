import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
import {
  calculate as facets,
  example as facetExample,
} from "../facet-count-lookup/tool.js";
import {
  calculate as cabochon,
  example as cabochonExample,
} from "../carats-cabochon/tool.js";
import {
  calculate as radiant,
  example as radiantExample,
} from "../carats-radiant/tool.js";
import {
  calculate as marquise,
  example as marquiseExample,
} from "../carats-marquise/tool.js";
import {
  calculate as asscher,
  example as asscherExample,
} from "../carats-asscher/tool.js";
import {
  calculate as baguette,
  example as baguetteExample,
} from "../carats-baguette/tool.js";
import {
  calculate as pearlGrain,
  example as grainExample,
} from "../carat-to-grain-pearl/tool.js";
import {
  calculate as mohs,
  example as mohsExample,
} from "../scratch-hardness-gap/tool.js";
import {
  calculate as fourC,
  example as fourCExample,
} from "../four-c-composite-scorer/tool.js";
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
  it("refuses negative or fractional declared facet inventory counts", () => {
    expect(() =>
      facets({ ...facetExample.input, observedFacetInventoryValue: -1 }),
    ).toThrow();
    expect(() =>
      facets({
        ...facetExample.input,
        callerVerifiedFacetInventoryValues: [2, 4.5],
      }),
    ).toThrow();
  });
  it("removes square corners rather than substituting an ellipse for a cushion", () => {
    const r = calculate({ ...example.input, roundedCornerRadiusMm: 0 });
    expect(r.conditionalEnvelopeVolumeMM3).toBe(120);
  });
  it("rejects geometrically overlapping rounded corners", () => {
    expect(() =>
      calculate({ ...example.input, roundedCornerRadiusMm: 4 }),
    ).toThrow();
  });
  it("models a half ellipsoid cabochon instead of a full ellipsoid", () => {
    expect(
      cabochon(cabochonExample.input).conditionalEnvelopeVolumeMM3,
    ).toBeCloseTo(40 * Math.PI);
  });
  it("integrates observed radiant sections instead of applying an emerald shape factor", () => {
    expect(
      radiant({
        ...radiantExample.input,
        observedRadiantSectionAreasMM2: [0, 0, 0],
      }).observedIntegratedRadiantVolumeMM3,
    ).toBe(0);
  });
  it("reduces the symmetric marquise lens to a circle at equal diagonals", () => {
    const r = marquise({
      ...marquiseExample.input,
      marquiseLengthMm: 6,
      marquiseWidthMm: 6,
    });
    expect(r.conditionalEnvelopeVolumeMM3).toBeCloseTo(18 * Math.PI);
  });
  it("accounts for explicit Asscher corner clip area", () => {
    const r = asscher({
      ...asscherExample.input,
      cornerClipFractionOfSide: 0.5,
    });
    expect(r.conditionalEnvelopeVolumeMM3).toBe(36);
  });
  it("retains taper in the independently measured baguette ends", () => {
    expect(
      baguette({ ...baguetteExample.input, firstEndWidthMm: 2 })
        .conditionalEnvelopeVolumeMM3,
    ).toBe(80);
  });
  it("uses pearl grain convention instead of the avoirdupois grain", () => {
    expect(
      pearlGrain({ ...grainExample.input, metricCarats: 1 }).pearlGrains,
    ).toBe(4);
  });
  it("does not infer a quantitative abrasion ratio from an ordinal Mohs gap", () => {
    expect(
      mohs(mohsExample.input).predictedQuantitativeAbrasionRatioAvailable,
    ).toBe(false);
  });
  it("keeps entirely missing four-C evidence distinct from a measured zero score", () => {
    const r = fourC({ ...fourCExample.input, knownFourCFlags: [0, 0, 0, 0] });
    expect(r.knownFourCWeightedScore).toBe(0);
    expect(r.knownWeightFraction).toBe(0);
    expect(r.completeFourCEvidence).toBe(false);
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
    const input = { ...example.input, roundedCornerRadiusMm: 4 };
    expect(() => calculate(input as unknown as Input)).toThrow();
    expect(tool.execute(input)).toMatchObject({ ok: false });
  });
  it("handles independent boundary evidence", () => {
    const input = { ...example.input, roundedCornerRadiusMm: 0 };
    close(calculate(input), {
      conditionalEnvelopeVolumeMM3: 120,
      conditionalMassCarats: 2.4,
    });
    const result = tool.execute(input);
    expect(result.ok).toBe(true);
    if (result.ok)
      close(result.output, {
        conditionalEnvelopeVolumeMM3: 120,
        conditionalMassCarats: 2.4,
      });
  });
});
