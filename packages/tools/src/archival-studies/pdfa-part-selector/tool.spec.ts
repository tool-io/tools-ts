import { describe, expect, it } from "vitest";
import {
  calculatePdfaPartSelector,
  pdfaPartSelectorExample,
  runPdfaPartSelector,
} from "./tool.js";

describe("archival-studies/pdfa-part-selector", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runPdfaPartSelector(pdfaPartSelectorExample.input)).toEqual({
      ok: true,
      output: pdfaPartSelectorExample.output,
    });
  });

  it("keeps feature-free documents at Part 1 and escalates to Part 3 for non-PDF attachments", () => {
    expect(calculatePdfaPartSelector({})).toEqual({
      part: 1,
      conformanceLabel: "PDF/A-1",
      rationale:
        "No advanced features are required beyond the PDF/A-1 baseline.",
    });
    expect(
      calculatePdfaPartSelector({ nonPdfAttachments: true }),
    ).toMatchObject({ part: 3, conformanceLabel: "PDF/A-3" });
  });

  it("rejects non-boolean feature flags", () => {
    expect(runPdfaPartSelector({ transparency: "yes" } as never).ok).toBe(
      false,
    );
  });
});
