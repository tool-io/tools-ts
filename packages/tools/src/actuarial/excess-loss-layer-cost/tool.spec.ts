import { describe, expect, it } from "vitest";
import { excessLossLayerCostExample, runExcessLossLayerCost } from "./tool.js";

describe("excess loss layer cost calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runExcessLossLayerCost(excessLossLayerCostExample.input)).toEqual({
      ok: true,
      output: excessLossLayerCostExample.output,
    });
  });

  it("pays nothing when losses stay inside the retention", () => {
    const inside = runExcessLossLayerCost({
      attachmentPoint: 500000,
      layerLimit: 500000,
      totalLosses: 400000,
    });
    expect(inside).toEqual({ ok: true, output: { excessLayerCost: 0 } });
  });

  it("caps the payment at the layer limit", () => {
    const piercing = runExcessLossLayerCost({
      attachmentPoint: 500000,
      layerLimit: 500000,
      totalLosses: 900000,
    });
    expect(piercing).toEqual({ ok: true, output: { excessLayerCost: 400000 } });
  });

  it("rejects malformed and negative inputs with field-specific issues", () => {
    expect(runExcessLossLayerCost(null)).toMatchObject({
      error: { issues: [{ code: "object_required" }] },
      ok: false,
    });
    expect(
      runExcessLossLayerCost({
        ...excessLossLayerCostExample.input,
        unexpectedField: 1,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpectedField" }] },
      ok: false,
    });
    expect(
      runExcessLossLayerCost({
        attachmentPoint: -1,
        layerLimit: 100,
        totalLosses: 50,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "attachmentPoint" }],
      },
      ok: false,
    });
  });
});
