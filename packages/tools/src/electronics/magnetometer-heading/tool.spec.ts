import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateMagnetometerHeading, example } from "./tool.js";

describe("electronics/magnetometer-heading", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateMagnetometerHeading(example.input)).toEqual(example.output);
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and non-finite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(tool.execute({ ...example.input, xMicrotesla: Number.NaN }).ok).toBe(
      false,
    );
  });
  it("rejects an invalid domain combination", () => {
    const result = tool.execute({ xMicrotesla: 0, yMicrotesla: 0 });
    expect(result).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_value", field: "xMicrotesla" }] },
    });
  });
});
