import { describe, expect, it } from "vitest";
import {
  richterMagnitudeFromAmplitudeExample,
  runRichterMagnitudeFromAmplitude,
} from "./tool.js";

describe("richter-magnitude-from-amplitude", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runRichterMagnitudeFromAmplitude(
        richterMagnitudeFromAmplitudeExample.input,
      ),
    ).toEqual({
      ok: true,
      output: richterMagnitudeFromAmplitudeExample.output,
    });
  });

  it("gives a tenfold amplitude ratio one magnitude unit", () => {
    const result = runRichterMagnitudeFromAmplitude({
      amplitudeMillimeters: 10,
      referenceAmplitudeMillimeters: 1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.localMagnitude as number).toBe(1);
  });
  it("rejects non-positive amplitudes", () => {
    expect(
      runRichterMagnitudeFromAmplitude({ amplitudeMillimeters: 0 }).ok,
    ).toBe(false);
  });
});
