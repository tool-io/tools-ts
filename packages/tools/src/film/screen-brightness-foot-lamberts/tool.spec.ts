import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, {
  calculateScreenBrightnessFootLamberts,
  example,
} from "./tool.js";

describe("film/screen-brightness-foot-lamberts", () => {
  it("matches its worked example", () => {
    expect(calculateScreenBrightnessFootLamberts(example.input)).toEqual(
      example.output,
    );
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("uses projector lumens per square foot with screen gain", () => {
    expect(
      tool.execute({
        projectorLumens: 2000,
        screenGain: 1.2,
        screenAreaSquareFeet: 100,
      }),
    ).toEqual({ ok: true, output: { brightnessFootLamberts: 24 } });
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and nonfinite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, projectorLumens: Number.NaN }).ok,
    ).toBe(false);
  });
});
