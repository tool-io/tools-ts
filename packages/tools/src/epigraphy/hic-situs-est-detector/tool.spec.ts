import { describe, expect, it } from "vitest";
import { hicSitusEstDetectorExample, runHicSitusEstDetector } from "./tool.js";

describe("hic-situs-est-detector", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runHicSitusEstDetector(hicSitusEstDetectorExample.input)).toEqual({
      ok: true,
      output: hicSitusEstDetectorExample.output,
    });
  });

  it("detects the masculine form", () => {
    const r = runHicSitusEstDetector({ text: "HIC SITUS EST" });
    expect(r.ok && r.output.gender === "masculine").toBe(true);
  });
  it("reports unknown when absent", () => {
    const r = runHicSitusEstDetector({ text: "no formula" });
    expect(r.ok && !r.output.present && r.output.gender === "unknown").toBe(
      true,
    );
  });
});
