import { describe, expect, it } from "vitest";
import { gennakerTackLoadExample, runGennakerTackLoad } from "./tool.js";

describe("Gennaker Tack Load", () => {
  it("calculates the canonical example", () =>
    expect(runGennakerTackLoad(gennakerTackLoadExample.input)).toEqual({
      ok: true,
      output: gennakerTackLoadExample.output,
    }));
  it("quadruples load when wind speed doubles", () => {
    const slow = runGennakerTackLoad({ sailAreaM2: 100, windSpeedMs: 4 });
    if (!slow.ok) throw new Error("Expected success.");
    expect(slow.output.tackLoadNewtons).toBe(96);
    expect(gennakerTackLoadExample.output.tackLoadNewtons).toBe(
      Number(slow.output.tackLoadNewtons) * 4,
    );
  });
  it("scales linearly with sail area", () => {
    const small = runGennakerTackLoad({ sailAreaM2: 25, windSpeedMs: 8 });
    if (!small.ok) throw new Error("Expected success.");
    expect(small.output.tackLoadNewtons).toBe(96);
  });
  it("returns zero load in zero wind", () => {
    const result = runGennakerTackLoad({ sailAreaM2: 100, windSpeedMs: 0 });
    expect(result).toEqual({ ok: true, output: { tackLoadNewtons: 0 } });
  });
  it("rejects negative wind speed", () =>
    expect(runGennakerTackLoad({ sailAreaM2: 100, windSpeedMs: -2 }).ok).toBe(
      false,
    ));
  it("returns zero load for zero sail area", () => {
    const result = runGennakerTackLoad({ sailAreaM2: 0, windSpeedMs: 8 });
    expect(result).toEqual({ ok: true, output: { tackLoadNewtons: 0 } });
  });
  it("rejects missing and malformed input", () => {
    expect(runGennakerTackLoad({}).ok).toBe(false);
    expect(runGennakerTackLoad({ sailAreaM2: "100", windSpeedMs: 8 }).ok).toBe(
      false,
    );
    expect(runGennakerTackLoad(null).ok).toBe(false);
  });
  it("rejects unknown fields", () =>
    expect(
      runGennakerTackLoad({
        sailAreaM2: 100,
        windSpeedMs: 8,
        coefficient: 0.06,
      }).ok,
    ).toBe(false));
});
