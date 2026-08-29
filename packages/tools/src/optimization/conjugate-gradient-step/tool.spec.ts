import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";

it("matches the canonical optimization/conjugate-gradient-step result", () =>
  expect(tool.execute(example.input)).toEqual({
    ok: true,
    output: example.output,
  }));

describe("optimization/conjugate-gradient-step", () => {
  it("produces a finite update", () => {
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.nextPosition.every(Number.isFinite)).toBe(true);
  });
});
