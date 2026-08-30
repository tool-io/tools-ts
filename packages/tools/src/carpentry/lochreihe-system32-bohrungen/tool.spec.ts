import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateLochreiheSystem32Bohrungen, example } from "./tool.js";

describe("carpentry/lochreihe-system32-bohrungen", () => {
  it("matches its worked example", () => {
    expect(calculateLochreiheSystem32Bohrungen(example.input)).toEqual(
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
      tool.execute({ ...example.input, firstCenterMillimeters: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative firstCenterMillimeters", () => {
    expect(
      tool.execute({ ...example.input, firstCenterMillimeters: -1 }).ok,
    ).toBe(false);
  });
});
