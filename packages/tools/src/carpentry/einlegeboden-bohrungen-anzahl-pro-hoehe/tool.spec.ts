import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, {
  calculateEinlegebodenBohrungenAnzahlProHoehe,
  example,
} from "./tool.js";

describe("carpentry/einlegeboden-bohrungen-anzahl-pro-hoehe", () => {
  it("matches its worked example", () => {
    expect(calculateEinlegebodenBohrungenAnzahlProHoehe(example.input)).toEqual(
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
    expect(
      tool.execute({ ...example.input, firstCenterMm: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative firstCenterMm", () => {
    expect(tool.execute({ ...example.input, firstCenterMm: -1 }).ok).toBe(
      false,
    );
  });
});
