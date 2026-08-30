import { describe, expect, it } from "vitest";
import {
  buildScienceFictionPrototypingNarrative,
  runScienceFictionPrototyping,
  scienceFictionPrototypingExample,
} from "./tool.js";

describe("science fiction prototyping narrative method", () => {
  it("reproduces its canonical example", () => {
    expect(
      runScienceFictionPrototyping(scienceFictionPrototypingExample.input),
    ).toEqual({
      ok: true,
      output: scienceFictionPrototypingExample.output,
    });
  });

  it("generates three prototype prompts", () => {
    expect(
      buildScienceFictionPrototypingNarrative({
        futureAssumption: "A",
        presentConstraint: "B",
        stakeholder: "C",
        timeHorizon: "D",
      }).prototypePrompts,
    ).toHaveLength(3);
  });

  it("trims all narrative fields", () => {
    expect(
      buildScienceFictionPrototypingNarrative({
        futureAssumption: " A ",
        presentConstraint: " B ",
        stakeholder: " C ",
        timeHorizon: " D ",
      }).narrative,
    ).toContain("In D, C encounters");
  });

  it("rejects an empty stakeholder", () => {
    expect(
      runScienceFictionPrototyping({
        futureAssumption: "A",
        presentConstraint: "B",
        stakeholder: " ",
        timeHorizon: "D",
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "prototyping_field_required", field: "stakeholder" }],
      },
      ok: false,
    });
  });
});
