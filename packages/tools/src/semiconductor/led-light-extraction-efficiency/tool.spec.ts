import { describe, expect, it } from "vitest";
import {
  ledLightExtractionEfficiencyExample,
  runLedLightExtractionEfficiency,
} from "./tool.js";

describe("led light extraction efficiency calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runLedLightExtractionEfficiency(
        ledLightExtractionEfficiencyExample.input,
      ),
    ).toEqual({ ok: true, output: ledLightExtractionEfficiencyExample.output });
  });

  it("returns one hundred percent when every photon escapes", () => {
    const result = runLedLightExtractionEfficiency({
      extractedPhotonCount: 250,
      generatedPhotonCount: 250,
    });
    expect(result).toEqual({
      ok: true,
      output: { extractionEfficiencyPercent: 100 },
    });
  });

  it("returns zero percent when no photon escapes", () => {
    const result = runLedLightExtractionEfficiency({
      extractedPhotonCount: 0,
      generatedPhotonCount: 100,
    });
    expect(result).toEqual({
      ok: true,
      output: { extractionEfficiencyPercent: 0 },
    });
  });

  it("handles fractional photon counts", () => {
    const result = runLedLightExtractionEfficiency({
      extractedPhotonCount: 1,
      generatedPhotonCount: 3,
    });
    expect(result).toEqual({
      ok: true,
      output: { extractionEfficiencyPercent: 33.33333333333333 },
    });
  });

  it("scales linearly with extracted count", () => {
    const one = runLedLightExtractionEfficiency({
      extractedPhotonCount: 10,
      generatedPhotonCount: 200,
    });
    const two = runLedLightExtractionEfficiency({
      extractedPhotonCount: 20,
      generatedPhotonCount: 200,
    });
    if (!one.ok || !two.ok) throw new Error("expected success");
    expect(two.output.extractionEfficiencyPercent as number).toBe(
      2 * (one.output.extractionEfficiencyPercent as number),
    );
  });

  it("rejects a non-positive generated count", () => {
    for (const generated of [0, -100])
      expect(
        runLedLightExtractionEfficiency({
          extractedPhotonCount: 80,
          generatedPhotonCount: generated,
        }),
      ).toMatchObject({
        error: { issues: [{ code: "invalid_field" }] },
        ok: false,
      });
  });

  it("rejects an extracted count above the generated count", () => {
    expect(
      runLedLightExtractionEfficiency({
        extractedPhotonCount: 101,
        generatedPhotonCount: 100,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_extracted" }] },
      ok: false,
    });
  });

  it("rejects a negative extracted count", () => {
    expect(
      runLedLightExtractionEfficiency({
        extractedPhotonCount: -1,
        generatedPhotonCount: 100,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    });
  });

  it("rejects missing and unknown fields", () => {
    expect(
      runLedLightExtractionEfficiency({ generatedPhotonCount: 100 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    });
    expect(
      runLedLightExtractionEfficiency({
        extractedPhotonCount: 80,
        generatedPhotonCount: 100,
        total: 180,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "total" }] },
      ok: false,
    });
  });
});
