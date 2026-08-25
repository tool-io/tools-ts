import { describe, expect, it } from "vitest";
import { cfuPerMlExample, runCfuPerMl } from "./tool.js";

describe("CFU Per mL", () => {
  it("matches the canonical example", () => {
    expect(runCfuPerMl(cfuPerMlExample.input)).toEqual({
      ok: true,
      output: cfuPerMlExample.output,
    });
  });
  it("defaults the dilution factor to 1", () =>
    expect(runCfuPerMl({ colonyCount: 120, platingVolumeMl: 2 })).toEqual({
      ok: true,
      output: { cfuPerMl: 60 },
    }));
  it("scales with the dilution factor", () =>
    expect(
      runCfuPerMl({
        colonyCount: 30,
        dilutionFactor: 10,
        platingVolumeMl: 0.5,
      }),
    ).toEqual({ ok: true, output: { cfuPerMl: 600 } }));
  it("allows zero colonies", () =>
    expect(
      runCfuPerMl({ colonyCount: 0, dilutionFactor: 100, platingVolumeMl: 1 }),
    ).toEqual({ ok: true, output: { cfuPerMl: 0 } }));
  it("rejects zero plating volume", () =>
    expect(runCfuPerMl({ colonyCount: 10, platingVolumeMl: 0 }).ok).toBe(
      false,
    ));
  it("rejects negative plating volume", () =>
    expect(runCfuPerMl({ colonyCount: 10, platingVolumeMl: -1 }).ok).toBe(
      false,
    ));
  it("rejects dilution factors below one", () =>
    expect(
      runCfuPerMl({ colonyCount: 10, dilutionFactor: 0.5, platingVolumeMl: 1 })
        .ok,
    ).toBe(false));
});
