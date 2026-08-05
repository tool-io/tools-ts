import { describe, expect, it } from "vitest";
import { dateParserExample, parseCalendarDate, runDateParser } from "./tool.js";

describe("Date Parser", () => {
  it.each([
    ["2026-08-11", "iso"],
    ["08/11/2026", "en-US"],
    ["11.08.2026", "de-DE"],
  ] as const)("parses %s", (text, format) =>
    expect(parseCalendarDate(text, format)?.iso).toBe("2026-08-11"),
  );
  it("rejects impossible dates", () =>
    expect(parseCalendarDate("2026-02-30", "iso")).toBeNull());
  it("publishes an executable example", () =>
    expect(runDateParser(dateParserExample.input)).toEqual({
      ok: true,
      output: dateParserExample.output,
    }));
});
