import { describe, expect, it } from "vitest";
import {
  citizenPanelChecklistExample,
  designParticipatoryForesightPanel,
  runCitizenPanelChecklist,
} from "./tool.js";

describe("participatory foresight citizen panel checklist", () => {
  it("reproduces its canonical example", () => {
    expect(
      runCitizenPanelChecklist(citizenPanelChecklistExample.input),
    ).toEqual({
      ok: true,
      output: citizenPanelChecklistExample.output,
    });
  });

  it("reports unmet representation coverage", () => {
    expect(
      designParticipatoryForesightPanel({
        accessibilityMeasures: ["Captioning"],
        minimumRepresentationDimensions: 2,
        panelPurpose: "Test assumptions",
        participantCount: 8,
        representationCriteria: ["Region"],
      }).designReady,
    ).toBe(false);
  });

  it("includes facilitation and synthesis items", () => {
    expect(
      designParticipatoryForesightPanel({
        accessibilityMeasures: ["Remote"],
        minimumRepresentationDimensions: 1,
        panelPurpose: "Test assumptions",
        participantCount: 8,
        representationCriteria: ["Region"],
      }).checklist,
    ).toHaveLength(6);
  });

  it("rejects a nonpositive participant count", () => {
    expect(
      runCitizenPanelChecklist({
        accessibilityMeasures: ["Remote"],
        minimumRepresentationDimensions: 1,
        panelPurpose: "Test assumptions",
        participantCount: 0,
        representationCriteria: ["Region"],
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "participantCount" }],
      },
      ok: false,
    });
  });
});
