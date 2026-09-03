import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
import {
  calculate as brine,
  example as brineExample,
} from "../brine-salt-percentage/tool.js";
import {
  calculate as pasta,
  example as pastaExample,
} from "../pasta-water-salt-ratio/tool.js";
import {
  calculate as syrup,
  example as syrupExample,
} from "../simple-syrup-ratio/tool.js";
import {
  calculate as abv,
  example as abvExample,
} from "../cocktail-abv/tool.js";
import {
  calculate as dilution,
  example as dilutionExample,
} from "../cocktail-dilution/tool.js";
import {
  calculate as soda,
  example as sodaExample,
} from "../baking-soda-to-acid-ratio/tool.js";
import {
  calculate as wine,
  example as wineExample,
} from "../wine-reduction-ratio/tool.js";
import {
  calculate as feed,
  example as feedExample,
} from "../sourdough-starter-feed-ratio/tool.js";
import {
  calculate as egg,
  example as eggExample,
} from "../omelet-egg-per-person/tool.js";
import {
  calculate as scale,
  example as scaleExample,
} from "../cake-pan-conversion-round-to-square/tool.js";
import {
  calculate as timing,
  example as timingExample,
} from "../sous-vide-time-thickness/tool.js";
import {
  calculate as substitute,
  example as substituteExample,
} from "../flour-whole-wheat-to-white-substitution/tool.js";
import {
  calculate as lye,
  example as lyeExample,
} from "../pretzel-lye-concentration/tool.js";
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
  it("includes dry starter flour in the total denominator", () => {
    const r = calculate({
      ...example.input,
      starterMassG: 100,
      callerStarterWaterMassFraction: 0,
    });
    expect(r.totalFlourG).toBe(200);
    expect(r.totalWaterG).toBe(50);
    expect(r.starterInclusiveHydrationPercent).toBe(25);
  });
  it("handles fully water-described starter without phantom flour", () => {
    expect(
      calculate({ ...example.input, callerStarterWaterMassFraction: 1 })
        .totalFlourG,
    ).toBe(100);
  });
  it("distinguishes salt/water recipe percentage from salt/solution concentration", () => {
    const r = pasta({
      ...pastaExample.input,
      observedSaltG: 100,
      observedPastaWaterG: 100,
    });
    expect(r.saltPerWaterPercent).toBe(100);
    expect(r.initialDissolvedSaltMassPercent).toBe(50);
  });
  it("keeps whole brine ingredient-assay mass denominators", () => {
    expect(
      brine({
        ...brineExample.input,
        observedBrineIngredientMassesG: [100, 100],
        independentIngredientSaltMassFractions: [0.5, 0],
      }).brineSaltMassPercent,
    ).toBe(25);
  });
  it("does not invent a universal syrup recipe", () => {
    expect(
      syrup({ ...syrupExample.input, callerSyrupSugarPerWaterMassRatio: 0.5 })
        .signedRecipeMassDiscrepancyG,
    ).toBe(-30);
  });
  it("uses observed final cocktail volume despite contraction", () => {
    const r = abv({ ...abvExample.input, observedFinalMixedVolumeMl: 80 });
    expect(r.conditionalCocktailAbvPercent).toBe(25);
    expect(r.signedAdditiveVolumeResidualMl).toBe(-20);
  });
  it("refuses ethanol-equivalent inventory above actual cocktail volume", () => {
    expect(() =>
      abv({ ...abvExample.input, observedFinalMixedVolumeMl: 19 }),
    ).toThrow();
  });
  it("retains removed liquid in meltwater balance", () => {
    expect(
      dilution({ ...dilutionExample.input, observedPostShakeLiquidMassG: 100 })
        .conditionalAddedIceWaterG,
    ).toBe(10);
  });
  it("keeps acid excess distinct from acid ingredient grams", () => {
    expect(
      soda({ ...sodaExample.input, observedAvailableAcidEquivalentsMol: 0 })
        .signedAcidMinusBaseEquivalentsMol,
    ).toBeCloseTo(-0.08);
  });
  it("does not infer wine ethanol removal from total reduction", () => {
    expect(
      wine({
        ...wineExample.input,
        independentlyAssayedFinalEthanolMassFraction: 0.2,
      }).assayedEthanolRemovedG,
    ).toBe(0);
  });
  it("refuses extrapolation of conditional sous-vide observations", () => {
    expect(() =>
      timing({ ...timingExample.input, querySousVideThicknessCoordinate: 31 }),
    ).toThrow();
  });
  it("uses the final left secant at a calibrated endpoint", () => {
    const r = timing({
      ...timingExample.input,
      querySousVideThicknessCoordinate: 30,
    });
    expect(r.interpolatedResponse).toBe(5);
    expect(r.localObservedSlope).toBe(-0.5);
  });
  it("uses the right secant at an exact interior calibration point", () => {
    const r = timing({
      ...timingExample.input,
      querySousVideThicknessCoordinate: 20,
    });
    expect(r.interpolatedResponse).toBe(10);
    expect(r.localObservedSlope).toBe(-0.5);
  });
  it("tracks water and flour separately across a starter feed", () => {
    const r = feed({
      ...feedExample.input,
      independentStarterWaterFraction: 0,
    });
    expect(r.callerAddedFlourG).toBe(40);
    expect(r.callerAddedWaterG).toBe(20);
    expect(r.conditionalFedStarterHydrationPercent).toBeCloseTo(100 / 3);
  });
  it("rounds whole eggs upward while retaining actual mass", () => {
    const r = egg({
      ...eggExample.input,
      callerOmeletServings: 1,
      callerEdibleEggMassPerServingG: 61,
    });
    expect(r.wholeEggCount).toBe(2);
    expect(r.conditionalEdibleEggMassG).toBe(120);
  });
  it("does not substitute area ratio for changed pan depth", () => {
    const r = scale({ ...scaleExample.input, targetFillHeightCm: 8 });
    expect(r.conditionalBatterVolumeScale).toBeCloseTo(8 / Math.PI);
  });
  it("retains a signed absorption reduction on flour substitution", () => {
    expect(
      substitute({
        ...substituteExample.input,
        independentWholeWheatAbsorptionGPerG: 0.4,
      }).conditionalExtraWaterG,
    ).toBeCloseTo(-10);
  });
  it("audits already prepared caustic concentration without normalizing an excess", () => {
    expect(() =>
      lye({ ...lyeExample.input, independentlyAssayedLyeMassG: 1001 }),
    ).toThrow();
  });
  it("rejects overflow in otherwise finite mixture masses", () => {
    expect(() =>
      abv({
        ...abvExample.input,
        observedIngredientVolumesMl: [1e308, 1e308],
        observedFinalMixedVolumeMl: 1e308,
      }),
    ).toThrow();
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
    const input = { ...example.input, addedFlourG: 0, starterMassG: 0 };
    expect(() => calculate(input as unknown as Input)).toThrow();
    expect(tool.execute(input)).toMatchObject({ ok: false });
  });
  it("handles independent boundary evidence", () => {
    const input = { ...example.input, starterMassG: 0 };
    close(calculate(input), {
      totalFlourG: 100,
      totalWaterG: 50,
      starterInclusiveHydrationPercent: 50,
    });
    const result = tool.execute(input);
    expect(result.ok).toBe(true);
    if (result.ok)
      close(result.output, {
        totalFlourG: 100,
        totalWaterG: 50,
        starterInclusiveHydrationPercent: 50,
      });
  });
});
