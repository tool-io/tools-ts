import { describe, expect, it } from "vitest";
import {
  lookupMeadowsLeveragePoint,
  meadowsLeverageExample,
  runMeadowsLeverage,
} from "./tool.js";

describe("Meadows twelve leverage points lookup", () => {
  it("reproduces its canonical example", () => {
    expect(runMeadowsLeverage(meadowsLeverageExample.input)).toEqual({
      ok: true,
      output: meadowsLeverageExample.output,
    });
  });

  it("looks up system parameters", () => {
    expect(
      lookupMeadowsLeveragePoint({ leveragePoint: "systemParameters" })
        .leveragePosition,
    ).toBe(1);
  });

  it("looks up paradigm", () => {
    expect(
      lookupMeadowsLeveragePoint({ leveragePoint: "paradigm" }).limitation,
    ).toContain("Very difficult");
  });

  it("rejects an unsupported leverage point at the public boundary", () => {
    expect(runMeadowsLeverage({ leveragePoint: "technology" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "leveragePoint" }] },
      ok: false,
    });
  });
});
