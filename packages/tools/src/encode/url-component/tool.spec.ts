import { describe, expect, it } from "vitest";
import { runUrlComponent } from "./tool.js";
describe("URL Component Encoder", () => {
  it("calculates a valid result", () => {
    expect(runUrlComponent({ text: "hello world" })).toEqual({
      ok: true,
      output: { encoded: "hello%20world" },
    });
  });
  it("rejects invalid input", () =>
    expect(runUrlComponent(null).ok).toBe(false));
});
