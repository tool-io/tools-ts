import { describe, expect, it } from "vitest";
import {
  runScrewPilotHole,
  screwPilotHoleExample,
  screwPilotHoleTool,
} from "./tool.js";

describe("Screw Pilot Hole Calculator", () => {
  it("computes the canonical example", () =>
    expect(runScrewPilotHole(screwPilotHoleExample.input)).toEqual({
      ok: true,
      output: { pilotHoleDiameterMm: 3, pilotHoleDepthMm: 24 },
    }));

  it("applies the default 4x30 screw when omitted", () =>
    expect(runScrewPilotHole({})).toEqual({
      ok: true,
      output: { pilotHoleDiameterMm: 3, pilotHoleDepthMm: 24 },
    }));

  it.each([
    [5, 40, 3.75, 34],
    [6, 60, 4.5, 54],
    [3, 20, 2.25, 14],
  ])(
    "drills for %p x %p screws at %p mm diameter and %p mm depth",
    (screwDiameterMm, screwLengthMm, pilotHoleDiameterMm, pilotHoleDepthMm) =>
      expect(runScrewPilotHole({ screwDiameterMm, screwLengthMm })).toEqual({
        ok: true,
        output: { pilotHoleDiameterMm, pilotHoleDepthMm },
      }),
  );

  it("keeps the 6 mm tip clearance for short screws", () =>
    expect(runScrewPilotHole({ screwDiameterMm: 4, screwLengthMm: 7 })).toEqual(
      { ok: true, output: { pilotHoleDiameterMm: 3, pilotHoleDepthMm: 1 } },
    ));

  it("rejects screws at or below the 6 mm tip clearance with screw_too_short", () => {
    const result = runScrewPilotHole({ screwDiameterMm: 4, screwLengthMm: 6 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toEqual({
        code: "screw_too_short",
        field: "screwLengthMm",
        message: "Screw length must exceed the 6 mm tip clearance.",
      });
    expect(runScrewPilotHole({ screwDiameterMm: 4, screwLengthMm: 5 }).ok).toBe(
      false,
    );
  });

  it("rejects non-positive screw diameters", () => {
    const zero = runScrewPilotHole({ screwDiameterMm: 0, screwLengthMm: 30 });
    expect(zero.ok).toBe(false);
    if (!zero.ok) expect(zero.error.issues[0]?.code).toBe("must_be_positive");
    expect(
      runScrewPilotHole({ screwDiameterMm: -4, screwLengthMm: 30 }).ok,
    ).toBe(false);
  });

  it("rejects non-positive screw lengths", () => {
    const result = runScrewPilotHole({ screwDiameterMm: 4, screwLengthMm: -1 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("must_be_positive");
    expect(runScrewPilotHole({ screwDiameterMm: 4, screwLengthMm: 0 }).ok).toBe(
      false,
    );
  });

  it("rejects non-finite and non-numeric inputs", () => {
    expect(runScrewPilotHole({ screwDiameterMm: Number.NaN }).ok).toBe(false);
    expect(
      runScrewPilotHole({ screwDiameterMm: 4, screwLengthMm: "30" } as never)
        .ok,
    ).toBe(false);
  });

  it("rejects unknown input fields", () => {
    const result = runScrewPilotHole({
      screwDiameterMm: 4,
      screwLengthMm: 30,
      threadPitchMm: 1.5,
    } as never);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });

  it("publishes a serializable and executable example", () => {
    expect(JSON.parse(JSON.stringify(screwPilotHoleExample))).toEqual(
      screwPilotHoleExample,
    );
    expect(screwPilotHoleTool.id).toBe(
      "carpentry/spanplattenschraube-4x30-vorbohrung-25mm",
    );
    expect(screwPilotHoleTool.execution).toEqual({ kind: "pure" });
  });
});
