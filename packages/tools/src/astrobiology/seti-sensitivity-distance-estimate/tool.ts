import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly isotropicSpectralPowerWPerHz: number;
  readonly thresholdJy: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "isotropicSpectralPowerWPerHz",
    label: "Isotropic spectral power w per hz",
    kind: "number",
  },
  { id: "thresholdJy", label: "Threshold jy", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  nonnegative(i.isotropicSpectralPowerWPerHz, "power");
  positive(i.thresholdJy, "threshold");
  return {
    conditionalDistanceMeters: Math.sqrt(
      i.isotropicSpectralPowerWPerHz / (4 * Math.PI * i.thresholdJy * 1e-26),
    ),
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    isotropicSpectralPowerWPerHz: 1.2566370614359172e-19,
    thresholdJy: 1,
  },
  output: { result: { conditionalDistanceMeters: 1000 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/seti-sensitivity-distance-estimate",
  title: "SETI Sensitivity Jansky Threshold Distance Estimate Calculator",
  description:
    "Isotropic spectral-luminosity range at caller independently established flux-density threshold; Jy=1e-26 W m^-2 Hz^-1, no detection certainty.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { conditionalDistanceMeters: { type: "number" } },
        required: ["conditionalDistanceMeters"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
