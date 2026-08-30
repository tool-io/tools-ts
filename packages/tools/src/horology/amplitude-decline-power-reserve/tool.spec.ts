import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, {
  calculateAmplitudeDeclinePowerReserve,
  example,
} from "./tool.js";

describe("horology/amplitude-decline-power-reserve", () => {
  it("matches its worked example", () => {
    expect(calculateAmplitudeDeclinePowerReserve(example.input)).toEqual(
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
      tool.execute({ ...example.input, startingAmplitudeDegrees: Number.NaN })
        .ok,
    ).toBe(false);
  });
});
