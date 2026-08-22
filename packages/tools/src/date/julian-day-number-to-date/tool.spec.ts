import { describe, expect, it } from "vitest";
import { runJdnToDate } from "./tool.js";
describe("julian day number to date", () => {
  it("converts JDN 2451545 to 2000-01-01", () => {
    expect(runJdnToDate({ jdn: 2451545 })).toEqual({
      ok: true,
      output: { date: "2000-01-01" },
    });
  });
});
