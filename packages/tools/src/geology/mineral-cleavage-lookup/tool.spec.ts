import { describe, expect, it } from "vitest";
import {
  mineralCleavageLookupExample,
  runMineralCleavageLookup,
} from "./tool.js";

describe("mineral-cleavage-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runMineralCleavageLookup(mineralCleavageLookupExample.input),
    ).toEqual({
      ok: true,
      output: mineralCleavageLookupExample.output,
    });
  });

  it("gives mica its single perfect basal direction", () => {
    const result = runMineralCleavageLookup({ mineral: "muscovite" });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.cleavageDirections as number).toBe(1);
  });
  it("rejects unknown minerals", () => {
    expect(runMineralCleavageLookup({ mineral: "kryptonite" }).ok).toBe(false);
  });
});
