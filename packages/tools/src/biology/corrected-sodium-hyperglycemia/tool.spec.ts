import { describe, expect, it } from "vitest";
import { correctedSodiumExample, runCorrectedSodium } from "./tool.js";

describe("Corrected Sodium", () => {
  it("matches the canonical example", () => {
    expect(runCorrectedSodium(correctedSodiumExample.input)).toEqual({
      ok: true,
      output: correctedSodiumExample.output,
    });
  });

  it("adds eight mmol/L at a glucose of six hundred", () => {
    expect(
      runCorrectedSodium({ measuredNaMmolL: 135, glucoseMgDl: 600 }),
    ).toEqual({ ok: true, output: { correctedSodiumMmolL: 143 } });
  });

  it("leaves sodium unchanged when glucose is at or below one hundred", () => {
    expect(
      runCorrectedSodium({ measuredNaMmolL: 141, glucoseMgDl: 100 }),
    ).toEqual({ ok: true, output: { correctedSodiumMmolL: 141 } });
    expect(
      runCorrectedSodium({ measuredNaMmolL: 138, glucoseMgDl: 85 }),
    ).toEqual({ ok: true, output: { correctedSodiumMmolL: 138 } });
  });

  it("treats zero glucose as no correction", () => {
    expect(
      runCorrectedSodium({ measuredNaMmolL: 139, glucoseMgDl: 0 }),
    ).toEqual({ ok: true, output: { correctedSodiumMmolL: 139 } });
  });

  it("corrects fractional glucose elevations exactly", () => {
    expect(
      runCorrectedSodium({ measuredNaMmolL: 137, glucoseMgDl: 250 }),
    ).toEqual({ ok: true, output: { correctedSodiumMmolL: 139.4 } });
  });

  it("rejects negative glucose through the schema", () => {
    const result = runCorrectedSodium({
      measuredNaMmolL: 140,
      glucoseMgDl: -5,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_field",
        field: "glucoseMgDl",
      });
  });

  it("rejects non finite sodium through the schema", () => {
    const result = runCorrectedSodium({
      measuredNaMmolL: Number.NaN,
      glucoseMgDl: 100,
    });
    expect(result.ok).toBe(false);
  });

  it("rejects non object input and missing required fields", () => {
    expect(runCorrectedSodium(7).ok).toBe(false);
    expect(runCorrectedSodium({ measuredNaMmolL: 140 }).ok).toBe(false);
  });
});
