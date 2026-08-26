import { describe, expect, it } from "vitest";
import {
  calculateManeuverTimeLoss,
  maneuverTimeLossExample,
  runManeuverTimeLoss,
} from "./tool.js";

describe("Maneuver Time Loss", () => {
  it("publishes an executable example", () =>
    expect(runManeuverTimeLoss(maneuverTimeLossExample.input)).toEqual({
      ok: true,
      output: maneuverTimeLossExample.output,
    }));

  it("applies the default five seconds per maneuver", () =>
    expect(runManeuverTimeLoss({ boatSpeedKt: 6, maneuverCount: 8 })).toEqual({
      ok: true,
      output: { timeLossSeconds: 40, distanceLostNm: 0.06666666666666667 },
    }));

  it("honours an explicit seconds per maneuver", () =>
    expect(
      runManeuverTimeLoss({
        boatSpeedKt: 5,
        maneuverCount: 4,
        secondsPerManeuver: 12,
      }),
    ).toEqual({
      ok: true,
      output: { timeLossSeconds: 48, distanceLostNm: (48 * 5) / 3600 },
    }));

  it("loses no distance when each maneuver costs nothing", () =>
    expect(
      runManeuverTimeLoss({
        boatSpeedKt: 7,
        maneuverCount: 10,
        secondsPerManeuver: 0,
      }),
    ).toEqual({
      ok: true,
      output: { timeLossSeconds: 0, distanceLostNm: 0 },
    }));

  it("scales the distance loss linearly with boat speed", () => {
    const slow = calculateManeuverTimeLoss({
      boatSpeedKt: 3,
      maneuverCount: 2,
    });
    const fast = calculateManeuverTimeLoss({
      boatSpeedKt: 9,
      maneuverCount: 2,
    });
    expect(fast.distanceLostNm).toBe(slow.distanceLostNm * 3);
    expect(fast.timeLossSeconds).toBe(slow.timeLossSeconds);
  });

  it("rejects zero or negative maneuver counts", () => {
    for (const maneuverCount of [0, -3])
      expect(runManeuverTimeLoss({ boatSpeedKt: 6, maneuverCount }).ok).toBe(
        false,
      );
  });

  it("rejects fractional maneuver counts", () =>
    expect(runManeuverTimeLoss({ boatSpeedKt: 6, maneuverCount: 2.5 }).ok).toBe(
      false,
    ));

  it("rejects non-positive boat speeds with invalid_speed", () => {
    const result = runManeuverTimeLoss({ boatSpeedKt: 0, maneuverCount: 3 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_speed");
  });

  it("rejects seconds per maneuver outside zero to thirty", () => {
    for (const secondsPerManeuver of [-1, 31])
      expect(
        runManeuverTimeLoss({
          boatSpeedKt: 6,
          maneuverCount: 3,
          secondsPerManeuver,
        }).ok,
      ).toBe(false);
  });

  it("rejects non-finite and malformed input", () => {
    expect(
      runManeuverTimeLoss({ boatSpeedKt: Number.NaN, maneuverCount: 2 }).ok,
    ).toBe(false);
    expect(runManeuverTimeLoss({ boatSpeedKt: 6 }).ok).toBe(false);
  });
});
