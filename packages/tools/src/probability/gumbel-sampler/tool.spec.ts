import { describe, expect, it } from "vitest";
import { exampleOutputsMatch } from "../../core/example.js";
import tool, { example } from "./tool.js";

it("matches the canonical probability/gumbel-sampler result", () =>
  expect(
    exampleOutputsMatch(tool.execute(example.input), {
      ok: true,
      output: example.output,
    }),
  ).toBe(true));

describe("probability/gumbel-sampler", () => {
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
