import { describe, expect, it } from "vitest";
import { mineralStreakLookupExample, runMineralStreakLookup } from "./tool.js";

describe("mineral-streak-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runMineralStreakLookup(mineralStreakLookupExample.input)).toEqual({
      ok: true,
      output: mineralStreakLookupExample.output,
    });
  });

  it("gives pyrite its diagnostic greenish-black powder", () => {
    const result = runMineralStreakLookup({ mineral: "pyrite" });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.streakColor as string).toBe("greenish black");
  });
  it("rejects unknown minerals", () => {
    expect(runMineralStreakLookup({ mineral: "kryptonite" }).ok).toBe(false);
  });
});
