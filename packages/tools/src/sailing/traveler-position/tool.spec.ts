import { describe, expect, it } from "vitest";
import { runTravelerPosition, travelerPositionExample } from "./tool.js";

describe("traveler position guide", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runTravelerPosition(travelerPositionExample.input)).toEqual({
      ok: true,
      output: travelerPositionExample.output,
    });
  });

  it("clamps to thirty centimeters to weather at the zero boundary", () => {
    expect(runTravelerPosition({ apparentWindKt: 0 })).toEqual({
      ok: true,
      output: { travelerOffsetCm: 30 },
    });
  });

  it("returns zero at the fifteen-knot balance point", () => {
    expect(runTravelerPosition({ apparentWindKt: 15 })).toEqual({
      ok: true,
      output: { travelerOffsetCm: 0 },
    });
  });

  it("clamps to thirty centimeters to leeward in heavy air", () => {
    expect(runTravelerPosition({ apparentWindKt: 40 })).toEqual({
      ok: true,
      output: { travelerOffsetCm: -30 },
    });
  });

  it("rounds fractional offsets upward", () => {
    expect(runTravelerPosition({ apparentWindKt: 14.75 })).toEqual({
      ok: true,
      output: { travelerOffsetCm: 1 },
    });
  });

  it("moves to leeward above fifteen knots", () => {
    const result = runTravelerPosition({ apparentWindKt: 22.5 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.travelerOffsetCm).toBe(-15);
  });

  it("rejects winds outside zero to forty through validation", () => {
    for (const apparentWindKt of [-0.5, 40.5])
      expect(runTravelerPosition({ apparentWindKt })).toMatchObject({
        error: { issues: [{ code: "invalid_field", field: "apparentWindKt" }] },
        ok: false,
      });
  });

  it("rejects missing and malformed inputs", () => {
    expect(runTravelerPosition({}).ok).toBe(false);
    expect(runTravelerPosition({ apparentWindKt: "windy" }).ok).toBe(false);
    expect(runTravelerPosition(null).ok).toBe(false);
  });
});
