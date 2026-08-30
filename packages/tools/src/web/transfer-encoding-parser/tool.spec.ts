import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateTransferEncodingParser, example } from "./tool.js";

describe("web/transfer-encoding-parser", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateTransferEncodingParser(example.input)).toEqual(
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
    expect(tool.execute({ header: "chunked" })).toEqual({
      ok: true,
      output: { codings: ["chunked"] },
    });
  });
  it("rejects invalid case 2", () => {
    expect(tool.execute({ header: "gzip," }).ok).toBe(false);
  });
});
