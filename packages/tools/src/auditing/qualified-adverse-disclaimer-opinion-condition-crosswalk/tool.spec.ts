import { describe, expect, it } from "vitest";
import {
  mapOpinionCondition,
  opinionConditionExample,
  runOpinionCondition,
} from "./tool.js";

describe("opinion condition crosswalk", () => {
  it("reproduces its canonical example", () => {
    expect(runOpinionCondition(opinionConditionExample.input)).toEqual({
      ok: true,
      output: opinionConditionExample.output,
    });
  });

  it("maps a pervasive scope limitation to a disclaimer", () => {
    expect(
      mapOpinionCondition({
        basis: "scope_limitation",
        material: true,
        pervasive: true,
        selectedOpinion: "qualified",
      }),
    ).toMatchObject({ expectedOpinion: "disclaimer", opinionMatches: false });
  });

  it("maps a material nonpervasive misstatement to qualified", () => {
    expect(
      mapOpinionCondition({
        basis: "misstatement",
        material: true,
        pervasive: false,
        selectedOpinion: "qualified",
      }).expectedOpinion,
    ).toBe("qualified");
  });

  it("rejects pervasive but immaterial facts", () => {
    expect(
      runOpinionCondition({
        basis: "misstatement",
        material: false,
        pervasive: true,
        selectedOpinion: "unmodified",
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "inconsistent_opinion_facts", field: "pervasive" }],
      },
      ok: false,
    });
  });
});
