import { describe, expect, it } from "vitest";
import {
  buildVorosFuturesConeRings,
  futuresConeRingsExample,
  runFuturesConeRings,
} from "./tool.js";

describe("Voros futures cone expansion rings lookup", () => {
  it("reproduces its canonical example", () => {
    expect(runFuturesConeRings(futuresConeRingsExample.input)).toEqual({
      ok: true,
      output: futuresConeRingsExample.output,
    });
  });

  it("builds one scenario per ring", () => {
    expect(
      buildVorosFuturesConeRings({
        centralScenario: "Central",
        horizonLabels: ["H1", "H2", "H3"],
        ringDescriptions: ["A", "B", "C"],
        ringLabels: ["R1", "R2", "R3"],
      }).ringCount,
    ).toBe(3);
  });

  it("joins each ring with its horizon and description", () => {
    expect(
      buildVorosFuturesConeRings({
        centralScenario: "Central",
        horizonLabels: ["H1"],
        ringDescriptions: ["D"],
        ringLabels: ["R"],
      }).scenarioAssignments,
    ).toEqual(["R | H1 | D"]);
  });

  it("rejects mismatched ring description counts", () => {
    expect(
      runFuturesConeRings({
        centralScenario: "Central",
        horizonLabels: ["H1"],
        ringDescriptions: [],
        ringLabels: ["R"],
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "ring_descriptions_length_mismatch",
            field: "ringDescriptions",
          },
        ],
      },
      ok: false,
    });
  });
});
