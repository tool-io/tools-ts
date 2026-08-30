import { describe, expect, it } from "vitest";
import {
  cosoMappingExample,
  mapCosoControlElements,
  runCosoMapping,
} from "./tool.js";

describe("COSO five components mapping grid", () => {
  it("reproduces its canonical example", () => {
    expect(runCosoMapping(cosoMappingExample.input)).toEqual({
      ok: true,
      output: cosoMappingExample.output,
    });
  });

  it("normalizes punctuation and spacing in component labels", () => {
    expect(
      mapCosoControlElements({
        controlElements: ["Control Activities", "monitoring activities"],
      }).coveredComponents,
    ).toEqual(["control_activities", "monitoring_activities"]);
  });

  it("recognizes complete coverage", () => {
    expect(
      mapCosoControlElements({
        controlElements: [
          "control environment",
          "risk assessment",
          "control activities",
          "information and communication",
          "monitoring activities",
        ],
      }).completeCoverage,
    ).toBe(true);
  });

  it("rejects a blank element label", () => {
    expect(runCosoMapping({ controlElements: [" "] })).toMatchObject({
      error: {
        issues: [
          { code: "invalid_control_element", field: "controlElements.0" },
        ],
      },
      ok: false,
    });
  });
});
