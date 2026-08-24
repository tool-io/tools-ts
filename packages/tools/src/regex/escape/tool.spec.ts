import { describe, expect, it } from "vitest";
import { escapeExample, calculateEscape, runEscape } from "./tool.js";

describe("regex/escape", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runEscape(escapeExample.input)).toEqual({
      ok: true,
      output: escapeExample.output,
    });
  });
});
