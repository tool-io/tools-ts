import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, {
  calculateSchleifpapierVerbrauchQmProPlatte,
  example,
} from "./tool.js";

describe("carpentry/schleifpapier-verbrauch-qm-pro-platte", () => {
  it("matches its worked example", () => {
    expect(calculateSchleifpapierVerbrauchQmProPlatte(example.input)).toEqual(
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
      tool.execute({ ...example.input, panelAreaSquareMeters: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative panelAreaSquareMeters", () => {
    expect(
      tool.execute({ ...example.input, panelAreaSquareMeters: -1 }).ok,
    ).toBe(false);
  });
});
