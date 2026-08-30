import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateShutterAngleToShutterSpeed, example } from "./tool.js";

describe("film/shutter-angle-to-shutter-speed", () => {
  it("matches its worked example", () => {
    expect(calculateShutterAngleToShutterSpeed(example.input)).toEqual(
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
      tool.execute({ ...example.input, shutterAngleDegrees: Number.NaN }).ok,
    ).toBe(false);
  });
});
