import { describe, expect, it } from "vitest";
import {
  prioritizeXriskWithLongtermistFrame,
  runXriskPriority,
  xriskPriorityExample,
} from "./tool.js";

describe("longtermism xrisk prioritization frame lookup", () => {
  it("reproduces its canonical example", () => {
    expect(runXriskPriority(xriskPriorityExample.input)).toEqual({
      ok: true,
      output: xriskPriorityExample.output,
    });
  });

  it("caps the priority score at 100", () => {
    expect(
      prioritizeXriskWithLongtermistFrame({
        impactScore: 100,
        planningHorizonYears: 1000,
        reversibility: "irreversible",
        riskScope: "civilization",
        urgencyScore: 100,
      }).priorityScore,
    ).toBe(100);
  });

  it("allows a low-priority reversible local risk", () => {
    expect(
      prioritizeXriskWithLongtermistFrame({
        impactScore: 10,
        planningHorizonYears: 0,
        reversibility: "reversible",
        riskScope: "local",
        urgencyScore: 5,
      }).priorityScore,
    ).toBe(7.5);
  });

  it("rejects a negative planning horizon", () => {
    expect(
      runXriskPriority({
        impactScore: 10,
        planningHorizonYears: -1,
        reversibility: "reversible",
        riskScope: "local",
        urgencyScore: 5,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "planningHorizonYears" }],
      },
      ok: false,
    });
  });
});
