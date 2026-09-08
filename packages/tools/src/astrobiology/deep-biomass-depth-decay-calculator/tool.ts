import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerCalibratedSurfaceDensityCellsPerCubicCm: number;
  readonly callerCalibratedDecayPerKm: number;
  readonly depthKm: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerCalibratedSurfaceDensityCellsPerCubicCm",
    label: "Caller calibrated surface density cells per cubic cm",
    kind: "number",
  },
  {
    id: "callerCalibratedDecayPerKm",
    label: "Caller calibrated decay per km",
    kind: "number",
  },
  { id: "depthKm", label: "Depth km", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.callerCalibratedSurfaceDensityCellsPerCubicCm, "density");
  nonnegative(input.callerCalibratedDecayPerKm, "decay");
  nonnegative(input.depthKm, "depth");
  return {
    conditionalBiomassDensityCellsPerCubicCm:
      input.callerCalibratedSurfaceDensityCellsPerCubicCm *
      Math.exp(-input.callerCalibratedDecayPerKm * input.depthKm),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerCalibratedSurfaceDensityCellsPerCubicCm: 100,
    callerCalibratedDecayPerKm: 1,
    depthKm: 1,
  },
  output: {
    result: { conditionalBiomassDensityCellsPerCubicCm: 36.787944117144235 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/deep-biomass-depth-decay-calculator",
  title: "Deep Subsurface Biomass Density Cells per cm3 Depth Decay Calculator",
  description:
    "Conditional exponential subsurface cell-density profile using independently calibrated same-environment reference. Not direct biomass measurement, universal depth law or extraterrestrial life abundance.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
