import { describe, expect, it } from "vitest";
import {
  groundspeedRequiredForEtaExample,
  runGroundspeedRequiredForEta,
} from "./tool.js";

describe("groundspeed required for eta calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runGroundspeedRequiredForEta(groundspeedRequiredForEtaExample.input),
    ).toEqual({
      ok: true,
      output: groundspeedRequiredForEtaExample.output,
    });
  });

  it("requires sixty knots to fly one nautical mile in one minute", () => {
    expect(
      runGroundspeedRequiredForEta({ distanceNm: 1, minutesUntilDeadline: 1 }),
    ).toEqual({ ok: true, output: { requiredGroundSpeedKt: 60 } });
  });

  it("scales linearly with distance and inversely with time", () => {
    expect(
      runGroundspeedRequiredForEta({
        distanceNm: 90,
        minutesUntilDeadline: 30,
      }),
    ).toEqual({ ok: true, output: { requiredGroundSpeedKt: 180 } });
    expect(
      runGroundspeedRequiredForEta({
        distanceNm: 90,
        minutesUntilDeadline: 120,
      }),
    ).toEqual({ ok: true, output: { requiredGroundSpeedKt: 45 } });
  });

  it("handles fractional minutes", () => {
    const result = runGroundspeedRequiredForEta({
      distanceNm: 40,
      minutesUntilDeadline: 12.5,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.requiredGroundSpeedKt).toBeCloseTo(192, 9);
  });

  it("produces very large speeds for near deadlines", () => {
    const result = runGroundspeedRequiredForEta({
      distanceNm: 100,
      minutesUntilDeadline: 0.5,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.requiredGroundSpeedKt).toBeCloseTo(12000, 6);
  });

  it("rejects zero and negative distances", () => {
    const zero = runGroundspeedRequiredForEta({
      distanceNm: 0,
      minutesUntilDeadline: 30,
    });
    expect(zero.ok).toBe(false);
    if (!zero.ok) expect(zero.error.issues[0]?.code).toBe("invalid_distance");
    expect(
      runGroundspeedRequiredForEta({
        distanceNm: -10,
        minutesUntilDeadline: 30,
      }),
    ).toMatchObject({ ok: false });
  });

  it("rejects zero and negative time remaining", () => {
    const zero = runGroundspeedRequiredForEta({
      distanceNm: 50,
      minutesUntilDeadline: 0,
    });
    expect(zero.ok).toBe(false);
    if (!zero.ok)
      expect(zero.error.issues[0]?.code).toBe("invalid_time_remaining");
    expect(
      runGroundspeedRequiredForEta({
        distanceNm: 50,
        minutesUntilDeadline: -5,
      }),
    ).toMatchObject({ ok: false });
  });

  it("rejects missing inputs", () => {
    expect(runGroundspeedRequiredForEta({ distanceNm: 100 })).toMatchObject({
      ok: false,
    });
    expect(
      runGroundspeedRequiredForEta({ minutesUntilDeadline: 20 }),
    ).toMatchObject({ ok: false });
  });
});
