import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";

it("matches the canonical probability/metropolis-hastings-sampler result", () =>
  expect(tool.execute(example.input)).toEqual({
    ok: true,
    output: example.output,
  }));

describe("probability/metropolis-hastings-sampler", () => {
  it("returns deterministic samples for a seed", () => {
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    expect(result).toEqual(tool.execute(example.input));
  });
});
