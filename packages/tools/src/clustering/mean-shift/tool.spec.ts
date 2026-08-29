import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";

it("matches the canonical clustering/mean-shift result", () =>
  expect(tool.execute(example.input)).toEqual({
    ok: true,
    output: example.output,
  }));

describe("clustering/mean-shift", () => {
  it("fits two separated clusters", () => {
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
  });
});
