import { describe, expect, it } from "vitest";
import {
  icsRefFormatValidatorExample,
  runIcsRefFormatValidator,
} from "./tool.js";

describe("ics-ref-format-validator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runIcsRefFormatValidator(icsRefFormatValidatorExample.input),
    ).toEqual({
      ok: true,
      output: icsRefFormatValidatorExample.output,
    });
  });

  it("normalizes lowercase references to the canonical form", () => {
    expect(runIcsRefFormatValidator({ reference: "ics vii, 12" })).toEqual({
      ok: true,
      output: {
        canonical: "ICS VII, 12",
        volumeRoman: "VII",
        volumeNumber: 7,
        entryNumber: 12,
      },
    });
  });
  it("rejects arabic volumes and malformed numerals", () => {
    expect(runIcsRefFormatValidator({ reference: "ICS 13, 354" }).ok).toBe(
      false,
    );
    expect(runIcsRefFormatValidator({ reference: "ICS IIII, 12" }).ok).toBe(
      false,
    );
    expect(runIcsRefFormatValidator({ reference: "ICS XIII, 0" }).ok).toBe(
      false,
    );
  });
});
