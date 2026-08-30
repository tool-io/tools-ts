import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateHeadphoneSensitivityDb, example } from "./tool.js";

describe("electronics/headphone-sensitivity-db", () => {
  it("matches its worked example", () => {
    expect(calculateHeadphoneSensitivityDb(example.input)).toEqual(
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
      tool.execute({
        ...example.input,
        sensitivityDbSplPerMilliwatt: Number.NaN,
      }).ok,
    ).toBe(false);
  });
  it("rejects a negative nominalImpedanceOhms", () => {
    expect(
      tool.execute({ ...example.input, nominalImpedanceOhms: -1 }).ok,
    ).toBe(false);
  });
});
