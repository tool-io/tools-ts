import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateContactProcessConversion,
  contactProcessConversionExample,
  contactProcessConversionTool,
} from "./tool.js";

describe("Contact process conversion", () => {
  it("reproduces the canonical example", () => {
    expect(
      calculateContactProcessConversion(contactProcessConversionExample.input),
    ).toEqual({
      ok: true,
      output: contactProcessConversionExample.output,
    });
  });

  it("publishes a valid pure contract", () => {
    expect(validateToolContract(contactProcessConversionTool)).toEqual([]);
  });

  it("rejects a final amount above the initial amount", () => {
    expect(
      calculateContactProcessConversion({
        ...contactProcessConversionExample.input,
        finalSulfurDioxideMol: 11,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "final_amount_exceeds_initial" }] },
      ok: false,
    });
  });
});
