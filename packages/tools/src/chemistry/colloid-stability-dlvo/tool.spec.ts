import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";
describe("DLVO Interaction Energy Estimate", () => {
  it("matches the worked example", () =>
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("rejects an invalid input", () =>
    expect(
      tool.execute({ ...example.input, repulsionAmplitudeJ: null }).ok,
    ).toBe(false));
  it("uses the sphere–plate Hamaker factor of one sixth", () => {
    const result = tool.execute({ ...example.input, repulsionAmplitudeJ: 0 });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.interactionEnergyJ).toBeCloseTo(
        -1.6666666666666667e-20,
        25,
      );
  });
});
