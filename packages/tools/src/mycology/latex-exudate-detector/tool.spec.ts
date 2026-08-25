import { describe, expect, it } from "vitest";
import {
  latexExudateDetectorExample,
  latexExudateDetectorTool,
  runLatexExudateDetector,
} from "./tool.js";

describe("latexExudateDetectorTool", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runLatexExudateDetector(latexExudateDetectorExample.input)).toEqual({
      ok: true,
      output: latexExudateDetectorExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(latexExudateDetectorExample))).toEqual(
      latexExudateDetectorExample,
    );
    expect(latexExudateDetectorTool.contractVersion).toBe(1);
    expect(latexExudateDetectorTool.execution).toEqual({ kind: "pure" });
  });

  it("reports milky-white latex as present", () => {
    const r = runLatexExudateDetector({ exudate: "milky-white" });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.hasLatex).toBe(true);
    expect(r.output.latexDescription).toBe("milky-white");
  });

  it("reports watery latex as present", () => {
    const r = runLatexExudateDetector({ exudate: "watery" });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.hasLatex).toBe(true);
    expect(r.output.latexDescription).toBe("watery");
  });

  it("reports changing latex as present", () => {
    const r = runLatexExudateDetector({ exudate: "colored-changing" });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.hasLatex).toBe(true);
    expect(r.output.latexDescription).toBe("colored-changing");
  });

  it("reports absent exudate as having no latex", () => {
    const r = runLatexExudateDetector({ exudate: "absent" });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.hasLatex).toBe(false);
    expect(r.output.latexDescription).toBe("absent");
  });

  it("rejects unknown exudates", () => {
    expect(runLatexExudateDetector({ exudate: "sticky" }).ok).toBe(false);
    expect(runLatexExudateDetector({ exudate: "" }).ok).toBe(false);
  });

  it("rejects malformed input", () => {
    expect(runLatexExudateDetector(null).ok).toBe(false);
    expect(runLatexExudateDetector({ exudate: [] }).ok).toBe(false);
    expect(
      runLatexExudateDetector({
        ...latexExudateDetectorExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
