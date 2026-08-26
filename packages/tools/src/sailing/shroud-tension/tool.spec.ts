import { describe, expect, it } from "vitest";
import { runShroudTension, shroudTensionExample } from "./tool.js";

describe("shroud tension calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runShroudTension(shroudTensionExample.input)).toEqual({
      ok: true,
      output: shroudTensionExample.output,
    });
  });

  it("returns equal tension for symmetric angles", () => {
    expect(
      runShroudTension({
        forestayAngleDeg: 45,
        forestayTensionNewtons: 2500,
        shroudAngleDeg: 45,
      }),
    ).toEqual({ ok: true, output: { shroudTensionNewtons: 2500 } });
  });

  it("matches the node-verified thirty-ninety case", () => {
    expect(
      runShroudTension({
        forestayAngleDeg: 30,
        forestayTensionNewtons: 200,
        shroudAngleDeg: 90,
      }),
    ).toEqual({
      ok: true,
      output: { shroudTensionNewtons: 99.99999999999999 },
    });
  });

  it("matches the node-verified forty-eighty case", () => {
    expect(
      runShroudTension({
        forestayAngleDeg: 40,
        forestayTensionNewtons: 3000,
        shroudAngleDeg: 80,
      }),
    ).toEqual({
      ok: true,
      output: { shroudTensionNewtons: 1958.1109339984177 },
    });
  });

  it("accepts the five degree lower bound", () => {
    const result = runShroudTension({
      forestayAngleDeg: 175,
      forestayTensionNewtons: 1000,
      shroudAngleDeg: 5,
    });
    expect(result.ok).toBe(true);
  });

  it("rejects angles below five degrees", () => {
    const result = runShroudTension({
      forestayAngleDeg: 4.9,
      forestayTensionNewtons: 1000,
      shroudAngleDeg: 30,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects angles above one hundred seventy-five degrees", () => {
    expect(
      runShroudTension({
        forestayAngleDeg: 60,
        forestayTensionNewtons: 1000,
        shroudAngleDeg: 176,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-positive forestay tension with the stable code", () => {
    const result = runShroudTension({
      forestayAngleDeg: 60,
      forestayTensionNewtons: 0,
      shroudAngleDeg: 60,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_tension");
  });

  it("requires all three inputs", () => {
    expect(
      runShroudTension({
        forestayTensionNewtons: 5000,
        shroudAngleDeg: 60,
      }).ok,
    ).toBe(false);
  });

  it("computes a realistic cruiser rig", () => {
    expect(
      runShroudTension({
        forestayAngleDeg: 12,
        forestayTensionNewtons: 4000,
        shroudAngleDeg: 11,
      }),
    ).toEqual({
      ok: true,
      output: { shroudTensionNewtons: 4358.530171126657 },
    });
  });
});
