import { describe, expect, it } from "vitest";
import {
  runTransconductanceEfficiencyGmId,
  transconductanceEfficiencyGmIdExample,
} from "./tool.js";

describe("weak-inversion gm/ID efficiency", () => {
  it("reproduces the documented example", () =>
    expect(
      runTransconductanceEfficiencyGmId(
        transconductanceEfficiencyGmIdExample.input,
      ),
    ).toEqual({
      ok: true,
      output: transconductanceEfficiencyGmIdExample.output,
    }));
  it("halves when temperature doubles", () => {
    const result = runTransconductanceEfficiencyGmId({
      subthresholdIdealityFactor: 1,
      temperatureKelvin: 600,
    });
    expect(result.ok && result.output.gmOverIdPerVolt).toBeCloseTo(
      transconductanceEfficiencyGmIdExample.output.gmOverIdPerVolt / 2,
      12,
    );
  });
  it("rejects absolute zero", () =>
    expect(
      runTransconductanceEfficiencyGmId({ temperatureKelvin: 0 }),
    ).toMatchObject({ ok: false }));
});
