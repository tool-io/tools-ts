import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, {
  calculateFetchpriorityAttributeValidator,
  example,
} from "./tool.js";

describe("web/fetchpriority-attribute-validator", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateFetchpriorityAttributeValidator(example.input)).toEqual(
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
    expect(tool.execute({ value: "LOW" })).toEqual({
      ok: true,
      output: { valid: true },
    });
  });
  it("handles representative case 2", () => {
    expect(tool.execute({ value: "highest" })).toEqual({
      ok: true,
      output: { valid: false },
    });
  });
});
