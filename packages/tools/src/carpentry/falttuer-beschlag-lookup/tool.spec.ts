import { describe, expect, it } from "vitest";
import {
  foldingDoorHardwareExample,
  foldingDoorHardwareTool,
  runFoldingDoorHardware,
} from "./tool.js";

describe("Folding Door Hardware Count", () => {
  it("computes the canonical example", () =>
    expect(runFoldingDoorHardware(foldingDoorHardwareExample.input)).toEqual({
      ok: true,
      output: { hingeSets: 3, topTrackRunners: 2 },
    }));

  it.each([
    [2, 1, 1],
    [3, 2, 2],
    [5, 4, 3],
    [7, 6, 4],
  ])(
    "counts %p panels as %p hinge sets and %p runners",
    (panelCount, hingeSets, topTrackRunners) =>
      expect(runFoldingDoorHardware({ panelCount })).toEqual({
        ok: true,
        output: { hingeSets, topTrackRunners },
      }),
  );

  it("rounds runners up for odd panel counts", () =>
    expect(runFoldingDoorHardware({ panelCount: 9 })).toEqual({
      ok: true,
      output: { hingeSets: 8, topTrackRunners: 5 },
    }));

  it("rejects a single panel", () => {
    const result = runFoldingDoorHardware({ panelCount: 1 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects zero and negative panel counts", () => {
    expect(runFoldingDoorHardware({ panelCount: 0 }).ok).toBe(false);
    expect(runFoldingDoorHardware({ panelCount: -4 }).ok).toBe(false);
  });

  it("rejects fractional panel counts", () =>
    expect(runFoldingDoorHardware({ panelCount: 2.5 }).ok).toBe(false));

  it("rejects non-numeric panel counts", () =>
    expect(runFoldingDoorHardware({ panelCount: "4" } as never).ok).toBe(
      false,
    ));

  it("rejects a missing panel count", () =>
    expect(runFoldingDoorHardware({}).ok).toBe(false));

  it("rejects unknown input fields", () => {
    const result = runFoldingDoorHardware({
      panelCount: 4,
      trackLengthMm: 2000,
    } as never);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });

  it("publishes a serializable and executable example", () => {
    expect(JSON.parse(JSON.stringify(foldingDoorHardwareExample))).toEqual(
      foldingDoorHardwareExample,
    );
    expect(foldingDoorHardwareTool.id).toBe(
      "carpentry/falttuer-beschlag-lookup",
    );
    expect(foldingDoorHardwareTool.execution).toEqual({ kind: "pure" });
  });
});
