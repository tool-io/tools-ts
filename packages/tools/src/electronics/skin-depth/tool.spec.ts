import { describe, expect, it } from "vitest";
import { runSkinDepth, skinDepthExample } from "./tool.js";

describe("Skin Depth Copper", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runSkinDepth(skinDepthExample.input)).toEqual({
      ok: true,
      output: skinDepthExample.output,
    }));

  it("returns 65.2 um at one megahertz", () =>
    expect(runSkinDepth({ frequencyMHz: 1 })).toEqual({
      ok: true,
      output: { skinDepthMicrometers: 65.2 },
    }));

  it("returns half the depth at four times the frequency", () =>
    expect(runSkinDepth({ frequencyMHz: 400 })).toEqual({
      ok: true,
      output: { skinDepthMicrometers: 3.2600000000000002 },
    }));

  it("shrinks with increasing frequency", () => {
    const low = runSkinDepth({ frequencyMHz: 100 });
    const high = runSkinDepth({ frequencyMHz: 1000 });
    expect(low.ok).toBe(true);
    expect(high.ok).toBe(true);
    if (!low.ok || !high.ok) return;
    expect(high.output.skinDepthMicrometers).toBeLessThan(
      Number(low.output.skinDepthMicrometers),
    );
  });

  it("exceeds the depth of a higher band below it", () => {
    const deep = runSkinDepth({ frequencyMHz: 25 });
    const shallow = runSkinDepth({ frequencyMHz: 100 });
    expect(deep.ok).toBe(true);
    expect(shallow.ok).toBe(true);
    if (!deep.ok || !shallow.ok) return;
    expect(deep.output.skinDepthMicrometers).toBeGreaterThan(
      Number(shallow.output.skinDepthMicrometers),
    );
  });

  it("rejects zero frequency", () =>
    expect(runSkinDepth({ frequencyMHz: 0 })).toMatchObject({
      error: { issues: [{ code: "degenerate_input", field: "frequencyMHz" }] },
      ok: false,
    }));

  it("rejects negative frequency", () =>
    expect(runSkinDepth({ frequencyMHz: -10 })).toMatchObject({
      error: { issues: [{ code: "degenerate_input", field: "frequencyMHz" }] },
      ok: false,
    }));
});
