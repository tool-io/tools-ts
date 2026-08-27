import { describe, expect, it } from "vitest";
import { mohsHardnessLookupExample, runMohsHardnessLookup } from "./tool.js";

describe("mohs-hardness-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runMohsHardnessLookup(mohsHardnessLookupExample.input)).toEqual({
      ok: true,
      output: mohsHardnessLookupExample.output,
    });
  });

  it("places diamond at the top of the scale", () => {
    const result = runMohsHardnessLookup({ mineral: "diamond" });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.mohsHardness as number).toBe(10);
  });
  it("rejects unknown minerals", () => {
    expect(runMohsHardnessLookup({ mineral: "kryptonite" }).ok).toBe(false);
  });
});
