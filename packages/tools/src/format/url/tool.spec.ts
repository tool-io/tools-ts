import { describe, expect, it } from "vitest";
import { urlExample, calculateUrl, runUrl } from "./tool.js";

describe("format/url", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runUrl(urlExample.input)).toEqual({
      ok: true,
      output: urlExample.output,
    });
  });
  it("rejects invalid input (missing_host)", () => {
    expect(runUrl({ scheme: "https", host: " ", pathname: "/" }).ok).toBe(
      false,
    );
  });
  it("rejects invalid input (missing_scheme)", () => {
    expect(runUrl({ scheme: "", host: "example.com" }).ok).toBe(false);
  });
  it("rejects invalid input (invalid_field)", () => {
    expect(runUrl({ host: "example.com", port: 70000 }).ok).toBe(false);
  });
});
