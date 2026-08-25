import { describe, expect, it } from "vitest";
import { apparentWindSpeedExample, runApparentWindSpeed } from "./tool.js";

describe("apparent wind speed calculator", () => {
  it("reproduces its canonical example exactly", () => {
    const r = runApparentWindSpeed(apparentWindSpeedExample.input);
    if (!r.ok) throw new Error("expected success");
    expect(r.output.apparentWindKt).toBeCloseTo(19.704801968, 6);
  });

  it("equals boat speed when true wind is zero", () => {
    const r = runApparentWindSpeed({
      boatSpeedKt: 8,
      trueWindAngleDeg: 0,
      trueWindSpeedKt: 0,
    });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.apparentWindKt).toBeCloseTo(8, 9);
  });
});
