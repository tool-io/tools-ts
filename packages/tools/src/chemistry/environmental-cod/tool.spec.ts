import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import { calculateCod, codExample, codTool } from "./tool.js";

describe("COD", () => {
  it("reproduces the canonical example", () => {
    expect(calculateCod(codExample.input)).toEqual({
      ok: true,
      output: codExample.output,
    });
  });

  it("publishes a valid pure contract", () => {
    expect(validateToolContract(codTool)).toEqual([]);
  });

  it("rejects a sample volume greater than the blank", () => {
    expect(
      calculateCod({ ...codExample.input, sampleTitrantVolumeMl: 11 }),
    ).toMatchObject({
      error: { issues: [{ code: "sample_titrant_exceeds_blank" }] },
      ok: false,
    });
  });
});
