import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  count,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly lagPhaseClusterMassesKg: readonly number[];
  readonly callerMaturityMassFactors: readonly number[];
  readonly representedClusterCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly modelMatureClusterMassesKg: readonly number[];
  readonly modelBlockMatureYieldTonnes: number;
}>;
const inputFields = [
  {
    id: "lagPhaseClusterMassesKg",
    label: "Lag phase cluster masses kg",
    kind: "numberList",
  },
  {
    id: "callerMaturityMassFactors",
    label: "Caller maturity mass factors",
    kind: "numberList",
  },
  {
    id: "representedClusterCounts",
    label: "Represented cluster counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerMaturityMassFactors.forEach((v) =>
    positive(v, "callerMaturityMassFactors"),
  );
  input.lagPhaseClusterMassesKg.forEach((v) =>
    nonnegative(v, "lagPhaseClusterMassesKg"),
  );
  input.representedClusterCounts.forEach((v) =>
    count(v, "representedClusterCounts"),
  );
  aligned(
    input.lagPhaseClusterMassesKg,
    input.callerMaturityMassFactors,
    "lagPhaseClusterMassesKg",
  );
  aligned(
    input.lagPhaseClusterMassesKg,
    input.representedClusterCounts,
    "lagPhaseClusterMassesKg",
  );
  const modelMatureClusterMassesKg = input.lagPhaseClusterMassesKg.map(
    (v, i) => v * input.callerMaturityMassFactors[i],
  );
  return {
    modelMatureClusterMassesKg,
    modelBlockMatureYieldTonnes:
      modelMatureClusterMassesKg.reduce(
        (s, v, i) => s + v * input.representedClusterCounts[i],
        0,
      ) / 1000,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  lagPhaseClusterMassesKg: [0.1, 0.2],
  callerMaturityMassFactors: [2, 3],
  representedClusterCounts: [100, 200],
} satisfies Input;
export const exampleOutput = {
  modelMatureClusterMassesKg: [0.2, 0.6],
  modelBlockMatureYieldTonnes: 0.14,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/lag-phase-weight-yield-forecast",
  title: "Lag Phase Weight Yield Forecast",
  description:
    "Forecast heterogeneous lag-phase cluster masses using supplied calibrated maturity growth factors and represented cluster inventories; unlike count-only yield expansion, weight growth is explicit and not guaranteed.",
  inputs: inputFields,
  outputs: [
    {
      id: "modelMatureClusterMassesKg",
      label: "Model mature cluster masses kg",
      kind: "numberList",
    },
    {
      id: "modelBlockMatureYieldTonnes",
      label: "Model block mature yield tonnes",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      lagPhaseClusterMassesKg:
        value.lagPhaseClusterMassesKg as readonly number[],
      callerMaturityMassFactors:
        value.callerMaturityMassFactors as readonly number[],
      representedClusterCounts:
        value.representedClusterCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
