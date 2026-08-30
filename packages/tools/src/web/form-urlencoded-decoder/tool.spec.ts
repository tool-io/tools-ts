import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateFormUrlencodedDecoder, example } from "./tool.js";

describe("web/form-urlencoded-decoder", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateFormUrlencodedDecoder(example.input)).toEqual(
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
    expect(tool.execute({ encoded: "x=1&x=2" })).toEqual({
      ok: true,
      output: { names: ["x", "x"], values: ["1", "2"] },
    });
  });
  it("rejects invalid case 2", () => {
    expect(tool.execute({ encoded: "x=%ZZ" }).ok).toBe(false);
  });
});
