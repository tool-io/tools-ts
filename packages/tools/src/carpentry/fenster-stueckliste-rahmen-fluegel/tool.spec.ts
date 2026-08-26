import { describe, expect, it } from "vitest";
import { runWindowFrameList, windowFrameListExample } from "./tool.js";

describe("window frame list generator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runWindowFrameList(windowFrameListExample.input)).toEqual({
      ok: true,
      output: windowFrameListExample.output,
    });
  });

  it("defaults to two sashes per frame", () => {
    expect(
      runWindowFrameList({
        frameOuterWidthMm: 1000,
        frameOuterHeightMm: 1200,
      }),
    ).toEqual({
      ok: true,
      output: {
        framePieceCount: 4,
        glazingBeadLengthMm: 4400,
        sashPerFrame: 2,
      },
    });
  });

  it("supports a single-sash window", () => {
    expect(
      runWindowFrameList({
        frameOuterWidthMm: 600,
        frameOuterHeightMm: 900,
        sashCount: 1,
      }),
    ).toEqual({
      ok: true,
      output: {
        framePieceCount: 4,
        glazingBeadLengthMm: 3000,
        sashPerFrame: 1,
      },
    });
  });

  it("supports three sashes", () => {
    expect(
      runWindowFrameList({
        frameOuterWidthMm: 800,
        frameOuterHeightMm: 1000,
        sashCount: 3,
      }),
    ).toEqual({
      ok: true,
      output: {
        framePieceCount: 4,
        glazingBeadLengthMm: 3600,
        sashPerFrame: 3,
      },
    });
  });

  it("accepts the single sash boundary", () => {
    const result = runWindowFrameList({
      frameOuterWidthMm: 500,
      frameOuterHeightMm: 500,
      sashCount: 1,
    });
    expect(result.ok).toBe(true);
  });

  it("rejects zero frame width with the stable code", () => {
    const result = runWindowFrameList({
      frameOuterWidthMm: 0,
      frameOuterHeightMm: 1200,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_frame_width");
  });

  it("rejects zero frame height with the stable code", () => {
    const result = runWindowFrameList({
      frameOuterWidthMm: 1000,
      frameOuterHeightMm: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_frame_height");
  });

  it("rejects a sash count below one", () => {
    const result = runWindowFrameList({
      frameOuterWidthMm: 1000,
      frameOuterHeightMm: 1200,
      sashCount: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects a fractional sash count", () => {
    expect(
      runWindowFrameList({
        frameOuterWidthMm: 1000,
        frameOuterHeightMm: 1200,
        sashCount: 2.5,
      }).ok,
    ).toBe(false);
  });

  it("requires both frame dimensions", () => {
    expect(runWindowFrameList({ frameOuterWidthMm: 1000 }).ok).toBe(false);
  });

  it("rejects unknown fields", () => {
    expect(
      runWindowFrameList({
        frameOuterWidthMm: 1000,
        frameOuterHeightMm: 1200,
        glazing: true,
      }).ok,
    ).toBe(false);
  });
});
