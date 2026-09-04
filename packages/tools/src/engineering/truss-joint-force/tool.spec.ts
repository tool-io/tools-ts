import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
import {
  solve,
  fullCircle,
  profileRa,
  hardy,
  muskingum,
  windowBounds,
  navier,
  nyquist,
  rootStationary,
  mccabe,
} from "../batch38-shared.js";
import {
  pss78,
  potentialTemperature,
} from "../../oceanography/batch38-shared.js";
import { rebarCut, firstFit } from "../../construction/batch38-shared.js";
import {
  calculate as elastic,
  exampleInput as elasticInput,
} from "../prestress-loss-elastic/tool.js";
import {
  calculate as creep,
  exampleInput as creepInput,
} from "../prestress-loss-creep/tool.js";
import {
  calculate as shrink,
  exampleInput as shrinkInput,
} from "../prestress-loss-shrinkage/tool.js";
import {
  calculate as cooling,
  exampleInput as coolingInput,
} from "../hvac-cooling-load/tool.js";
import {
  calculate as silt,
  exampleInput as siltInput,
} from "../../agriculture/soil-texture-silt-percentage/tool.js";
import {
  calculate as clay,
  exampleInput as clayInput,
} from "../../agriculture/soil-texture-clay-percentage/tool.js";
import {
  calculate as cost,
  exampleInput as costInput,
} from "../../agriculture/cost-of-production-per-kg/tool.js";
import {
  calculate as poisson,
  exampleInput as poissonInput,
} from "../foundation-settlement-immediate/tool.js";
import {
  calculate as depth,
  exampleInput as depthInput,
} from "../two-way-slab-effective-depth/tool.js";
import {
  calculate as notch,
  exampleInput as notchInput,
} from "../timber-notch-capacity/tool.js";
import {
  calculate as breguet,
  exampleInput as breguetInput,
} from "../aircraft-range-breguet/tool.js";
import {
  calculate as strut,
  exampleInput as strutInput,
} from "../deep-beam-shear/tool.js";
import {
  calculate as takeoff,
  exampleInput as takeoffInput,
} from "../aircraft-takeoff-distance/tool.js";
import {
  calculate as phase,
  exampleInput as phaseInput,
} from "../../oceanography/indian-ocean-dipole-gradient-classifier/tool.js";
import {
  calculate as freeze,
  exampleInput as freezeInput,
} from "../../construction/concrete-freeze-thaw-cycles/tool.js";
import {
  calculate as hold,
  exampleInput as holdInput,
} from "../../construction/flooring-acclimation-time/tool.js";
import {
  calculate as evidence,
  exampleInput as evidenceInput,
} from "../../volcanology/caldera-vs-summit-crater-classifier/tool.js";
import {
  calculate as band,
  exampleInput as bandInput,
} from "../crane-load-chart/tool.js";
import {
  calculate as witnesses,
  exampleInput as witnessInput,
} from "../../agriculture/drying-time/tool.js";
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
    const input = {
      ...example.input,
      memberDirectionCosines: [
        [1, 0],
        [1, 0],
      ],
    };
    expect(() => calculate(input as unknown as Input)).toThrow();
    expect(tool.execute(input)).toMatchObject({ ok: false });
  });
  it("handles independent boundary evidence", () => {
    const input = { ...example.input, externalJointForce: [0, 0] };
    close(calculate(input), { signedMemberForces: [0, 0] });
    const result = tool.execute(input);
    expect(result.ok).toBe(true);
    if (result.ok) close(result.output, { signedMemberForces: [0, 0] });
  });
});
describe("batch38 numerical, evidence and model regressions", () => {
  it("pivots a nonsymmetric equilibrium system", () =>
    close(
      solve(
        [
          [0, 2],
          [1, 1],
        ],
        [6, 5],
      ),
      [2, 3],
    ));
  it("normalizes independently scaled equilibrium rows", () =>
    close(
      solve(
        [
          [1e-100, 0],
          [0, 1e100],
        ],
        [2e-100, 3e100],
      ),
      [2, 3],
    ));
  it("refuses singular equilibrium", () =>
    expect(() =>
      solve(
        [
          [1, 2],
          [2, 4],
        ],
        [1, 2],
      ),
    ).toThrow());
  it("bounds dense equilibrium unknowns", () =>
    expect(() =>
      solve(
        Array.from({ length: 33 }, (_, i) =>
          Array.from({ length: 33 }, (_, j) => (i === j ? 1 : 0)),
        ),
        Array(33).fill(1),
      ),
    ).toThrow());
  it("does not silently lose overflowing normalized loads", () =>
    expect(() => solve([[1e-300]], [1e300])).toThrow());
  it("fits translated bolt centers without origin bias", () => {
    const f = fullCircle([
      [11, 20],
      [10, 21],
      [9, 20],
      [10, 19],
    ]);
    close(f.center, [10, 20]);
    close(f.radius, 1);
    close(f.radialRmse, 0);
  });
  it("refuses unresolved collinear pitch patterns", () =>
    expect(() =>
      fullCircle([
        [0, 0],
        [1, 0],
        [2, 0],
      ]),
    ).toThrow());
  it("integrates unequal-station signed profile deviations", () =>
    close(profileRa([0, 1, 3], [0, 2, 2]), 25 / 54));
  it("Ra is translation invariant in vertical profile height", () =>
    close(profileRa([0, 1, 3], [10, 12, 12]), 25 / 54));
  it("refuses zero Darcy-loop derivative", () =>
    expect(() => hardy([0, 0], [1, 1], [2, 2])).toThrow());
  it("retains signed single-loop correction", () =>
    close(hardy([2, -1], [1, 1], [2, 2]), -0.5));
  it("routes at the nonnegative coefficient boundary", () =>
    close(muskingum([0, 10, 0], 0, 1, 0, 2), [0, 5, 5]));
  it("uses stable dimensionless Muskingum coefficients", () =>
    close(muskingum([5, 5, 5], 5, 1e308, 0.25, 1e308), [5, 5, 5]));
  it("does not invent a routed sample from no observations", () =>
    expect(() => muskingum([], 0, 1, 0.25, 1)).toThrow());
  it("retains negative signal progression bandwidth", () =>
    close(windowBounds([0, 3], [2, 4], [0, 0]).signedCommonBandwidth, -1));
  it("converges bounded square-plate Navier terms", () =>
    expect(
      Math.abs(navier(1, 1, 1, 1, 0.5, 0.5, 32) - 0.00406235266),
    ).toBeLessThan(1e-10));
  it("preserves simply-supported plate zero-edge condition", () =>
    close(navier(1, 1, 1, 1, 0, 0.5, 4), 0));
  it("refuses overflowing modal denominator instead of returning zero", () =>
    expect(() => navier(1, 1, 1e308, 1, 0.5, 0.5, 1)).toThrow());
  it("retains reverse Nyquist winding sign", () =>
    close(nyquist([0, -1, -2, -1, 0], [0, -1, 0, 1, 0]), -1));
  it("refuses critical-point segment crossings", () =>
    expect(() => nyquist([0, -2, -2, 0], [0, 0, 1, 0])).toThrow());
  it("honors endpoint stationary-gain witnesses", () =>
    close(rootStationary([0, -2], [], -1, -0.5), {
      stationaryPoint: -1,
      gain: 1,
    }));
  it("refuses nonisolated canceled root-locus branches", () =>
    expect(() => rootStationary([-2], [-2], -1, 0)).toThrow());
  it("retains stage-cap censoring rather than declaring reached bottoms", () =>
    close(mccabe([0, 0.5, 1], [0, 0.75, 1], 0.75, 0.4, 1, 2), {
      stageLiquidCompositions: [0.5, 5 / 12],
      reachedBottom: false,
    }));
  it.each([
    [1.2, 20, 2000, 37.24562765],
    [0.65, 5, 1500, 27.99534693],
  ])("matches pressure-corrected UNESCO PSS78 reference %s", (r, t, p, s) =>
    close(pss78(r, t, p), s),
  );
  it("matches the nonzero-pressure UNESCO potential-temperature reference", () =>
    close(potentialTemperature(35, 10, 1000, 0), 9.879263538718575));
  it("agrees with UNESCO large-step check within published-step integration error", () =>
    expect(
      Math.abs(potentialTemperature(35, 10, 10000, 0) - 8.36425752),
    ).toBeLessThan(5e-5));
  it("adiabatic pressure integration round-trips within numerical precision", () =>
    close(
      potentialTemperature(35, potentialTemperature(35, 10, 5000, 0), 0, 5000),
      10,
    ));
  it("refuses adiabatic paths outside calibrated temperature", () =>
    expect(() => potentialTemperature(35, 40, 0, 10000)).toThrow());
  it("applies actual concrete-gauge shortening in elastic loss", () =>
    close(
      elastic({ ...elasticInput, matchedConcreteGaugeLengthM: 2 })
        .stagePrestressStressLossPa,
      25,
    ));
  it("applies independently age-matched creep coefficients", () =>
    close(
      creep({ ...creepInput, callerIndependentCreepCoefficient: 2 })
        .stagePrestressStressLossPa,
      100,
    ));
  it("retains shrinkage over-accounting credits", () =>
    close(
      shrink({ ...shrinkInput, callerAlreadyAccountedShrinkageStrain: 0.002 })
        .stagePrestressStressLossPa,
      -50,
    ));
  it("includes latent cooling beyond sensible-only heating budgets", () =>
    close(
      cooling({
        ...coolingInput,
        callerIndependentCondensedWaterKgSecond: [1, 2],
      }).signedTotalZoneLoadW,
      317,
    ));
  it("subtracts independently observed clay from fine sedimentation", () =>
    close(
      silt({ ...siltInput, observedIncludedClayMassKg: [0, 0] })
        .observedRecoveredComponentPercent,
      50,
    ));
  it("expands dry clay aliquots to whole suspension before pooling", () => {
    const f = clay({
      ...clayInput,
      callerMatchedAliquotToWholeDispersionFactors: [2, 2],
    });
    close(f.observedRecoveredComponentPercent, 600 / 13);
    close(f.recoveredMassClosureFraction, 13 / 15);
  });
  it("rounds signed monetary half-units away from zero", () =>
    close(
      cost({
        ...costInput,
        observedCostLineMinorUnits: [0],
        callerAlreadyAccountedCreditsMinorUnits: [25],
      }),
      {
        netProductionCostMinorUnits: -25,
        roundedProductionCostMinorUnitsPerKg: -13,
      },
    ));
  it("retains exact cancellation beyond unsafe intermediate monetary sums", () =>
    close(
      cost({
        ...costInput,
        observedCostLineMinorUnits: [
          Number.MAX_SAFE_INTEGER,
          Number.MAX_SAFE_INTEGER,
        ],
        callerAlreadyAccountedCreditsMinorUnits: [
          Number.MAX_SAFE_INTEGER,
          Number.MAX_SAFE_INTEGER,
        ],
      }).netProductionCostMinorUnits,
      0,
    ));
  it("requires stable compressible elastic soil branch", () =>
    expect(() => poisson({ ...poissonInput, poisson: 0.5 })).toThrow());
  it("requires positive residual reinforcement effective depth", () =>
    expect(() => depth({ ...depthInput, observedBottomCoverM: 1 })).toThrow());
  it("does not accept notches through the entire timber depth", () =>
    expect(() => notch({ ...notchInput, observedNotchDepthM: 1 })).toThrow());
  it("does not invent negative cruise distance on mass-gain branch", () =>
    expect(() =>
      breguet({ ...breguetInput, finalAircraftMassKg: 200 }),
    ).toThrow());
  it("refuses obtuse compression-strut branch", () =>
    expect(() =>
      strut({ ...strutInput, callerCompressionStrutAngleRad: Math.PI }),
    ).toThrow());
  it("detects negative interior ground speed despite nonnegative endpoints", () =>
    expect(() =>
      takeoff({
        ...takeoffInput,
        observedRollTimesSeconds: [0, 2],
        callerMatchedGroundAccelerationMSecond2: [-2, 2],
        initialGroundSpeedMSecond: 0.5,
      }),
    ).toThrow());
  it("does not infer a completed cycle from an initially frozen sample", () =>
    close(freeze({ ...freezeInput, observedConcreteTemperaturesC: [-2, 2] }), {
      witnessedFreezeThawCycleCount: 0,
      unfinishedObservedFrozenPhase: false,
      openingFrozenStateWithoutWarmWitness: true,
    }));
  it("never joins in-band holds across an out-of-band witness", () =>
    close(
      hold({
        ...holdInput,
        observedFlooringMoistureFractions: [0.2, 0.1, 0.2, 0.2],
      }).witnessedQualificationStartHours,
      [],
    ));
  it("unknown eruption evidence retains possibilities without fabricating support", () =>
    close(
      evidence({
        ...evidenceInput,
        knownDepressionOriginEvidenceFlags: [0, 0],
      }),
      {
        contradictionFreeCallerClasses: ["class-a", "class-b"],
        fullyWitnessedCallerClasses: [],
      },
    ));
  it("distinguishes known zero crane margins from unknown placeholders", () =>
    close(
      band({
        ...bandInput,
        observedCraneLoad: [1, 1],
        knownCraneLoadCriterionFlags: [1, 0],
      }),
      {
        signedKnownBandMargins: [0, 0],
        knownReviewIndices: [],
        unknownCriterionIndices: [1],
      },
    ));
  it("retains sampled drying plateau witnesses", () =>
    close(
      witnesses({
        ...witnessInput,
        observedMatchedWetMoistureFractions: [0.2, 0.2, 0.2],
      }).observedTargetDryingCrossingHours,
      [0, 1, 3],
    ));
  it("missing drying target witnesses remain empty", () =>
    close(
      witnesses({ ...witnessInput, callerTargetWetMoistureFraction: 0.9 })
        .observedTargetDryingCrossingHours,
      [],
    ));
  it("separates lumber material compatibility from geometric fit", () =>
    close(firstFit([4], ["oak"], [10], ["pine"], 1), {
      pieceStockIndices: [-1],
      usedStockIndices: [],
      remainingUsedStockMm: [],
      unassignedPieceIndices: [0],
    }));
  it("charges the last-piece lumber saw kerf explicitly", () =>
    close(firstFit([10], ["a"], [10], ["a"], 1).unassignedPieceIndices, [0]));
  it("reports exact stock unallocated length without claiming scrap", () =>
    close(rebarCut([6, 6, 4, 4], 10).unallocatedStockMm, 0));
  it.each([
    [6, 6, 4, 4],
    [8, 7, 3, 2],
    [5, 5, 5],
    [9, 1, 9, 1],
    [4, 4, 4, 4, 4],
    [7, 7, 6, 4, 3, 3],
  ])("matches independently enumerated optimal stock counts %s", (...input) => {
    const cuts = input as number[];
    const bins: number[] = [],
      assignments: number[] = [];
    let best = cuts.length;
    const search = (i: number): void => {
      if (bins.length >= best) return;
      if (i === cuts.length) {
        best = bins.length;
        return;
      }
      const seen = new Set<number>();
      for (let j = 0; j < bins.length; j++)
        if (bins[j] + cuts[i] <= 10 && !seen.has(bins[j])) {
          seen.add(bins[j]);
          bins[j] += cuts[i];
          search(i + 1);
          bins[j] -= cuts[i];
        }
      bins.push(cuts[i]);
      search(i + 1);
      bins.pop();
    };
    search(0);
    const result = rebarCut(cuts, 10);
    close(result.minimumBars, best);
    result.cutBarIndices.forEach(
      (b, i) => (assignments[b] = (assignments[b] ?? 0) + cuts[i]),
    );
    expect(assignments.every((v) => v <= 10)).toBe(true);
    close(
      assignments.reduce((s, v) => s + v, 0),
      cuts.reduce((s, v) => s + v, 0),
    );
  });
  it("dipole phase equality stays neutral", () =>
    close(
      phase({
        ...phaseInput,
        observedWestIndianOceanAnomalyC: 0.4,
        observedEastIndianOceanAnomalyC: 0,
      }).callerDipolePhase,
      "neutral",
    ));
});
