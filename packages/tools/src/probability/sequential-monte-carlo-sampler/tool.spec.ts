import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";

it("matches the canonical probability/sequential-monte-carlo-sampler result", () =>
  expect(tool.execute(example.input)).toEqual({
    ok: true,
    output: example.output,
  }));

describe("probability/sequential-monte-carlo-sampler", () => {
  it("runs deterministically", () => {
    const first = tool.execute(example.input);
    expect(first.ok).toBe(true);
    expect(first).toEqual(tool.execute(example.input));
  });
});
