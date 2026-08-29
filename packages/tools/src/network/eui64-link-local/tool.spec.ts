import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";

describe("network/eui64-link-local", () => {
  it("executes its reference input", () => {
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    expect(result).toEqual({ ok: true, output: example.output });
  });
});
