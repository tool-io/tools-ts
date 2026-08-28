import { describe, expect, it } from "vitest";
import { runCalorimetryHeatExchange } from "./tool.js";

describe("Calorimetry Heat Exchange Calculator", () => {
  it("transfers the full positive magnitude to the cold body", () => {
    const result = runCalorimetryHeatExchange({ heatLostJ: 250 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.heatGainedJ).toBe(250);
  });

  it("conserves heat for a zero exchange", () => {
    const result = runCalorimetryHeatExchange({ heatLostJ: 0 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.heatGainedJ).toBe(0);
  });

  it("rejects invalid input", () =>
    expect(runCalorimetryHeatExchange(null).ok).toBe(false));
});
