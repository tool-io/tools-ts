import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateAuszugsschienenLaenge, example } from "./tool.js";

describe("carpentry/auszugsschienen-laenge", () => {
  it("matches its worked example", () => {
    expect(calculateAuszugsschienenLaenge(example.input)).toEqual(
      example.output,
    );
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and nonfinite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, insideDepthMillimeters: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative insideDepthMillimeters", () => {
    expect(
      tool.execute({ ...example.input, insideDepthMillimeters: -1 }).ok,
    ).toBe(false);
  });
});
