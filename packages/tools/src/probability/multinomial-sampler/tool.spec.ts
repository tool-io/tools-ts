import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";

it("matches the canonical probability/multinomial-sampler result", () =>
  expect(tool.execute(example.input)).toEqual({
    ok: true,
    output: example.output,
  }));

describe("probability/multinomial-sampler", () => {
  it("returns deterministic samples for a seed", () => {
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    expect(result).toEqual(tool.execute(example.input));
  });
  it("preserves the trial total", () => {
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (result.ok)
      for (const row of result.output.samples)
        expect(row.reduce((a, b) => a + b, 0)).toBe(example.input.trials);
  });
});
