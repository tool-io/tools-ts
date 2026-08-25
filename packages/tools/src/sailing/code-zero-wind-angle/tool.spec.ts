import { describe, expect, it } from "vitest";
import { codeZeroWindAngleExample, runCodeZeroWindAngle } from "./tool.js";

describe("Code Zero Wind Angle", () => {
  it("calculates the canonical example", () =>
    expect(runCodeZeroWindAngle(codeZeroWindAngleExample.input)).toEqual({
      ok: true,
      output: codeZeroWindAngleExample.output,
    }));
  it("returns the base angle in calm air", () =>
    expect(runCodeZeroWindAngle({ apparentWindKt: 0 })).toEqual({
      ok: true,
      output: { codeZeroTwaDeg: 50 },
    }));
  it("clamps to 70 degrees in heavy air", () =>
    expect(runCodeZeroWindAngle({ apparentWindKt: 100 })).toEqual({
      ok: true,
      output: { codeZeroTwaDeg: 70 },
    }));
  it("rounds to the nearest degree", () =>
    expect(runCodeZeroWindAngle({ apparentWindKt: 5 })).toEqual({
      ok: true,
      output: { codeZeroTwaDeg: 52 },
    }));
  it("increases monotonically below the clamp", () => {
    const low = runCodeZeroWindAngle({ apparentWindKt: 10 });
    const high = runCodeZeroWindAngle({ apparentWindKt: 20 });
    if (!low.ok || !high.ok) throw new Error("Expected success.");
    expect(low.output.codeZeroTwaDeg).toBeLessThan(
      Number(high.output.codeZeroTwaDeg),
    );
  });
  it("rejects negative apparent wind", () =>
    expect(runCodeZeroWindAngle({ apparentWindKt: -1 }).ok).toBe(false));
  it("rejects missing and malformed wind", () => {
    expect(runCodeZeroWindAngle({}).ok).toBe(false);
    expect(runCodeZeroWindAngle({ apparentWindKt: "10" }).ok).toBe(false);
    expect(runCodeZeroWindAngle(null).ok).toBe(false);
  });
  it("rejects unknown fields", () =>
    expect(runCodeZeroWindAngle({ apparentWindKt: 10, twaDeg: 53 }).ok).toBe(
      false,
    ));
});
