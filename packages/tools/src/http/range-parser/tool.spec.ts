import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateRangeParser, example } from "./tool.js";

describe("http/range-parser", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateRangeParser(example.input)).toEqual(example.output);
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing input", () => {
    expect(tool.execute({}).ok).toBe(false);
  });
  it("handles representative case 1", () => {
    expect(tool.execute({ rangeHeader: "bytes=-500" })).toEqual({
      ok: true,
      output: { range: { kind: "suffix", length: 500 } },
    });
  });
  it("handles representative case 2", () => {
    expect(tool.execute({ rangeHeader: "bytes=10-" })).toEqual({
      ok: true,
      output: { range: { kind: "open", start: 10 } },
    });
  });
  it("rejects invalid case 3", () => {
    expect(tool.execute({ rangeHeader: "bytes=99-1" }).ok).toBe(false);
  });
  it("parses syntactically valid but unsatisfiable zero suffix", () => {
    expect(tool.execute({ rangeHeader: "bytes=-0" })).toEqual({
      ok: true,
      output: { range: { kind: "suffix", length: 0 } },
    });
  });
});
