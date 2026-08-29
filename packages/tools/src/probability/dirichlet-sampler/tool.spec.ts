import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";

it("matches the canonical probability/dirichlet-sampler result", () =>
  expect(tool.execute(example.input)).toEqual({
    ok: true,
    output: example.output,
  }));

describe("probability/dirichlet-sampler", () => {
  it("returns deterministic samples for a seed", () => {
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    expect(result).toEqual(tool.execute(example.input));
  });
  it("returns simplex rows", () => {
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (result.ok)
      for (const row of result.output.samples)
        expect(row.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 12);
  });
});
