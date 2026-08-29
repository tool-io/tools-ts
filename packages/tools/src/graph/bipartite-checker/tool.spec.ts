import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";

it("matches the canonical graph/bipartite-checker result", () =>
  expect(tool.execute(example.input)).toEqual({
    ok: true,
    output: example.output,
  }));

describe("graph/bipartite-checker", () => {
  it("executes the reference case", () =>
    expect(tool.execute(example.input).ok).toBe(true));
});
