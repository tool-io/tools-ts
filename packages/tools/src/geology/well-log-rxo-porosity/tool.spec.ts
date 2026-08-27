import { describe, expect, it } from "vitest";
import { runWellLogRxoPorosity, wellLogRxoPorosityExample } from "./tool.js";

describe("well-log-rxo-porosity", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runWellLogRxoPorosity(wellLogRxoPorosityExample.input)).toEqual({
      ok: true,
      output: wellLogRxoPorosityExample.output,
    });
  });

  it("lowers porosity when Sxo is below one", () => {
    const result = runWellLogRxoPorosity({
      flushedZoneResistivityOhmM: 10,
      mudFiltrateResistivityOhmM: 0.4,
      flushedZoneWaterSaturation: 0.5,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.flushedZonePorosity as number).toBeCloseTo(
      ((1 * 0.4) / (10 * 0.5 ** 2)) ** (1 / 2),
      12,
    );
  });

  it("rejects non-positive mud filtrate resistivity", () => {
    expect(
      runWellLogRxoPorosity({
        flushedZoneResistivityOhmM: 10,
        mudFiltrateResistivityOhmM: 0,
      }).ok,
    ).toBe(false);
  });
});
