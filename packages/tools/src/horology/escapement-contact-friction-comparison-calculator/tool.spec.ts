import { describe, expect, it } from "vitest";
import {
  compareEscapementContactFriction,
  escapementFrictionComparisonExample,
  runEscapementFrictionComparison,
} from "./tool.js";

describe("escapement contact-friction comparison calculator", () => {
  it("reproduces the canonical 95-percent reduction", () => {
    expect(
      runEscapementFrictionComparison(
        escapementFrictionComparisonExample.input,
      ),
    ).toEqual({ ok: true, output: escapementFrictionComparisonExample.output });
  });

  it("allows zero measured silicon friction", () => {
    expect(
      compareEscapementContactFriction({
        lubricatedContactFrictionMillinewtons: 0.2,
        referenceUnlubricatedFrictionMillinewtons: 1,
        siliconContactFrictionMillinewtons: 0,
      }),
    ).toMatchObject({
      frictionReductionPercent: 100,
      relativeToUnlubricatedFriction: 0,
    });
  });

  it("can show a negative reduction when silicon friction is higher", () => {
    expect(
      compareEscapementContactFriction({
        lubricatedContactFrictionMillinewtons: 0.2,
        referenceUnlubricatedFrictionMillinewtons: 1,
        siliconContactFrictionMillinewtons: 1.2,
      }).frictionReductionPercent,
    ).toBe(-19.999999999999996);
  });

  it("rejects an unlubricated baseline below the lubricated measurement", () => {
    expect(
      runEscapementFrictionComparison({
        lubricatedContactFrictionMillinewtons: 0.2,
        referenceUnlubricatedFrictionMillinewtons: 0.1,
        siliconContactFrictionMillinewtons: 0.05,
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "friction_baseline_invalid",
            field: "referenceUnlubricatedFrictionMillinewtons",
          },
        ],
      },
      ok: false,
    });
  });

  it("rejects a negative friction measurement", () => {
    expect(
      runEscapementFrictionComparison({
        lubricatedContactFrictionMillinewtons: -1,
        referenceUnlubricatedFrictionMillinewtons: 1,
        siliconContactFrictionMillinewtons: 0.05,
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "invalid_field",
            field: "lubricatedContactFrictionMillinewtons",
          },
        ],
      },
      ok: false,
    });
  });
});
