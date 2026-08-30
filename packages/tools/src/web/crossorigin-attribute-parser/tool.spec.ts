import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateCrossoriginAttributeParser, example } from "./tool.js";

describe("web/crossorigin-attribute-parser", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateCrossoriginAttributeParser(example.input)).toEqual(
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
    expect(tool.execute({ present: true, value: "" })).toEqual({
      ok: true,
      output: { state: "anonymous" },
    });
  });
  it("handles representative case 2", () => {
    expect(tool.execute({ present: false, value: "use-credentials" })).toEqual({
      ok: true,
      output: { state: "no-cors" },
    });
  });
});
