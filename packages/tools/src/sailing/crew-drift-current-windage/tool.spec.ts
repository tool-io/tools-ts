import { describe, expect, it } from "vitest";
import {
  calculateCrewDriftCurrentWindage,
  crewDriftCurrentWindageExample,
  runCrewDriftCurrentWindage,
} from "./tool.js";

describe("Crew Drift Estimate", () => {
  it("publishes an executable example", () =>
    expect(
      runCrewDriftCurrentWindage(crewDriftCurrentWindageExample.input),
    ).toEqual({
      ok: true,
      output: crewDriftCurrentWindageExample.output,
    }));

  it.each([
    [1.5, 2, 10, 0.01, 3.2],
    [1, 1, 0, 0.01, 1],
    [0, 3, 12, 0.01, 0.36],
    [2.5, 4, 8, 0.02, 10.64],
    [0, 5, 0, 0.01, 0],
  ])(
    "adds current set and windage drift",
    (currentKt, hours, windKt, windageCoefficient, expected) => {
      expect(
        calculateCrewDriftCurrentWindage({
          currentKt,
          hours,
          windKt,
          windageCoefficient,
        }),
      ).toEqual({ totalDriftNm: expected });
    },
  );

  it("applies the default one percent windage coefficient", () => {
    expect(
      runCrewDriftCurrentWindage({ currentKt: 1.5, hours: 2, windKt: 10 }),
    ).toEqual({ ok: true, output: { totalDriftNm: 3.2 } });
  });

  it("accepts coefficients across the full allowed band", () => {
    expect(
      runCrewDriftCurrentWindage({
        currentKt: 0,
        hours: 1,
        windKt: 10,
        windageCoefficient: 0,
      }).ok,
    ).toBe(true);
    expect(
      runCrewDriftCurrentWindage({
        currentKt: 0,
        hours: 1,
        windKt: 10,
        windageCoefficient: 0.05,
      }),
    ).toEqual({ ok: true, output: { totalDriftNm: 0.5 } });
  });

  it("grows linearly with time in the water", () => {
    const one = calculateCrewDriftCurrentWindage({
      currentKt: 1,
      hours: 1,
      windKt: 15,
    })!.totalDriftNm;
    const three = calculateCrewDriftCurrentWindage({
      currentKt: 1,
      hours: 3,
      windKt: 15,
    })!.totalDriftNm;
    expect(three).toBeCloseTo(one * 3, 12);
  });

  it.each([
    [-1, 2, 10],
    [1, -2, 10],
    [1, 2, -10],
  ])("rejects negative rates and hours", (currentKt, hours, windKt) => {
    expect(
      calculateCrewDriftCurrentWindage({ currentKt, hours, windKt }),
    ).toBeNull();
    const result = runCrewDriftCurrentWindage({ currentKt, hours, windKt });
    expect(result.ok).toBe(false);
  });

  it("rejects coefficients outside zero to five percent", () => {
    expect(
      runCrewDriftCurrentWindage({
        currentKt: 1,
        hours: 1,
        windKt: 5,
        windageCoefficient: 0.06,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    });
  });

  it("rejects unknown fields and missing required inputs", () => {
    expect(runCrewDriftCurrentWindage({ crew: 1 } as never)).toMatchObject({
      error: { issues: [{ code: "unknown_field" }] },
      ok: false,
    });
    expect(runCrewDriftCurrentWindage({ hours: 1 } as never).ok).toBe(false);
  });
});
