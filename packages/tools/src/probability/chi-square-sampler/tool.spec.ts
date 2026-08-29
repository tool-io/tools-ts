import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";

it("matches the canonical probability/chi-square-sampler result", () =>
  expect(tool.execute(example.input)).toEqual({
    ok: true,
    output: example.output,
  }));

describe("probability/chi-square-sampler", () => {
  it("is seeded and finite", () => {
    const first = tool.execute(example.input);
    expect(first.ok).toBe(true);
    expect(first).toEqual(tool.execute(example.input));
    if (first.ok) {
      expect(first.output.samples).toHaveLength(3);
      expect(first.output.samples.every(Number.isFinite)).toBe(true);
    }
  });
});
