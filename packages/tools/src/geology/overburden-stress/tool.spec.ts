import { describe, expect, it } from "vitest";
import { overburdenStressExample, runOverburdenStress } from "./tool.js";

describe("overburden-stress", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runOverburdenStress(overburdenStressExample.input)).toEqual({
      ok: true,
      output: overburdenStressExample.output,
    });
  });

  it("gives zero stress at the surface", () => {
    const result = runOverburdenStress({ depthM: 0, unitWeightKnPerM3: 22 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.verticalStressKpa as number).toBe(0);
  });
  it("rejects negative depths", () => {
    expect(runOverburdenStress({ depthM: -10, unitWeightKnPerM3: 22 }).ok).toBe(
      false,
    );
  });
});
