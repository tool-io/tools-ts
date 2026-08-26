import { describe, expect, it } from "vitest";
import { outhaulTensionExample, runOuthaulTension } from "./tool.js";

describe("outhaul tension guide", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runOuthaulTension(outhaulTensionExample.input)).toEqual({
      ok: true,
      output: outhaulTensionExample.output,
    });
  });

  it("keeps low tension at the zero-wind boundary", () => {
    expect(runOuthaulTension({ apparentWindKt: 0 })).toEqual({
      ok: true,
      output: { outhaulPercent: 20 },
    });
  });

  it("returns full tension at the twenty-knot hinge", () => {
    expect(runOuthaulTension({ apparentWindKt: 20 })).toEqual({
      ok: true,
      output: { outhaulPercent: 100 },
    });
  });

  it("clamps to full tension in heavy air", () => {
    expect(runOuthaulTension({ apparentWindKt: 25 })).toEqual({
      ok: true,
      output: { outhaulPercent: 100 },
    });
  });

  it("adds four percentage points per knot through the working range", () => {
    expect(runOuthaulTension({ apparentWindKt: 2.5 })).toEqual({
      ok: true,
      output: { outhaulPercent: 30 },
    });
  });

  it("rejects negative wind through validation", () => {
    expect(runOuthaulTension({ apparentWindKt: -2 })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "apparentWindKt" }] },
      ok: false,
    });
  });

  it("rejects missing and malformed inputs", () => {
    expect(runOuthaulTension({}).ok).toBe(false);
    expect(runOuthaulTension({ apparentWindKt: Number.NaN }).ok).toBe(false);
    expect(runOuthaulTension(undefined)).toMatchObject({
      error: { issues: [{ code: "object_required", field: "" }] },
      ok: false,
    });
  });
});
