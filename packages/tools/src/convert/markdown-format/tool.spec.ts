import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";
describe("Markdown format converter", () => {
  it("converts a simple Slack message", () =>
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
});
