import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateAudioExpanderRatio, example } from "./tool.js";

describe("electronics/audio-expander-ratio", () => {
  it("matches its worked example", () => {
    expect(calculateAudioExpanderRatio(example.input)).toEqual(example.output);
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
      tool.execute({ ...example.input, inputChangeDb: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a level increase outside its below-threshold model", () => {
    expect(tool.execute({ ...example.input, inputChangeDb: 10 }).ok).toBe(
      false,
    );
  });
});
