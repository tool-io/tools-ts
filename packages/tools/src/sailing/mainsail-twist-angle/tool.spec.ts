import { describe, expect, it } from "vitest";
import { mainsailTwistAngleExample, runMainsailTwistAngle } from "./tool.js";

describe("mainsail twist guide", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runMainsailTwistAngle(mainsailTwistAngleExample.input)).toEqual({
      ok: true,
      output: mainsailTwistAngleExample.output,
    });
  });

  it("clamps to forty-five degrees in light air at the zero boundary", () => {
    expect(runMainsailTwistAngle({ apparentWindKt: 0 })).toEqual({
      ok: true,
      output: { twistDegrees: 45 },
    });
  });

  it("returns exactly the cap at the fifteen-knot hinge", () => {
    expect(runMainsailTwistAngle({ apparentWindKt: 15 })).toEqual({
      ok: true,
      output: { twistDegrees: 45 },
    });
  });

  it("clamps to five degrees at the fifty-five-knot hinge and beyond", () => {
    expect(runMainsailTwistAngle({ apparentWindKt: 55 })).toEqual({
      ok: true,
      output: { twistDegrees: 5 },
    });
    expect(runMainsailTwistAngle({ apparentWindKt: 60 })).toEqual({
      ok: true,
      output: { twistDegrees: 5 },
    });
  });

  it("decreases twist as wind builds across the working range", () => {
    const light = runMainsailTwistAngle({ apparentWindKt: 20 });
    const heavy = runMainsailTwistAngle({ apparentWindKt: 40 });
    if (!light.ok || !heavy.ok) throw new Error("expected success");
    expect(light.output.twistDegrees).toBe(40);
    expect(heavy.output.twistDegrees).toBe(20);
  });

  it("rejects winds outside zero to sixty through validation", () => {
    for (const apparentWindKt of [-1, 60.5])
      expect(runMainsailTwistAngle({ apparentWindKt })).toMatchObject({
        error: { issues: [{ code: "invalid_field", field: "apparentWindKt" }] },
        ok: false,
      });
  });

  it("rejects missing and malformed inputs", () => {
    expect(runMainsailTwistAngle({}).ok).toBe(false);
    expect(runMainsailTwistAngle({ apparentWindKt: Number.NaN }).ok).toBe(
      false,
    );
    expect(runMainsailTwistAngle(undefined)).toMatchObject({
      error: { issues: [{ code: "object_required", field: "" }] },
      ok: false,
    });
  });
});
