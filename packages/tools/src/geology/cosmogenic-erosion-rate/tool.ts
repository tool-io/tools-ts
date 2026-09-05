import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly measuredSteadyInventoryAtomsG: number;
  readonly surfaceProductionAtomsGYear: number;
  readonly decayPerYear: number;
  readonly attenuationGCM2: number;
  readonly rockDensityGCM3: number;
}>;
export type Output = Readonly<{ readonly steadyErosionCMYear: number }>;
const inputFields = [
  {
    id: "measuredSteadyInventoryAtomsG",
    label: "Measured steady inventory atoms g",
    kind: "number",
  },
  {
    id: "surfaceProductionAtomsGYear",
    label: "Surface production atoms g year",
    kind: "number",
  },
  { id: "decayPerYear", label: "Decay per year", kind: "number" },
  { id: "attenuationGCM2", label: "Attenuation g c m2", kind: "number" },
  { id: "rockDensityGCM3", label: "Rock density g c m3", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.measuredSteadyInventoryAtomsG,
    "measuredSteadyInventoryAtomsG",
  );
  positive(input.surfaceProductionAtomsGYear, "surfaceProductionAtomsGYear");
  positive(input.attenuationGCM2, "attenuationGCM2");
  positive(input.rockDensityGCM3, "rockDensityGCM3");
  nonnegative(input.decayPerYear, "decayPerYear");
  const loss = nonnegative(
    input.surfaceProductionAtomsGYear / input.measuredSteadyInventoryAtomsG -
      input.decayPerYear,
    "steady erosion branch",
  );
  return {
    steadyErosionCMYear: (input.attenuationGCM2 / input.rockDensityGCM3) * loss,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredSteadyInventoryAtomsG: 10,
  surfaceProductionAtomsGYear: 20,
  decayPerYear: 1,
  attenuationGCM2: 2,
  rockDensityGCM3: 2,
} satisfies Input;
export const exampleOutput = { steadyErosionCMYear: 1 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/cosmogenic-erosion-rate",
  title: "Geology Cosmogenic Erosion Rate Calculator",
  description:
    "Steady single-production exponential erosion inversion, independently steady state/full shielding history assumed; negative erosion branch refused, not exposure age. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "steadyErosionCMYear",
      label: "Steady erosion c m year",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredSteadyInventoryAtomsG:
        value.measuredSteadyInventoryAtomsG as number,
      surfaceProductionAtomsGYear: value.surfaceProductionAtomsGYear as number,
      decayPerYear: value.decayPerYear as number,
      attenuationGCM2: value.attenuationGCM2 as number,
      rockDensityGCM3: value.rockDensityGCM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
