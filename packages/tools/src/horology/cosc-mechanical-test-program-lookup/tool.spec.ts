import { describe, expect, it } from "vitest";
import {
  coscProgramExample,
  lookupCoscMechanicalTestProgram,
  runCoscProgram,
} from "./tool.js";

describe("COSC mechanical test-program lookup", () => {
  it("reproduces the canonical ISO 3159 fact", () => {
    expect(runCoscProgram(coscProgramExample.input)).toEqual({
      ok: true,
      output: coscProgramExample.output,
    });
  });

  it("covers movement scope", () => {
    expect(
      lookupCoscMechanicalTestProgram({ programFocus: "movementScope" })
        .verifiedStatement,
    ).toContain("uncased");
  });

  it("covers duration without collapsing the official range", () => {
    expect(
      lookupCoscMechanicalTestProgram({ programFocus: "duration" }).keyDate,
    ).toBe("current certified-chronometer page");
  });

  it("covers the five positions", () => {
    expect(
      lookupCoscMechanicalTestProgram({ programFocus: "positions" }).keyDate,
    ).toBe("five positions");
  });

  it("covers temperatures and the mean-rate window", () => {
    expect(
      lookupCoscMechanicalTestProgram({ programFocus: "temperatures" }).keyDate,
    ).toContain("38");
    expect(
      lookupCoscMechanicalTestProgram({ programFocus: "meanRateWindow" })
        .verifiedStatement,
    ).toContain("-4 to +6");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(runCoscProgram({ programFocus: "waterResistance" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "programFocus" }] },
      ok: false,
    });
  });
});
