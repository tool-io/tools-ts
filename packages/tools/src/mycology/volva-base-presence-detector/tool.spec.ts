import { describe, expect, it } from "vitest";
import {
  runVolvaBasePresenceDetector,
  volvaBasePresenceDetectorExample,
  volvaBasePresenceDetectorTool,
} from "./tool.js";

describe("volvaBasePresenceDetectorTool", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runVolvaBasePresenceDetector(volvaBasePresenceDetectorExample.input),
    ).toEqual({
      ok: true,
      output: volvaBasePresenceDetectorExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(
      JSON.parse(JSON.stringify(volvaBasePresenceDetectorExample)),
    ).toEqual(volvaBasePresenceDetectorExample);
    expect(volvaBasePresenceDetectorTool.contractVersion).toBe(1);
    expect(volvaBasePresenceDetectorTool.execution).toEqual({ kind: "pure" });
  });

  it("reports a sac-like volva as present", () => {
    const r = runVolvaBasePresenceDetector({ volva: "present-sac-like" });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.hasVolva).toBe(true);
    expect(r.output.volvaState).toBe("present-sac-like");
  });

  it("reports a scaly volva as present", () => {
    const r = runVolvaBasePresenceDetector({ volva: "present-scaly" });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.hasVolva).toBe(true);
    expect(r.output.volvaState).toBe("present-scaly");
  });

  it("reports an absent volva as absent", () => {
    const r = runVolvaBasePresenceDetector({ volva: "absent" });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.hasVolva).toBe(false);
    expect(r.output.volvaState).toBe("absent");
  });

  it("rejects unknown states", () => {
    expect(runVolvaBasePresenceDetector({ volva: "cup" }).ok).toBe(false);
    expect(runVolvaBasePresenceDetector({ volva: "" }).ok).toBe(false);
  });

  it("rejects malformed input", () => {
    expect(runVolvaBasePresenceDetector(null).ok).toBe(false);
    expect(runVolvaBasePresenceDetector({ volva: false }).ok).toBe(false);
    expect(
      runVolvaBasePresenceDetector({
        ...volvaBasePresenceDetectorExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
