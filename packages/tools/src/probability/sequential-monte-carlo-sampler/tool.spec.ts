import { describe, expect, it } from "vitest";
import { exampleOutputsMatch } from "../../core/example.js";
import tool, { example } from "./tool.js";

it("matches the canonical probability/sequential-monte-carlo-sampler result", () =>
  expect(
    exampleOutputsMatch(tool.execute(example.input), {
      ok: true,
      output: example.output,
    }),
  ).toBe(true));

describe("probability/sequential-monte-carlo-sampler", () => {
  it("runs deterministically", () => {
    const first = tool.execute(example.input);
    expect(first.ok).toBe(true);
    expect(first).toEqual(tool.execute(example.input));
  });
});
