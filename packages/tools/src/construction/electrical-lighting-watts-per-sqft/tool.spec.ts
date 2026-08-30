import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, {
  calculateElectricalLightingWattsPerSqft,
  example,
} from "./tool.js";

describe("construction/electrical-lighting-watts-per-sqft", () => {
  it("matches its worked example", () => {
    expect(calculateElectricalLightingWattsPerSqft(example.input)).toEqual(
      example.output,
    );
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and nonfinite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, fixtureWatts: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative fixtureWatts", () => {
    expect(tool.execute({ ...example.input, fixtureWatts: -1 }).ok).toBe(false);
  });
});
