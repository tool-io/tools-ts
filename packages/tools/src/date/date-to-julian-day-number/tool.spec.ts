import { describe, expect, it } from "vitest";
import { dateToJdnExample, runDateToJdn } from "./tool.js";

describe("date to julian day number", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDateToJdn(dateToJdnExample.input)).toEqual({
      ok: true,
      output: dateToJdnExample.output,
    });
  });

  it("rejects dates that do not exist", () => {
    expect(runDateToJdn({ date: "2026-02-29" }).ok).toBe(false);
  });
});
