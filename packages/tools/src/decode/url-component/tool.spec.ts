import { describe, expect, it } from "vitest";
import { runUrlComponent } from "./tool.js";
describe("URL Component Decoder", () => {
  it("calculates a valid result", () => {
    expect(runUrlComponent({ encoded: "hello%20world" })).toEqual({
      ok: true,
      output: { decoded: "hello world" },
    });
  });
  it("rejects invalid input", () =>
    expect(runUrlComponent({ encoded: "%ZZ" }).ok).toBe(false));
});
