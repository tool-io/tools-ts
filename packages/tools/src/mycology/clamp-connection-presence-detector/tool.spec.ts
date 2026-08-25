import { describe, expect, it } from "vitest";
import {
  clampConnectionPresenceDetectorExample,
  runClampConnectionPresenceDetector,
} from "./tool.js";
describe("Clamp Presence Detector", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runClampConnectionPresenceDetector(
        clampConnectionPresenceDetectorExample.input,
      ),
    ).toEqual({
      ok: true,
      output: clampConnectionPresenceDetectorExample.output,
    });
  });
  it("does not infer aseptate hyphae when clamps are absent", () => {
    expect(
      runClampConnectionPresenceDetector({ clampsPresent: false }),
    ).toEqual({
      ok: true,
      output: {
        clampsPresent: false,
        hyphalImplication:
          "No clamp connections observed; absence does not establish that hyphae are aseptate or monokaryotic.",
      },
    });
  });
  it("rejects invalid input", () => {
    expect(
      runClampConnectionPresenceDetector({
        clampsPresent: "yes" as unknown as boolean,
      }).ok,
    ).toBe(false);
  });
});
