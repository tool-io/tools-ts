import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateBearerExtractor, example } from "./tool.js";

describe("http/bearer-extractor", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateBearerExtractor(example.input)).toEqual(example.output);
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing input", () => {
    expect(tool.execute({}).ok).toBe(false);
  });
  it("handles representative case 1", () => {
    expect(tool.execute({ authorization: "bearer abc==" })).toEqual({
      ok: true,
      output: { token: "abc==" },
    });
  });
  it("rejects invalid case 2", () => {
    expect(tool.execute({ authorization: "Bearer x\\nInjected: y" }).ok).toBe(
      false,
    );
  });
});
