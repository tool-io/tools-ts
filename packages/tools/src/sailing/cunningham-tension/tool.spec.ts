import { describe, expect, it } from "vitest";
import { cunninghamTensionExample, runCunninghamTension } from "./tool.js";

describe("cunningham tension guide", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCunninghamTension(cunninghamTensionExample.input)).toEqual({
      ok: true,
      output: cunninghamTensionExample.output,
    });
  });

  it("clamps to zero below eight knots at the zero boundary", () => {
    expect(runCunninghamTension({ apparentWindKt: 0 })).toEqual({
      ok: true,
      output: { cunninghamPercent: 0 },
    });
  });

  it("returns exactly zero at the eight-knot hinge", () => {
    expect(runCunninghamTension({ apparentWindKt: 8 })).toEqual({
      ok: true,
      output: { cunninghamPercent: 0 },
    });
  });

  it("adds six percent per knot through the working range", () => {
    expect(runCunninghamTension({ apparentWindKt: 9 })).toEqual({
      ok: true,
      output: { cunninghamPercent: 6 },
    });
  });

  it("caps at one hundred percent in heavy air", () => {
    const result = runCunninghamTension({ apparentWindKt: 25 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.cunninghamPercent).toBe(100);
  });

  it("rejects negative wind through validation", () => {
    expect(runCunninghamTension({ apparentWindKt: -1 })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "apparentWindKt" }] },
      ok: false,
    });
  });

  it("rejects missing and malformed inputs", () => {
    expect(runCunninghamTension({}).ok).toBe(false);
    expect(runCunninghamTension({ apparentWindKt: "blowy" }).ok).toBe(false);
    expect(runCunninghamTension(null).ok).toBe(false);
  });
});
