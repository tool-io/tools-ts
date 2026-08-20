import { describe, expect, it } from "vitest";
import { bandgapLookupExample, runBandgapLookup } from "./tool.js";

describe("semiconductor bandgap lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runBandgapLookup(bandgapLookupExample.input)).toEqual({
      ok: true,
      output: bandgapLookupExample.output,
    });
  });

  it("looks up wide- and narrow-gap materials", () => {
    expect(runBandgapLookup({ material: "diamond" })).toEqual({
      ok: true,
      output: { bandgapEv: 5.47 },
    });
    expect(runBandgapLookup({ material: "ge" })).toEqual({
      ok: true,
      output: { bandgapEv: 0.66 },
    });
  });

  it("rejects unknown materials through execution", () => {
    expect(runBandgapLookup({ material: "unobtainium" as never }).ok).toBe(
      false,
    );
  });
});
