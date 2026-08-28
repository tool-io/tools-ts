import { describe, expect, it } from "vitest";
import { runReducedTemperature } from "./tool.js";
describe("Reduced Temperature Calculator", () => {
  it("450/300 gives Tr=1.5", () => {
    const r = runReducedTemperature({
      criticalTemperatureK: 300,
      temperatureK: 450,
    });
    if (!r.ok) throw new Error("fail");
    expect(r.output.reducedTemperature).toBe(1.5);
  });
  it("rejects invalid input", () =>
    expect(runReducedTemperature(null).ok).toBe(false));
});
