import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateUtmZoneFromLongitude, example } from "./tool.js";

describe("cartography/utm-zone-from-longitude", () => {
  it("matches its worked example", () => {
    expect(calculateUtmZoneFromLongitude(example.input)).toEqual(
      example.output,
    );
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("assigns the western and eastern longitude limits to zones 1 and 60", () => {
    expect(tool.execute({ longitudeDegrees: -180 })).toEqual({
      ok: true,
      output: { utmZone: 1 },
    });
    expect(tool.execute({ longitudeDegrees: 180 })).toEqual({
      ok: true,
      output: { utmZone: 60 },
    });
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and nonfinite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, longitudeDegrees: Number.NaN }).ok,
    ).toBe(false);
  });
});
