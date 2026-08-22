import { describe, expect, it } from "vitest";
import { runBase64UrlEncode } from "./tool.js";

describe("Base64URL Encoder", () => {
  it("calculates a valid result", () => {
    expect(runBase64UrlEncode({ text: "hello world" })).toEqual({
      ok: true,
      output: { base64Url: "aGVsbG8gd29ybGQ" },
    });
  });

  it("emits URL-safe characters without padding", () => {
    expect(runBase64UrlEncode({ text: "subjects?_i" })).toEqual({
      ok: true,
      output: { base64Url: "c3ViamVjdHM_X2k" },
    });
  });

  it("rejects invalid input", () =>
    expect(runBase64UrlEncode(null).ok).toBe(false));
});
