import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateDarcyWeisbachPressureDrop, example } from "./tool.js";

describe("engineering/darcy-weisbach-pressure-drop", () => {
  it("matches its worked example", () => {
    expect(calculateDarcyWeisbachPressureDrop(example.input)).toEqual(
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
      tool.execute({ ...example.input, darcyFrictionFactor: Number.NaN }).ok,
    ).toBe(false);
  });
  it("matches an independently calculated reference", () => {
    expect(tool.execute(example.input)).toMatchObject({
      ok: true,
      output: { pressureDropPascals: 40000 },
    });
  });
});
