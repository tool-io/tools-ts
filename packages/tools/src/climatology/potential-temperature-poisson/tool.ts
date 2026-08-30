import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly temperaturesK: readonly number[];
  readonly pressuresHpa: readonly number[];
  readonly referencePressureHpa: number;
  readonly dryGasHeatCapacityRatio: number;
}>;
export type Output = Readonly<{
  readonly potentialTemperaturesK: readonly number[];
}>;
const inputFields = [
  { id: "temperaturesK", label: "Temperatures k", kind: "numberList" },
  { id: "pressuresHpa", label: "Pressures hpa", kind: "numberList" },
  {
    id: "referencePressureHpa",
    label: "Reference pressure hpa",
    kind: "number",
  },
  {
    id: "dryGasHeatCapacityRatio",
    label: "Dry gas heat capacity ratio",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.temperaturesK.forEach((v) => positive(v, "temperaturesK"));
  input.pressuresHpa.forEach((v) => positive(v, "pressuresHpa"));
  positive(input.referencePressureHpa, "referencePressureHpa");
  positive(input.dryGasHeatCapacityRatio, "dryGasHeatCapacityRatio");
  aligned(input.temperaturesK, input.pressuresHpa, "temperaturesK");
  return {
    potentialTemperaturesK: input.temperaturesK.map(
      (t, i) =>
        t *
        (input.referencePressureHpa / input.pressuresHpa[i]) **
          input.dryGasHeatCapacityRatio,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  temperaturesK: [300, 280],
  pressuresHpa: [1000, 500],
  referencePressureHpa: 1000,
  dryGasHeatCapacityRatio: 1,
} satisfies Input;
export const exampleOutput = {
  potentialTemperaturesK: [300, 560],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/potential-temperature-poisson",
  title: "Potential Temperature Poisson",
  description:
    "Compute pressure-normalized dry potential-temperature sounding under caller R/cp/reference pressure; no moisture normalization or actual measured parcel temperature at reference pressure.",
  inputs: inputFields,
  outputs: [
    {
      id: "potentialTemperaturesK",
      label: "Potential temperatures k",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      temperaturesK: value.temperaturesK as readonly number[],
      pressuresHpa: value.pressuresHpa as readonly number[],
      referencePressureHpa: value.referencePressureHpa as number,
      dryGasHeatCapacityRatio: value.dryGasHeatCapacityRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
