import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";

it("matches the canonical probability/negative-binomial-poisson-mixture-sampler result", () =>
  expect(tool.execute(example.input)).toEqual({
    ok: true,
    output: example.output,
  }));

describe("probability/negative-binomial-poisson-mixture-sampler", () => {
  it("runs deterministically", () => {
    const first = tool.execute(example.input);
    expect(first.ok).toBe(true);
    expect(first).toEqual(tool.execute(example.input));
  });
});
