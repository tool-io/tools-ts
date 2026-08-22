import { describe, expect, it } from "vitest";
import {
  calculateDescentAngle,
  descentAngleExample,
  runDescentAngle,
} from "./tool.js";

describe("descent angle calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDescentAngle(descentAngleExample.input)).toEqual({
      ok: true,
      output: descentAngleExample.output,
    });
  });

  it("matches the classic three-degree glide path of about 318 feet per nautical mile", () => {
    const angle = calculateDescentAngle({
      altitudeToLoseFt: 318.4,
      distanceNm: 1,
    }).descentAngleDeg;
    expect(angle).toBeCloseTo(3, 2);
  });

  it("rejects zero distance through execution", () => {
    expect(
      runDescentAngle({ altitudeToLoseFt: 1000, distanceNm: 0 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_distance" }] },
      ok: false,
    });
  });
});
