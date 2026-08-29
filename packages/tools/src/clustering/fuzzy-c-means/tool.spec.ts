import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";

it("matches the canonical clustering/fuzzy-c-means result", () =>
  expect(tool.execute(example.input)).toEqual({
    ok: true,
    output: example.output,
  }));

describe("clustering/fuzzy-c-means", () => {
  it("fits two separated clusters", () => {
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
  });
});
