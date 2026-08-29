import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";
describe("ADC THD", () => {
  it("combines harmonic RMS levels", () =>
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("rejects empty harmonics", () =>
    expect(tool.execute({ fundamentalRms: 1, harmonicRms: [] }).ok).toBe(
      false,
    ));
});
