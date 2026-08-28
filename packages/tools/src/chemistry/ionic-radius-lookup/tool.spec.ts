import { describe, expect, it } from "vitest";
import { ionicRadiusLookupExample, runIonicRadiusLookup } from "./tool.js";

describe("Ionic Radius Lookup", () => {
  it("publishes an executable sodium example", () =>
    expect(runIonicRadiusLookup(ionicRadiusLookupExample.input)).toEqual({
      ok: true,
      output: ionicRadiusLookupExample.output,
    }));
  it("normalizes spacing and a Unicode minus sign", () =>
    expect(runIonicRadiusLookup({ ion: "Cl −" })).toEqual({
      ok: true,
      output: { ionicRadiusPm: 181 },
    }));
  it("rejects an ion without a six-coordinate table entry", () =>
    expect(runIonicRadiusLookup({ ion: "Xe+" })).toMatchObject({
      error: { issues: [{ code: "not_found", field: "ion" }] },
      ok: false,
    }));
});
