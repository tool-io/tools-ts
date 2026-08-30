import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateMethodValidator, example } from "./tool.js";

describe("http/method-validator", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateMethodValidator(example.input)).toEqual(example.output);
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing input", () => {
    expect(tool.execute({}).ok).toBe(false);
  });
  it("handles representative case 1", () => {
    expect(tool.execute({ method: "my-method" })).toEqual({
      ok: true,
      output: { valid: true },
    });
  });
  it("handles representative case 2", () => {
    expect(tool.execute({ method: "GET\\r\\nX:1" })).toEqual({
      ok: true,
      output: { valid: false },
    });
  });
});
