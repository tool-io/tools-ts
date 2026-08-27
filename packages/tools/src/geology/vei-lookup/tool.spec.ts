import { describe, expect, it } from "vitest";
import { veiLookupExample, runVeiLookup } from "./tool.js";

describe("vei-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runVeiLookup(veiLookupExample.input)).toEqual({
      ok: true,
      output: veiLookupExample.output,
    });
  });

  it("maps the top of the scale to mega-colossal", () => {
    const result = runVeiLookup({ vei: 8 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.classification).toBe("mega-colossal");
    expect(result.output.minimumBulkVolumeCubicMeters).toBe(1e12);
  });
  it("maps VEI zero to the non-explosive class", () => {
    expect(runVeiLookup({ vei: 0 })).toEqual({
      ok: true,
      output: {
        classification: "non-explosive",
        minimumBulkVolumeCubicMeters: 0,
      },
    });
  });
  it("rejects out-of-range indices", () => {
    expect(runVeiLookup({ vei: 9 }).ok).toBe(false);
  });
});
