import { describe, expect, it } from "vitest";
import { mineralLusterLookupExample, runMineralLusterLookup } from "./tool.js";

describe("mineral-luster-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runMineralLusterLookup(mineralLusterLookupExample.input)).toEqual({
      ok: true,
      output: mineralLusterLookupExample.output,
    });
  });

  it("classifies quartz as glassy", () => {
    const result = runMineralLusterLookup({ mineral: "quartz" });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.luster as string).toBe("vitreous");
  });
  it("rejects unknown minerals", () => {
    expect(runMineralLusterLookup({ mineral: "unobtainium" }).ok).toBe(false);
  });
});
