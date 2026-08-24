import { describe, expect, it } from "vitest";
import { urlExample, calculateUrl, runUrl } from "./tool.js";

describe("parse/url", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runUrl(urlExample.input)).toEqual({
      ok: true,
      output: urlExample.output,
    });
  });
  it("rejects invalid input (malformed_url)", () => {
    expect(runUrl({ url: "not a url" }).ok).toBe(false);
  });
  it("rejects invalid input (malformed_url)", () => {
    expect(runUrl({ url: "/relative/only" }).ok).toBe(false);
  });
});
