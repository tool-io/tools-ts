import { describe, expect, it } from "vitest";
import {
  runTrueWindSpeedFromApparent,
  trueWindSpeedFromApparentExample,
} from "./tool.js";

describe("true wind speed from apparent calculator", () => {
  it("reproduces its canonical example exactly", () => {
    const r = runTrueWindSpeedFromApparent(
      trueWindSpeedFromApparentExample.input,
    );
    if (!r.ok) throw new Error("expected success");
    expect(r.output).toEqual(trueWindSpeedFromApparentExample.output);
  });

  it("subtracts boat speed from apparent wind directly ahead", () => {
    expect(
      runTrueWindSpeedFromApparent({
        apparentWindAngleDeg: 0,
        apparentWindKt: 16,
        boatSpeedKt: 6,
      }),
    ).toEqual({ ok: true, output: { trueWindSpeedKt: 10 } });
  });

  it("rejects an apparent wind angle outside zero to 180 degrees", () => {
    expect(
      runTrueWindSpeedFromApparent({
        apparentWindAngleDeg: 181,
        apparentWindKt: 16,
        boatSpeedKt: 6,
      }).ok,
    ).toBe(false);
  });
});
