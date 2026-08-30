import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, {
  calculateFlooringMoistureBarrierCoverage,
  example,
} from "./tool.js";

describe("construction/flooring-moisture-barrier-coverage", () => {
  it("matches its worked example", () => {
    expect(calculateFlooringMoistureBarrierCoverage(example.input)).toEqual(
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
      tool.execute({ ...example.input, floorSquareMeters: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative floorSquareMeters", () => {
    expect(tool.execute({ ...example.input, floorSquareMeters: -1 }).ok).toBe(
      false,
    );
  });
});
