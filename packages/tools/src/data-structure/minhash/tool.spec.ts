import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";

it("matches the canonical data-structure/minhash result", () =>
  expect(tool.execute(example.input)).toEqual({
    ok: true,
    output: example.output,
  }));

describe("data-structure/minhash", () => {
  it("executes deterministically", () => {
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    expect(result).toEqual(tool.execute(example.input));
  });
});
