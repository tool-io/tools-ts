import { describe, expect, it } from "vitest";
import {
  doorFloorClearanceExample,
  doorFloorClearanceTool,
  runDoorFloorClearance,
} from "./tool.js";

describe("Door Floor Clearance Calculator", () => {
  it("computes the canonical example with the default clearance", () =>
    expect(runDoorFloorClearance(doorFloorClearanceExample.input)).toEqual({
      ok: true,
      output: { finishedLeafHeightMm: 1978 },
    }));

  it("applies the default 7 mm clearance", () =>
    expect(runDoorFloorClearance({ openingHeightMm: 2000 })).toEqual({
      ok: true,
      output: { finishedLeafHeightMm: 1993 },
    }));

  it("honors an explicit clearance", () =>
    expect(
      runDoorFloorClearance({ floorClearanceMm: 10, openingHeightMm: 1985 }),
    ).toEqual({
      ok: true,
      output: { finishedLeafHeightMm: 1975 },
    }));

  it("allows a zero clearance", () =>
    expect(
      runDoorFloorClearance({ floorClearanceMm: 0, openingHeightMm: 2000 }),
    ).toEqual({
      ok: true,
      output: { finishedLeafHeightMm: 2000 },
    }));

  it("accepts the maximum 30 mm clearance", () =>
    expect(
      runDoorFloorClearance({ floorClearanceMm: 30, openingHeightMm: 2100 }),
    ).toEqual({
      ok: true,
      output: { finishedLeafHeightMm: 2070 },
    }));

  it("rejects a clearance larger than the opening", () => {
    const result = runDoorFloorClearance({ openingHeightMm: 5 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("clearance_too_large");
  });

  it("rejects a clearance that consumes the whole opening", () => {
    const result = runDoorFloorClearance({
      floorClearanceMm: 30,
      openingHeightMm: 30,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("clearance_too_large");
  });

  it("rejects non-positive opening heights", () => {
    const zero = runDoorFloorClearance({ openingHeightMm: 0 });
    const negative = runDoorFloorClearance({ openingHeightMm: -1985 });
    expect(zero.ok).toBe(false);
    expect(negative.ok).toBe(false);
    if (!zero.ok) expect(zero.error.issues[0]?.code).toBe("must_be_positive");
  });

  it("rejects clearances above 30 mm", () => {
    const result = runDoorFloorClearance({
      floorClearanceMm: 31,
      openingHeightMm: 2000,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects negative clearances and non-finite inputs", () => {
    expect(
      runDoorFloorClearance({ floorClearanceMm: -1, openingHeightMm: 2000 }).ok,
    ).toBe(false);
    expect(runDoorFloorClearance({ openingHeightMm: Number.NaN }).ok).toBe(
      false,
    );
  });

  it("rejects a missing opening height", () =>
    expect(runDoorFloorClearance({}).ok).toBe(false));

  it("rejects unknown input fields", () => {
    const result = runDoorFloorClearance({
      leafThicknessMm: 40,
      openingHeightMm: 1985,
    } as never);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });

  it("publishes a serializable and executable example", () => {
    expect(JSON.parse(JSON.stringify(doorFloorClearanceExample))).toEqual(
      doorFloorClearanceExample,
    );
    expect(doorFloorClearanceTool.id).toBe("carpentry/tuer-luft-unten-7mm");
    expect(doorFloorClearanceTool.execution).toEqual({ kind: "pure" });
    expect(
      doorFloorClearanceTool.inputSchema.properties?.floorClearanceMm.default,
    ).toBe(7);
  });
});
