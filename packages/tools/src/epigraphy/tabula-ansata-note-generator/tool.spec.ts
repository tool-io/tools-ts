import { describe, expect, it } from "vitest";
import {
  runTabulaAnsataNoteGenerator,
  tabulaAnsataNoteGeneratorExample,
} from "./tool.js";

describe("tabula-ansata-note-generator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runTabulaAnsataNoteGenerator(tabulaAnsataNoteGeneratorExample.input),
    ).toEqual({
      ok: true,
      output: tabulaAnsataNoteGeneratorExample.output,
    });
  });

  it("reports no taper for a rectangular panel", () => {
    const result = runTabulaAnsataNoteGenerator({
      topEdgeCm: 30,
      bottomEdgeCm: 30,
      heightCm: 10,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.insetPerSideCm as number).toBe(0);
    expect(result.output.areaCm2 as number).toBe(300);
    expect(result.output.note as string).toBe(
      "Tabula ansata panel: parallel edges of 30 cm and 30 cm over a height of 10 cm; each side tapers 0 cm inward.",
    );
  });

  it("rejects a zero height", () => {
    expect(
      runTabulaAnsataNoteGenerator({
        topEdgeCm: 40,
        bottomEdgeCm: 30,
        heightCm: 0,
      }).ok,
    ).toBe(false);
    expect(
      runTabulaAnsataNoteGenerator({
        topEdgeCm: 20,
        bottomEdgeCm: 30,
        heightCm: 5,
      }).ok,
    ).toBe(false);
  });
});
