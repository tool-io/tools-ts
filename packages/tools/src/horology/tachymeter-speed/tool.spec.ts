import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateTachymeterSpeed, example } from "./tool.js";

describe("horology/tachymeter-speed", () => {
  it("matches its worked example", () => {
    expect(calculateTachymeterSpeed(example.input)).toEqual(example.output);
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("reads 120 km/h for one kilometre in thirty seconds", () => {
    expect(tool.execute({ distanceKilometers: 1, elapsedSeconds: 30 })).toEqual(
      { ok: true, output: { kilometersPerHour: 120 } },
    );
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and nonfinite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, distanceKilometers: Number.NaN }).ok,
    ).toBe(false);
  });
});
