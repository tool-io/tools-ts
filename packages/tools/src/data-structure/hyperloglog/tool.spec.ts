import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";

it("matches the canonical data-structure/hyperloglog result", () =>
  expect(tool.execute(example.input)).toEqual({
    ok: true,
    output: example.output,
  }));

describe("data-structure/hyperloglog", () => {
  it("executes deterministically", () => {
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    expect(result).toEqual(tool.execute(example.input));
  });
  it("is zero for an empty set and ignores duplicate insertions", () => {
    const empty = tool.execute({ items: [], precision: 8 });
    const one = tool.execute({ items: ["a"], precision: 8 });
    const repeated = tool.execute({ items: ["a", "a"], precision: 8 });
    expect(empty.ok && empty.output.estimate).toBe(0);
    expect(one).toEqual(repeated);
  });
});
