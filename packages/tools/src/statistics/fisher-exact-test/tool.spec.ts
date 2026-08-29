import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";

it("matches the canonical statistics/fisher-exact-test result", () =>
  expect(tool.execute(example.input)).toEqual({
    ok: true,
    output: example.output,
  }));
describe("Fisher exact test", () => {
  it("matches a published small 2x2 example", () => {
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.pValue).toBeCloseTo(0.00275945618522, 10);
  });
});
