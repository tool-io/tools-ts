import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  ordered,
  regression,
} from "../shared.js";
export type Input = Readonly<{
  readonly sampleVolumeMl: number;
  readonly acidVolumesMl: readonly number[];
  readonly measuredPhValues: readonly number[];
  readonly acidConcentrationMolesPerLiter: number;
}>;
export type Output = Readonly<{
  readonly granEndpointVolumeMl: number;
  readonly alkalinityMilliequivalentsPerLiter: number;
  readonly granFitRSquared: number;
}>;
const inputFields = [
  { id: "sampleVolumeMl", label: "Sample volume ml", kind: "number" },
  { id: "acidVolumesMl", label: "Acid volumes ml", kind: "numberList" },
  { id: "measuredPhValues", label: "Measured ph values", kind: "numberList" },
  {
    id: "acidConcentrationMolesPerLiter",
    label: "Acid concentration moles per liter",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.sampleVolumeMl, "sampleVolumeMl");
  positive(
    input.acidConcentrationMolesPerLiter,
    "acidConcentrationMolesPerLiter",
  );
  input.acidVolumesMl.forEach((v) => nonnegative(v, "acidVolumesMl"));
  aligned(input.acidVolumesMl, input.measuredPhValues, "acidVolumesMl");
  ordered(input.acidVolumesMl, "acidVolumesMl");
  const gran = input.acidVolumesMl.map(
      (v, i) => (input.sampleVolumeMl + v) * 10 ** -input.measuredPhValues[i],
    ),
    fit = regression(input.acidVolumesMl, gran);
  positive(fit.slope, "measuredPhValues");
  const granEndpointVolumeMl = nonnegative(
    -fit.intercept / fit.slope,
    "granEndpoint",
  );
  if (granEndpointVolumeMl > input.acidVolumesMl[0])
    simpleError(
      "acidVolumesMl",
      "A post-equivalence acid Gran series is required.",
    );
  return {
    granEndpointVolumeMl,
    alkalinityMilliequivalentsPerLiter:
      (1000 * input.acidConcentrationMolesPerLiter * granEndpointVolumeMl) /
      input.sampleVolumeMl,
    granFitRSquared: fit.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sampleVolumeMl: 10,
  acidVolumesMl: [2, 3, 4],
  measuredPhValues: [
    3.0791812460476247, 2.8129133566428557, 2.6690067809585756,
  ],
  acidConcentrationMolesPerLiter: 0.1,
} satisfies Input;
export const exampleOutput = {
  granEndpointVolumeMl: 1,
  alkalinityMilliequivalentsPerLiter: 10,
  granFitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/gran-titration-alkalinity",
  title: "Gran Titration Alkalinity",
  description:
    "Fit the post-equivalence acid Gran function (Vs+Va)·10^(−pH) and extrapolate a nonnegative endpoint for monovalent acid alkalinity; activity corrections and endpoint validity require laboratory assessment.",
  inputs: inputFields,
  outputs: [
    {
      id: "granEndpointVolumeMl",
      label: "Gran endpoint volume ml",
      kind: "number",
    },
    {
      id: "alkalinityMilliequivalentsPerLiter",
      label: "Alkalinity milliequivalents per liter",
      kind: "number",
    },
    { id: "granFitRSquared", label: "Gran fit r squared", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      sampleVolumeMl: value.sampleVolumeMl as number,
      acidVolumesMl: value.acidVolumesMl as readonly number[],
      measuredPhValues: value.measuredPhValues as readonly number[],
      acidConcentrationMolesPerLiter:
        value.acidConcentrationMolesPerLiter as number,
    }),
});
export const run = tool.execute;
export default tool;
