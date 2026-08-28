import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import { calculateToc, tocExample, tocTool } from "./tool.js";

describe("TOC", () => {
  it("reproduces the canonical example", () => {
    expect(calculateToc(tocExample.input)).toEqual({
      ok: true,
      output: tocExample.output,
    });
  });

  it("publishes a valid pure contract", () => {
    expect(validateToolContract(tocTool)).toEqual([]);
  });

  it("rejects inorganic carbon greater than total carbon", () => {
    expect(
      calculateToc({ ...tocExample.input, inorganicCarbonMgPerL: 11 }),
    ).toMatchObject({
      error: { issues: [{ code: "inorganic_carbon_exceeds_total" }] },
      ok: false,
    });
  });
});
