import { describe, expect, it } from "vitest";
import {
  kalendsMedievalDateParserExample,
  runKalendsMedievalDateParser,
} from "./tool.js";

describe("kalends-medieval-date-parser", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runKalendsMedievalDateParser(kalendsMedievalDateParserExample.input),
    ).toEqual({
      ok: true,
      output: kalendsMedievalDateParserExample.output,
    });
  });

  it("resolves pridie Ides of March to 14 March", () => {
    const result = runKalendsMedievalDateParser({
      reference: "ides",
      count: 2,
      namedMonth: "march",
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.resolvedDayOfMonth).toBe(14);
    expect(result.output.referenceDayNumber).toBe(15);
    expect(result.output.romanNotation).toBe("prid. id. mart.");
  });

  it("maps leap-year Februaries onto 29 days", () => {
    const result = runKalendsMedievalDateParser({
      reference: "kalends",
      count: 6,
      namedMonth: "march",
      leapYear: true,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.resolvedMonth).toBe("february");
    expect(result.output.resolvedDayOfMonth).toBe(25);
  });

  it("rejects counts beyond the reference segment", () => {
    expect(
      runKalendsMedievalDateParser({
        reference: "nones",
        count: 8,
        namedMonth: "april",
      }).ok,
    ).toBe(false);
  });

  it("does not let an Ides count overlap the preceding Nones segment", () => {
    expect(
      runKalendsMedievalDateParser({
        reference: "ides",
        count: 9,
        namedMonth: "april",
      }).ok,
    ).toBe(false);
  });

  it("does not let a Kalends count overlap the preceding Ides", () => {
    expect(
      runKalendsMedievalDateParser({
        reference: "kalends",
        count: 18,
        namedMonth: "april",
      }).ok,
    ).toBe(false);
  });
});
