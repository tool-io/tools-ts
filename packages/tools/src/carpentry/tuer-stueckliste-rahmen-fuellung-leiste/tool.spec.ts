import { describe, expect, it } from "vitest";
import { doorFrameBeadListExample, runDoorFrameBeadList } from "./tool.js";

describe("door frame bead list generator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDoorFrameBeadList(doorFrameBeadListExample.input)).toEqual({
      ok: true,
      output: doorFrameBeadListExample.output,
    });
  });

  it("defaults to a ten millimetre bead allowance", () => {
    expect(
      runDoorFrameBeadList({ doorWidthMm: 600, doorHeightMm: 2000 }),
    ).toEqual({
      ok: true,
      output: { beadLengthMm: 5240, framePieceCount: 4 },
    });
  });

  it("accepts a zero bead allowance", () => {
    expect(
      runDoorFrameBeadList({
        beadAllowanceMm: 0,
        doorHeightMm: 2000,
        doorWidthMm: 600,
      }),
    ).toEqual({
      ok: true,
      output: { beadLengthMm: 5200, framePieceCount: 4 },
    });
  });

  it("adds four allowances for the four mitred corners", () => {
    expect(
      runDoorFrameBeadList({
        beadAllowanceMm: 25,
        doorHeightMm: 2000,
        doorWidthMm: 600,
      }),
    ).toEqual({
      ok: true,
      output: { beadLengthMm: 5300, framePieceCount: 4 },
    });
  });

  it("computes a realistic interior door", () => {
    expect(
      runDoorFrameBeadList({
        beadAllowanceMm: 12,
        doorHeightMm: 1985,
        doorWidthMm: 885,
      }),
    ).toEqual({
      ok: true,
      output: { beadLengthMm: 5788, framePieceCount: 4 },
    });
  });

  it("rejects zero door width with the stable code", () => {
    const result = runDoorFrameBeadList({ doorWidthMm: 0, doorHeightMm: 2000 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_door_width");
  });

  it("rejects negative door height with the stable code", () => {
    const result = runDoorFrameBeadList({
      doorWidthMm: 600,
      doorHeightMm: -2000,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_door_height");
  });

  it("rejects negative bead allowance", () => {
    const result = runDoorFrameBeadList({
      beadAllowanceMm: -1,
      doorHeightMm: 2000,
      doorWidthMm: 600,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("requires both door dimensions", () => {
    expect(runDoorFrameBeadList({ doorWidthMm: 600 }).ok).toBe(false);
  });

  it("rejects unknown fields", () => {
    expect(
      runDoorFrameBeadList({
        doorWidthMm: 600,
        doorHeightMm: 2000,
        extra: true,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-finite dimensions", () => {
    expect(
      runDoorFrameBeadList({
        doorWidthMm: 600,
        doorHeightMm: Number.POSITIVE_INFINITY,
      }).ok,
    ).toBe(false);
  });
});
