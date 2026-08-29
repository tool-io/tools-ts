import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";
describe("Zeta Potential from Henry Equation", () => {
  it("matches the worked example", () =>
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("rejects an invalid input", () =>
    expect(tool.execute({ ...example.input, mobilityM2PerVs: null }).ok).toBe(
      false,
    ));
});
