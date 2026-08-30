import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateHeaderNameNormalizer, example } from "./tool.js";

describe("http/header-name-normalizer", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateHeaderNameNormalizer(example.input)).toEqual(
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
    expect(tool.execute({ headerName: "X-Custom" })).toEqual({
      ok: true,
      output: { normalizedName: "x-custom" },
    });
  });
  it("rejects invalid case 2", () => {
    expect(tool.execute({ headerName: "Bad Header" }).ok).toBe(false);
  });
});
