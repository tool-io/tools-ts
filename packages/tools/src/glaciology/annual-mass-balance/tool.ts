import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly zoneAreasM2: readonly number[];
  readonly accumulationsMetersWaterEquivalent: readonly number[];
  readonly ablationsMetersWaterEquivalent: readonly number[];
}>;
export type Output = Readonly<{
  readonly zoneNetBalancesMwe: readonly number[];
  readonly netWaterVolumeM3: number;
  readonly specificNetBalanceMwe: number;
}>;
const inputFields = [
  { id: "zoneAreasM2", label: "Zone areas m2", kind: "numberList" },
  {
    id: "accumulationsMetersWaterEquivalent",
    label: "Accumulations meters water equivalent",
    kind: "numberList",
  },
  {
    id: "ablationsMetersWaterEquivalent",
    label: "Ablations meters water equivalent",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.zoneAreasM2.forEach((v) => positive(v, "zoneAreasM2"));
  input.accumulationsMetersWaterEquivalent.forEach((v) =>
    nonnegative(v, "accumulationsMetersWaterEquivalent"),
  );
  input.ablationsMetersWaterEquivalent.forEach((v) =>
    nonnegative(v, "ablationsMetersWaterEquivalent"),
  );
  aligned(
    input.zoneAreasM2,
    input.accumulationsMetersWaterEquivalent,
    "zoneAreasM2",
  );
  aligned(
    input.zoneAreasM2,
    input.ablationsMetersWaterEquivalent,
    "zoneAreasM2",
  );
  const zoneNetBalancesMwe = input.accumulationsMetersWaterEquivalent.map(
      (v, i) => v - input.ablationsMetersWaterEquivalent[i],
    ),
    netWaterVolumeM3 = zoneNetBalancesMwe.reduce(
      (s, v, i) => s + v * input.zoneAreasM2[i],
      0,
    );
  return {
    zoneNetBalancesMwe,
    netWaterVolumeM3,
    specificNetBalanceMwe:
      netWaterVolumeM3 / input.zoneAreasM2.reduce((a, b) => a + b, 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  zoneAreasM2: [100, 200],
  accumulationsMetersWaterEquivalent: [2, 1],
  ablationsMetersWaterEquivalent: [1, 2],
} satisfies Input;
export const exampleOutput = {
  zoneNetBalancesMwe: [1, -1],
  netWaterVolumeM3: -100,
  specificNetBalanceMwe: -0.3333333333333333,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/annual-mass-balance",
  title: "Annual Mass Balance",
  description:
    "Area-weight annual accumulation minus ablation over matched nonoverlapping glacier zones; quantities are water equivalent and negative balances are preserved.",
  inputs: inputFields,
  outputs: [
    {
      id: "zoneNetBalancesMwe",
      label: "Zone net balances mwe",
      kind: "numberList",
    },
    { id: "netWaterVolumeM3", label: "Net water volume m3", kind: "number" },
    {
      id: "specificNetBalanceMwe",
      label: "Specific net balance mwe",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      zoneAreasM2: value.zoneAreasM2 as readonly number[],
      accumulationsMetersWaterEquivalent:
        value.accumulationsMetersWaterEquivalent as readonly number[],
      ablationsMetersWaterEquivalent:
        value.ablationsMetersWaterEquivalent as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
