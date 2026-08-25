import { describe, expect, it } from "vitest";
import {
  calculateEstimatedPositionLeeway,
  estimatedPositionLeewayExample,
  runEstimatedPositionLeeway,
} from "./tool.js";

describe("EP With Leeway", () => {
  it("publishes an executable example", () =>
    expect(
      runEstimatedPositionLeeway(estimatedPositionLeewayExample.input),
    ).toEqual({
      ok: true,
      output: estimatedPositionLeewayExample.output,
    }));

  it.each([
    [100, "starboard", 5, 95],
    [100, "port", 5, 105],
    [200, "starboard", 10, 190],
    [358, "starboard", 5, 353],
    [2, "port", 5, 7],
    [360, "starboard", 15, 345],
  ] as const)(
    "shifts the course opposite the tack sign",
    (trueHeadingDeg, tack, leewayDegrees, expected) => {
      expect(
        calculateEstimatedPositionLeeway({
          leewayDegrees,
          tack,
          trueHeadingDeg,
        }),
      ).toEqual({ estimatedCourseDeg: expected });
    },
  );

  it("defaults the leeway angle to five degrees", () => {
    expect(
      runEstimatedPositionLeeway({ tack: "starboard", trueHeadingDeg: 100 }),
    ).toEqual({ ok: true, output: { estimatedCourseDeg: 95 } });
    expect(
      runEstimatedPositionLeeway({ tack: "port", trueHeadingDeg: 100 }),
    ).toEqual({ ok: true, output: { estimatedCourseDeg: 105 } });
  });

  it("wraps results into the compass circle", () => {
    expect(
      calculateEstimatedPositionLeeway({
        leewayDegrees: 10,
        tack: "starboard",
        trueHeadingDeg: 3,
      }),
    ).toEqual({ estimatedCourseDeg: 353 });
    expect(
      calculateEstimatedPositionLeeway({
        leewayDegrees: 10,
        tack: "port",
        trueHeadingDeg: 359,
      }),
    ).toEqual({ estimatedCourseDeg: 9 });
  });

  it("leaves the heading unchanged with zero leeway", () => {
    expect(
      calculateEstimatedPositionLeeway({
        leewayDegrees: 0,
        tack: "port",
        trueHeadingDeg: 123,
      }),
    ).toEqual({ estimatedCourseDeg: 123 });
  });

  it.each([[16], [-1]])(
    "rejects leeway angles outside zero to fifteen",
    (leewayDegrees) => {
      expect(
        runEstimatedPositionLeeway({
          leewayDegrees,
          tack: "starboard",
          trueHeadingDeg: 100,
        }),
      ).toMatchObject({
        error: { issues: [{ code: "invalid_field" }] },
        ok: false,
      });
    },
  );

  it.each([[-1], [361], [400]])(
    "rejects headings outside zero to three sixty",
    (trueHeadingDeg) => {
      expect(
        calculateEstimatedPositionLeeway({
          tack: "port",
          trueHeadingDeg,
        }),
      ).toBeNull();
      const result = runEstimatedPositionLeeway({
        tack: "port",
        trueHeadingDeg,
      });
      expect(result.ok).toBe(false);
      if (!result.ok)
        expect(result.error.issues[0]?.code).toBe("invalid_heading");
    },
  );

  it("rejects invalid tacks and unknown fields", () => {
    expect(
      runEstimatedPositionLeeway({
        tack: "reach",
        trueHeadingDeg: 100,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    });
    expect(
      runEstimatedPositionLeeway({
        sail: "main",
        tack: "port",
        trueHeadingDeg: 100,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field" }] },
      ok: false,
    });
  });
});
