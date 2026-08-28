import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import { bodExample, bodTool, calculateBod } from "./tool.js";

describe("BOD", () => {
  it("reproduces the canonical example", () => {
    expect(calculateBod(bodExample.input)).toEqual({
      ok: true,
      output: bodExample.output,
    });
  });

  it("publishes a valid pure contract", () => {
    expect(validateToolContract(bodTool)).toEqual([]);
  });

  it("rejects oxygen gain during incubation", () => {
    expect(
      calculateBod({
        ...bodExample.input,
        finalDissolvedOxygenMgPerL: 9,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "final_oxygen_exceeds_initial" }] },
      ok: false,
    });
  });
});
