import { describe, expect, it } from "vitest";
import { apparentWindAngleExample, runApparentWindAngle } from "./tool.js";

describe("apparent wind angle calculator", () => {
  it("reproduces its canonical example exactly", () => {
    const r = runApparentWindAngle(apparentWindAngleExample.input);
    if (!r.ok) throw new Error("expected success");
    expect(r.output.apparentWindAngleDeg).toBeCloseTo(
      apparentWindAngleExample.output.apparentWindAngleDeg,
      6,
    );
  });
});
