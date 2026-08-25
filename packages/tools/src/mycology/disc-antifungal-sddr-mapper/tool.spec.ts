import { describe, expect, it } from "vitest";
import {
  discSddrMapperExample,
  discSddrMapperTool,
  runDiscSddrMapper,
} from "./tool.js";

describe("Disc SDD/R Mapper", () => {
  const breakpoints = {
    resistantMaximumMm: 14,
    susceptibleMinimumMm: 20,
  };
  it("executes its canonical example to the exact published output", () => {
    expect(runDiscSddrMapper(discSddrMapperExample.input)).toEqual({
      ok: true,
      output: discSddrMapperExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(discSddrMapperExample))).toEqual(
      discSddrMapperExample,
    );
    expect(discSddrMapperTool.contractVersion).toBe(1);
    expect(discSddrMapperTool.execution).toEqual({ kind: "pure" });
  });

  it("uses the caller's inclusive resistant maximum", () => {
    for (const diameter of [0, 14]) {
      const result = runDiscSddrMapper({
        ...breakpoints,
        zoneDiameterMm: diameter,
      });
      expect(result.ok).toBe(true);
      if (result.ok) expect(result.output.zoneCategory).toBe("resistant");
    }
  });

  it("maps the interval between supplied breakpoints to SDD", () => {
    for (const diameter of [14.1, 19.5]) {
      const result = runDiscSddrMapper({
        ...breakpoints,
        zoneDiameterMm: diameter,
      });
      expect(result.ok).toBe(true);
      if (result.ok)
        expect(result.output.zoneCategory).toBe("susceptible-dose-dependent");
    }
  });

  it("classes zones of 20 mm and above as susceptible", () => {
    const boundary = runDiscSddrMapper({ ...breakpoints, zoneDiameterMm: 20 });
    expect(boundary.ok).toBe(true);
    if (boundary.ok) expect(boundary.output.zoneCategory).toBe("susceptible");
  });

  it("rejects negative zone diameters", () => {
    expect(runDiscSddrMapper({ ...breakpoints, zoneDiameterMm: -1 }).ok).toBe(
      false,
    );
  });

  it("rejects reversed breakpoints", () => {
    expect(
      runDiscSddrMapper({
        resistantMaximumMm: 20,
        susceptibleMinimumMm: 14,
        zoneDiameterMm: 17,
      }).ok,
    ).toBe(false);
  });

  it("returns structured errors for malformed input", () => {
    expect(runDiscSddrMapper(null).ok).toBe(false);
    expect(runDiscSddrMapper({ ...breakpoints, zoneDiameterMm: "22" }).ok).toBe(
      false,
    );
    expect(runDiscSddrMapper({ zoneCategory: "susceptible" }).ok).toBe(false);
  });
});
