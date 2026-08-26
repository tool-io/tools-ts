import { describe, expect, it } from "vitest";
import {
  runWindowGlazingRebateLookup,
  windowGlazingRebateExample,
  windowGlazingRebateLookupTool,
} from "./tool.js";

describe("Window Glazing Rebate Lookup", () => {
  it("computes the canonical example", () =>
    expect(
      runWindowGlazingRebateLookup(windowGlazingRebateExample.input),
    ).toEqual({
      ok: true,
      output: {
        frameDepthMm: 70,
        glazingRebateDepthMm: 16,
        glazingRebateWidthMm: 12,
      },
    }));

  it("looks up euroframe-60", () =>
    expect(
      runWindowGlazingRebateLookup({ profileSystem: "euroframe-60" }),
    ).toEqual({
      ok: true,
      output: {
        frameDepthMm: 60,
        glazingRebateDepthMm: 15,
        glazingRebateWidthMm: 12,
      },
    }));

  it("looks up euroframe-70", () =>
    expect(
      runWindowGlazingRebateLookup({ profileSystem: "euroframe-70" }),
    ).toEqual({
      ok: true,
      output: {
        frameDepthMm: 70,
        glazingRebateDepthMm: 16,
        glazingRebateWidthMm: 12,
      },
    }));

  it("covers every documented profile system", () => {
    for (const profileSystem of ["euroframe-60", "euroframe-70"] as const) {
      const result = runWindowGlazingRebateLookup({ profileSystem });
      expect(result.ok).toBe(true);
    }
  });

  it("keeps the rebate width constant across systems", () => {
    for (const profileSystem of ["euroframe-60", "euroframe-70"] as const) {
      const result = runWindowGlazingRebateLookup({ profileSystem });
      if (result.ok) expect(result.output.glazingRebateWidthMm).toBe(12);
    }
  });

  it("rejects unsupported profile systems", () => {
    const result = runWindowGlazingRebateLookup({
      profileSystem: "euroframe-50",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.field).toBe("profileSystem");
  });

  it("rejects differently cased profile systems", () =>
    expect(
      runWindowGlazingRebateLookup({ profileSystem: "Euroframe-60" }).ok,
    ).toBe(false));

  it("requires the profile system", () =>
    expect(runWindowGlazingRebateLookup({}).ok).toBe(false));

  it("rejects non-string profile systems", () =>
    expect(
      runWindowGlazingRebateLookup({ profileSystem: 60 } as never).ok,
    ).toBe(false));

  it("rejects unknown input fields", () => {
    const result = runWindowGlazingRebateLookup({
      glassThicknessMm: 24,
      profileSystem: "euroframe-60",
    } as never);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });

  it("publishes a serializable and executable example", () => {
    expect(JSON.parse(JSON.stringify(windowGlazingRebateExample))).toEqual(
      windowGlazingRebateExample,
    );
    expect(windowGlazingRebateLookupTool.id).toBe(
      "carpentry/fenster-blendrahmen-fluegel-glasfalz",
    );
    expect(windowGlazingRebateLookupTool.execution).toEqual({
      kind: "pure",
    });
    expect(
      windowGlazingRebateLookupTool.inputSchema.properties?.profileSystem.enum,
    ).toEqual(["euroframe-60", "euroframe-70"]);
  });
});
