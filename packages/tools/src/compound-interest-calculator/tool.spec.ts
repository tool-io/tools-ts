import { describe, expect, it } from "vitest";
import { compoundInterestExample, runCompoundInterest } from "./tool.js";
describe("compound interest", () => {
  it("publishes an executable example", () =>
    expect(runCompoundInterest(compoundInterestExample.input)).toEqual({
      ok: true,
      output: compoundInterestExample.output,
    }));
});
