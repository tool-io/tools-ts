import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly independentlySeparatedRadiativeRatePerVolumeSecond: number;
  readonly actualElectronVolumeDensity: number;
  readonly actualHoleVolumeDensity: number;
  readonly verifiedIntrinsicDensitySquared: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlySeparatedRadiativeRatePerVolumeSecond",
    label: "Independently separated radiative rate per volume second",
    kind: "number",
  },
  {
    id: "actualElectronVolumeDensity",
    label: "Actual electron volume density",
    kind: "number",
  },
  {
    id: "actualHoleVolumeDensity",
    label: "Actual hole volume density",
    kind: "number",
  },
  {
    id: "verifiedIntrinsicDensitySquared",
    label: "Verified intrinsic density squared",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  [
    input.independentlySeparatedRadiativeRatePerVolumeSecond,
    input.actualElectronVolumeDensity,
    input.actualHoleVolumeDensity,
    input.verifiedIntrinsicDensitySquared,
  ].forEach((v) => nonnegative(v, "density-or-rate"));
  const d = positive(
    input.actualElectronVolumeDensity * input.actualHoleVolumeDensity -
      input.verifiedIntrinsicDensitySquared,
    "net-carrier-product",
  );
  return {
    conditionalBimolecularCoefficient:
      input.independentlySeparatedRadiativeRatePerVolumeSecond / d,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlySeparatedRadiativeRatePerVolumeSecond: 3,
    actualElectronVolumeDensity: 2,
    actualHoleVolumeDensity: 2,
    verifiedIntrinsicDensitySquared: 1,
  },
  output: { result: { conditionalBimolecularCoefficient: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/radiative-recombination-coefficient-bimolecular",
  title:
    "Semiconductor Radiative Recombination Coefficient Bimolecular Calculator",
  description:
    "Explicit B=Rrad/(np\u2212ni\u00b2) using actual independently separated net radiative rate and compatible volume units. Not infer radiative rate from total decay or presume n=p.",
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
