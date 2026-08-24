import { describe, expect, it } from "vitest";
import {
  outputResistanceCascodeExample,
  runOutputResistanceCascode,
} from "./tool.js";

describe("Cascode Output Resistance Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runOutputResistanceCascode(outputResistanceCascodeExample.input),
    ).toEqual({
      ok: true,
      output: outputResistanceCascodeExample.output,
    });
  });

  it("includes both intrinsic resistances and the gm ro squared term", () => {
    expect(
      runOutputResistanceCascode({
        roOhms: 500,
        transconductanceSiemens: 0.02,
      }),
    ).toEqual({ ok: true, output: { cascodeResistanceOhms: 6000 } });
  });

  it("approaches two intrinsic resistances as transconductance approaches zero", () => {
    const result = runOutputResistanceCascode({
      roOhms: 1000,
      transconductanceSiemens: Number.MIN_VALUE,
    });
    expect(result).toEqual({
      ok: true,
      output: { cascodeResistanceOhms: 2000 },
    });
  });

  it("rejects non-positive resistance and transconductance", () => {
    expect(
      runOutputResistanceCascode({ roOhms: 0, transconductanceSiemens: 0.01 })
        .ok,
    ).toBe(false);
    expect(
      runOutputResistanceCascode({ roOhms: 1000, transconductanceSiemens: 0 })
        .ok,
    ).toBe(false);
  });
});
