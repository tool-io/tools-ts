import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateBatteryCapacityFade, example } from "./tool.js";

describe("electronics/battery-capacity-fade", () => {
  it("matches the example and direct calculation", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateBatteryCapacityFade(example.input)).toEqual(example.output);
  });
  it("publishes a valid contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("handles no fade and rejects invalid capacity", () => {
    expect(tool.execute({ ...example.input, currentCapacityAh: 100 })).toEqual({
      ok: true,
      output: { capacityFadePercent: 0 },
    });
    expect(tool.execute({ ...example.input, currentCapacityAh: 101 }).ok).toBe(
      false,
    );
    expect(tool.execute({ ...example.input, initialCapacityAh: 0 }).ok).toBe(
      false,
    );
    expect(tool.execute({}).ok).toBe(false);
  });
});
