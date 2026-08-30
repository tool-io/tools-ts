import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateStatusCategory, example } from "./tool.js";

describe("http/status-category", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateStatusCategory(example.input)).toEqual(example.output);
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing input", () => {
    expect(tool.execute({}).ok).toBe(false);
  });
  it("handles representative case 1", () => {
    expect(tool.execute({ statusCode: 200 })).toEqual({
      ok: true,
      output: { category: "Successful" },
    });
  });
  it("rejects invalid case 2", () => {
    expect(tool.execute({ statusCode: 99 }).ok).toBe(false);
  });
});
