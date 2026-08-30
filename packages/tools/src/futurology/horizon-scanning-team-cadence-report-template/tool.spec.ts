import { describe, expect, it } from "vitest";
import {
  buildHorizonScanningCadenceReport,
  horizonCadenceExample,
  runHorizonCadence,
} from "./tool.js";

describe("horizon scanning team cadence report template", () => {
  it("reproduces its canonical example", () => {
    expect(runHorizonCadence(horizonCadenceExample.input)).toEqual({
      ok: true,
      output: horizonCadenceExample.output,
    });
  });

  it("crosses scan areas and horizons", () => {
    expect(
      buildHorizonScanningCadenceReport({
        horizonLabels: ["H1", "H2", "H3"],
        reviewCadence: "Monthly",
        scanAreas: ["A", "B"],
        teamName: "Team",
      }).totalAgendaItemCount,
    ).toBe(6);
  });

  it("keeps area-major agenda order", () => {
    expect(
      buildHorizonScanningCadenceReport({
        horizonLabels: ["H1", "H2"],
        reviewCadence: "Monthly",
        scanAreas: ["A"],
        teamName: "Team",
      }).agendaItems[0],
    ).toContain("H1");
  });

  it("rejects an empty scan-area list", () => {
    expect(
      runHorizonCadence({
        horizonLabels: ["H1"],
        reviewCadence: "Monthly",
        scanAreas: [],
        teamName: "Team",
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "cadence_list_required", field: "scanAreas" }],
      },
      ok: false,
    });
  });
});
