import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";
describe("regex checker", () => {
  it("accepts valid patterns", () =>
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("reports syntax errors", () => {
    const result = tool.execute({ pattern: "[", flags: "" });
    expect(result.ok && result.output.valid).toBe(false);
  });
});
