import { describe, expect, it } from "vitest";
import { runSum, sumExample, sumParsedValues } from "./tool.js";

describe("Sum Calculator", () => {
  it("sums numeric values and ignores empty entries", () =>
    expect(sumParsedValues("1,,3\n4", "numbers")).toBe(8));
  it("can interpret individual letters as ASCII values", () =>
    expect(sumParsedValues("A, 1, z", "numbers-and-ascii")).toBe(188));
  it("ignores unsupported tokens and rejects an empty result", () => {
    expect(sumParsedValues("1, nope, 3", "numbers")).toBe(4);
    expect(sumParsedValues("nope", "numbers")).toBeNull();
  });
  it("publishes an executable example", () =>
    expect(runSum(sumExample.input)).toEqual({
      ok: true,
      output: sumExample.output,
    }));
});
