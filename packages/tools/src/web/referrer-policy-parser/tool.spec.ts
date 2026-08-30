import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateReferrerPolicyParser, example } from "./tool.js";

describe("web/referrer-policy-parser", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateReferrerPolicyParser(example.input)).toEqual(
      example.output,
    );
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing input", () => {
    expect(tool.execute({}).ok).toBe(false);
  });
  it("handles representative case 1", () => {
    expect(tool.execute({ header: "invalid, no-referrer" })).toEqual({
      ok: true,
      output: { selectedPolicy: "no-referrer", recognized: true },
    });
  });
  it("handles representative case 2", () => {
    expect(tool.execute({ header: "unknown" })).toEqual({
      ok: true,
      output: { selectedPolicy: "", recognized: false },
    });
  });
});
