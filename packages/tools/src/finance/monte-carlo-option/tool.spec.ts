import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";

it("matches the canonical finance/monte-carlo-option result", () =>
  expect(tool.execute(example.input)).toEqual({
    ok: true,
    output: example.output,
  }));

describe("finance/monte-carlo-option", () => {
  it("prices a reference scenario", () => {
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.optionPrice).toBeGreaterThan(0);
  });
});
