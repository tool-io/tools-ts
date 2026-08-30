import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, {
  calculateSolarCellShortCircuitCurrent,
  example,
} from "./tool.js";

describe("electronics/solar-cell-short-circuit-current", () => {
  it("matches the exact current-density conversion", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateSolarCellShortCircuitCurrent(example.input)).toEqual(
      example.output,
    );
  });
  it("publishes a valid contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("handles zero area and rejects invalid inputs", () => {
    expect(tool.execute({ ...example.input, activeAreaCm2: 0 })).toEqual({
      ok: true,
      output: { shortCircuitCurrentA: 0 },
    });
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, activeAreaCm2: Number.NaN }).ok,
    ).toBe(false);
    expect(tool.execute({ ...example.input, activeAreaCm2: -1 }).ok).toBe(
      false,
    );
  });
});
