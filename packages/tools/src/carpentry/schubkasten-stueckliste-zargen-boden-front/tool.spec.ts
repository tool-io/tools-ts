import { describe, expect, it } from "vitest";
import { drawerBoxPanelListExample, runDrawerBoxPanelList } from "./tool.js";

describe("drawer box panel list generator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDrawerBoxPanelList(drawerBoxPanelListExample.input)).toEqual({
      ok: true,
      output: drawerBoxPanelListExample.output,
    });
  });

  it("keeps the documented panel counts for any size", () => {
    expect(
      runDrawerBoxPanelList({
        frontWidthMm: 250,
        boxDepthMm: 350,
        sideHeightMm: 100,
      }),
    ).toEqual({
      ok: true,
      output: {
        backCount: 1,
        bottomCount: 1,
        frontCount: 1,
        sideCount: 2,
        totalEdgeLengthMm: 1400,
      },
    });
  });

  it("computes a narrow tall drawer", () => {
    expect(
      runDrawerBoxPanelList({
        frontWidthMm: 150,
        boxDepthMm: 450,
        sideHeightMm: 200,
      }),
    ).toEqual({
      ok: true,
      output: {
        backCount: 1,
        bottomCount: 1,
        frontCount: 1,
        sideCount: 2,
        totalEdgeLengthMm: 1600,
      },
    });
  });

  it("rejects zero front width with the stable code", () => {
    const result = runDrawerBoxPanelList({
      frontWidthMm: 0,
      boxDepthMm: 500,
      sideHeightMm: 150,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_front_width");
  });

  it("rejects negative box depth with the stable code", () => {
    const result = runDrawerBoxPanelList({
      frontWidthMm: 400,
      boxDepthMm: -10,
      sideHeightMm: 150,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_box_depth");
  });

  it("rejects zero side height with the stable code", () => {
    const result = runDrawerBoxPanelList({
      frontWidthMm: 400,
      boxDepthMm: 500,
      sideHeightMm: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_side_height");
  });

  it("requires every dimension", () => {
    expect(
      runDrawerBoxPanelList({ frontWidthMm: 400, boxDepthMm: 500 }).ok,
    ).toBe(false);
  });

  it("rejects unknown fields", () => {
    const result = runDrawerBoxPanelList({
      frontWidthMm: 400,
      boxDepthMm: 500,
      sideHeightMm: 150,
      extra: 1,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });

  it("rejects non-numeric dimensions", () => {
    const result = runDrawerBoxPanelList({
      frontWidthMm: "400",
      boxDepthMm: 500,
      sideHeightMm: 150,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects non-finite dimensions", () => {
    expect(
      runDrawerBoxPanelList({
        frontWidthMm: Number.NaN,
        boxDepthMm: 500,
        sideHeightMm: 150,
      }).ok,
    ).toBe(false);
  });
});
