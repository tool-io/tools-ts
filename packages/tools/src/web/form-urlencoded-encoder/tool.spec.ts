import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateFormUrlencodedEncoder, example } from "./tool.js";

describe("web/form-urlencoded-encoder", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateFormUrlencodedEncoder(example.input)).toEqual(
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
    expect(tool.execute({ names: ["a+b"], values: ["x&y"] })).toEqual({
      ok: true,
      output: { encoded: "a%2Bb=x%26y" },
    });
  });
  it("rejects invalid case 2", () => {
    expect(tool.execute({ names: ["x"], values: [] }).ok).toBe(false);
  });
  it("rejects a lone surrogate with a field error", () => {
    expect(tool.execute({ names: ["\uD800"], values: ["x"] })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "names" }] },
    });
  });
});
