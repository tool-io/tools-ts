import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";
describe("JSON to Markdown", () => {
  it("renders a flat object array", () =>
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("rejects malformed JSON", () =>
    expect(tool.execute({ json: "{" }).ok).toBe(false));
});
