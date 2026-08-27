import { describe, expect, it } from "vitest";
import { hafniumEpsilonExample, runHafniumEpsilon } from "./tool.js";

describe("hafnium-epsilon", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runHafniumEpsilon(hafniumEpsilonExample.input)).toEqual({
      ok: true,
      output: hafniumEpsilonExample.output,
    });
  });

  it("returns zero for a chondritic ratio", () => {
    const result = runHafniumEpsilon({ hf176hf177: 0.282785 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.epsilonHf as number).toBe(0);
  });

  it("rejects non-positive ratios", () => {
    expect(runHafniumEpsilon({ hf176hf177: -0.283 }).ok).toBe(false);
  });
});
