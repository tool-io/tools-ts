import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";

it("matches the canonical number/herons-method result", () =>
  expect(tool.execute(example.input)).toEqual({
    ok: true,
    output: example.output,
  }));

describe("number/herons-method", () => {
  it("executes its reference input", () => {
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
  });
});
