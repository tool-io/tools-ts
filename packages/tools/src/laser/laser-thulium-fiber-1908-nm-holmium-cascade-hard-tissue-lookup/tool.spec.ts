import { describe, expect, it } from "vitest";
import {
  thuliumHolmiumCascade,
  thuliumHolmiumCascadeExample as example,
  runThuliumHolmiumCascade,
} from "./tool.js";

describe("thulium-fiber and holmium:YAG water lookup", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runThuliumHolmiumCascade(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));

  it("returns each source without making a clinical recommendation", () => {
    const thulium = thuliumHolmiumCascade({ source: "tm-fiber-1908" });
    const holmium = thuliumHolmiumCascade({ source: "ho-yag-2090" });
    expect(thulium.wavelengthNm).toBe(1908);
    expect(thulium.penetrationDepthUm).toBeCloseTo(10000 / 120, 12);
    expect(holmium.penetrationDepthUm).toBeGreaterThan(
      thulium.penetrationDepthUm,
    );
    expect(holmium.note).toContain("not a treatment recommendation");
  });

  it("rejects undocumented sources", () =>
    expect(runThuliumHolmiumCascade({ source: "unknown" }).ok).toBe(false));
});
