import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";
describe("Hall Voltage Sensitivity", () => {
  it("matches the worked example", () =>
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("rejects an invalid input", () =>
    expect(
      tool.execute({ ...example.input, carrierDensityPerM3: null }).ok,
    ).toBe(false));
});
