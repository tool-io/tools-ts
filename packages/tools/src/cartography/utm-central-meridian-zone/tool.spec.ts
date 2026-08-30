import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateUtmCentralMeridianZone, example } from "./tool.js";

describe("cartography/utm-central-meridian-zone", () => {
  it("matches its worked example", () => {
    expect(calculateUtmCentralMeridianZone(example.input)).toEqual(
      example.output,
    );
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and nonfinite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(tool.execute({ ...example.input, utmZone: Number.NaN }).ok).toBe(
      false,
    );
  });
});
