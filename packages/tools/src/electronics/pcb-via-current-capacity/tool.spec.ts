import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";
describe("PCB Via Current from Thermal Model", () => {
  it("matches the worked example", () =>
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("rejects an invalid input", () =>
    expect(tool.execute({ ...example.input, temperatureRiseC: null }).ok).toBe(
      false,
    ));
});
