import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyResolvedAdsorbedGasVolumePerMass: number;
  readonly actualIndependentlyResolvedFreeGasVolumePerMass: number;
  readonly actualIndependentlyResolvedDissolvedGasVolumePerMass: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyResolvedAdsorbedGasVolumePerMass",
    label: "Actual independently resolved adsorbed gas volume per mass",
    kind: "number",
  },
  {
    id: "actualIndependentlyResolvedFreeGasVolumePerMass",
    label: "Actual independently resolved free gas volume per mass",
    kind: "number",
  },
  {
    id: "actualIndependentlyResolvedDissolvedGasVolumePerMass",
    label: "Actual independently resolved dissolved gas volume per mass",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  [
    input.actualIndependentlyResolvedAdsorbedGasVolumePerMass,
    input.actualIndependentlyResolvedFreeGasVolumePerMass,
    input.actualIndependentlyResolvedDissolvedGasVolumePerMass,
  ].forEach((v) => nonnegative(v, "gascomponent"));
  return {
    observedSameReferenceTotalShaleGasVolumePerMass:
      input.actualIndependentlyResolvedAdsorbedGasVolumePerMass +
      input.actualIndependentlyResolvedFreeGasVolumePerMass +
      input.actualIndependentlyResolvedDissolvedGasVolumePerMass,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIndependentlyResolvedAdsorbedGasVolumePerMass: 2,
    actualIndependentlyResolvedFreeGasVolumePerMass: 3,
    actualIndependentlyResolvedDissolvedGasVolumePerMass: 1,
  },
  output: { result: { observedSameReferenceTotalShaleGasVolumePerMass: 6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/geomechanics-shale-gas-total-gas-content",
  title: "Geology Geomechanics Shale Gas Total Gas Content Calculator",
  description:
    "Actual independently partitioned adsorbed/free/dissolved shale gas on SAMEstandard-volume/mass basis, signed-free nonnegative inventory. No infer components, resource recovery or reservoir capacity from porosity alone.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
