import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";
describe("Resistor Temperature-Coefficient Drift", () => {
  it("matches the worked example", () =>
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("rejects an invalid input", () =>
    expect(
      tool.execute({ ...example.input, referenceResistanceOhm: null }).ok,
    ).toBe(false));
});
