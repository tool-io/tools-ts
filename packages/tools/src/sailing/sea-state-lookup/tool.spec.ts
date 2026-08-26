import { describe, expect, it } from "vitest";
import { runSeaStateLookup, seaStateLookupExample } from "./tool.js";

describe("Douglas Sea State Lookup", () => {
  it("calculates the canonical example exactly", () => {
    expect(runSeaStateLookup(seaStateLookupExample.input)).toEqual({
      ok: true,
      output: { douglasState: 4 },
    });
  });

  it("classifies zero height as a calm glassy sea", () => {
    expect(runSeaStateLookup({ significantWaveHeightMeters: 0 })).toEqual({
      ok: true,
      output: { douglasState: 0 },
    });
  });

  it("maps one tenth of a meter to state one and just above to two", () => {
    expect(runSeaStateLookup({ significantWaveHeightMeters: 0.1 })).toEqual({
      ok: true,
      output: { douglasState: 1 },
    });
    expect(runSeaStateLookup({ significantWaveHeightMeters: 0.11 })).toEqual({
      ok: true,
      output: { douglasState: 2 },
    });
  });

  it("treats the one and a quarter bound inclusively", () => {
    expect(runSeaStateLookup({ significantWaveHeightMeters: 1.25 })).toEqual({
      ok: true,
      output: { douglasState: 3 },
    });
  });

  it("keeps fourteen meters at state eight and above it at nine", () => {
    expect(runSeaStateLookup({ significantWaveHeightMeters: 14 })).toEqual({
      ok: true,
      output: { douglasState: 8 },
    });
    expect(runSeaStateLookup({ significantWaveHeightMeters: 14.1 })).toEqual({
      ok: true,
      output: { douglasState: 9 },
    });
  });

  it("classifies six meters as rough state six", () => {
    expect(runSeaStateLookup({ significantWaveHeightMeters: 6 })).toEqual({
      ok: true,
      output: { douglasState: 6 },
    });
  });

  it("rejects negative heights at the schema level", () => {
    expect(
      runSeaStateLookup({ significantWaveHeightMeters: -0.5 }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "invalid_field", field: "significantWaveHeightMeters" },
        ],
      },
      ok: false,
    });
  });

  it("rejects non-finite heights", () => {
    expect(
      runSeaStateLookup({
        significantWaveHeightMeters: Number.POSITIVE_INFINITY,
      }).ok,
    ).toBe(false);
  });

  it("rejects unknown fields", () => {
    expect(
      runSeaStateLookup({
        swellHeightMeters: 1,
        significantWaveHeightMeters: 2,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "unknown_field", field: "swellHeightMeters" }],
      },
      ok: false,
    });
  });

  it("rejects null input and missing fields", () => {
    expect(runSeaStateLookup(null).ok).toBe(false);
    expect(runSeaStateLookup({}).ok).toBe(false);
  });
});
