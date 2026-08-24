import { describe, expect, it } from "vitest";
import {
  cacheControlExample,
  calculateCacheControl,
  runCacheControl,
} from "./tool.js";

describe("parse/cache-control", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCacheControl(cacheControlExample.input)).toEqual({
      ok: true,
      output: cacheControlExample.output,
    });
  });

  it("unquotes string values and keeps numeric ones as numbers", () => {
    expect(
      calculateCacheControl({
        header: 'no-cache="set-cookie", max-age=0',
      }),
    ).toEqual({
      directiveCount: 2,
      directives: { "max-age": 0, "no-cache": "set-cookie" },
    });
  });

  it("keeps the last occurrence of a repeated directive", () => {
    expect(calculateCacheControl({ header: "max-age=1, max-age=2" })).toEqual({
      directiveCount: 1,
      directives: { "max-age": 2 },
    });
  });

  it("rejects directives without a name", () => {
    expect(runCacheControl({ header: "=5" }).ok).toBe(false);
  });

  it("tolerates stray commas and whitespace", () => {
    expect(
      calculateCacheControl({ header: "  must-revalidate , ,private " }),
    ).toEqual({
      directiveCount: 2,
      directives: { "must-revalidate": true, private: true },
    });
  });
});
