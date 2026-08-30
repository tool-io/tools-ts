import { describe, expect, it } from "vitest";
import {
  calculateAmmoniaExcretion,
  example,
  runAmmoniaExcretion,
} from "./tool.js";

describe("aquaculture/ammonia-excretion", () => {
  it("calculates the published example", () => {
    expect(calculateAmmoniaExcretion(example.input)).toEqual(example.output);
    expect(runAmmoniaExcretion(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runAmmoniaExcretion({
      ...example.input,
      biomassKilograms: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
});
