import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateVdmosOnResistance, example } from "./tool.js";

describe("semiconductor/vdmos-on-resistance", () => {
  it("matches its worked example", () => {
    expect(calculateVdmosOnResistance(example.input)).toEqual(example.output);
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
    expect(tool.execute({ ...example.input, sourceOhms: Number.NaN }).ok).toBe(
      false,
    );
  });
  it("rejects a negative sourceOhms", () => {
    expect(tool.execute({ ...example.input, sourceOhms: -1 }).ok).toBe(false);
  });
});
