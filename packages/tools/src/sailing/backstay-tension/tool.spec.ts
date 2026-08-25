import { describe, expect, it } from "vitest";
import { backstayTensionExample, runBackstayTension } from "./tool.js";

describe("backstay tension guide", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runBackstayTension(backstayTensionExample.input)).toEqual({
      ok: true,
      output: backstayTensionExample.output,
    });
  });

  it("clamps to ten percent at the zero-wind boundary", () => {
    expect(runBackstayTension({ apparentWindKt: 0 })).toEqual({
      ok: true,
      output: { backstayPercent: 10 },
    });
  });

  it("adds four percent per knot through the working range", () => {
    expect(runBackstayTension({ apparentWindKt: 2.5 })).toEqual({
      ok: true,
      output: { backstayPercent: 10 },
    });
    const result = runBackstayTension({ apparentWindKt: 20 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.backstayPercent).toBe(80);
  });

  it("reaches exactly one hundred percent at twenty-five knots", () => {
    expect(runBackstayTension({ apparentWindKt: 25 })).toEqual({
      ok: true,
      output: { backstayPercent: 100 },
    });
  });

  it("clamps beyond one hundred percent in heavier air", () => {
    const result = runBackstayTension({ apparentWindKt: 30 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.backstayPercent).toBe(100);
  });

  it("rejects negative wind through validation", () => {
    for (const apparentWindKt of [-0.1, -10])
      expect(runBackstayTension({ apparentWindKt })).toMatchObject({
        error: { issues: [{ code: "invalid_field", field: "apparentWindKt" }] },
        ok: false,
      });
  });

  it("rejects missing and malformed inputs", () => {
    expect(runBackstayTension({}).ok).toBe(false);
    expect(runBackstayTension({ apparentWindKt: "hard" }).ok).toBe(false);
    expect(runBackstayTension(null).ok).toBe(false);
  });
});
