import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly intervalDurationsSeconds: readonly number[];
  readonly denseMagmaDischargesM3PerSecond: readonly number[];
  readonly emplacedVesicleFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly denseRockEquivalentVolumeM3: number;
  readonly emplacedBulkLavaVolumeM3: number;
}>;
const inputFields = [
  {
    id: "intervalDurationsSeconds",
    label: "Interval durations seconds",
    kind: "numberList",
  },
  {
    id: "denseMagmaDischargesM3PerSecond",
    label: "Dense magma discharges m3 per second",
    kind: "numberList",
  },
  {
    id: "emplacedVesicleFractions",
    label: "Emplaced vesicle fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.intervalDurationsSeconds.forEach((v) =>
    nonnegative(v, "intervalDurationsSeconds"),
  );
  input.denseMagmaDischargesM3PerSecond.forEach((v) =>
    nonnegative(v, "denseMagmaDischargesM3PerSecond"),
  );
  input.emplacedVesicleFractions.forEach((v) =>
    fraction(v, "emplacedVesicleFractions"),
  );
  aligned(
    input.intervalDurationsSeconds,
    input.denseMagmaDischargesM3PerSecond,
    "intervalDurationsSeconds",
  );
  aligned(
    input.intervalDurationsSeconds,
    input.emplacedVesicleFractions,
    "intervalDurationsSeconds",
  );
  if (input.emplacedVesicleFractions.some((v) => v === 1))
    simpleError(
      "emplacedVesicleFractions",
      "Vesicle fractions below one required.",
    );
  return {
    denseRockEquivalentVolumeM3: input.intervalDurationsSeconds.reduce(
      (s, v, i) => s + v * input.denseMagmaDischargesM3PerSecond[i],
      0,
    ),
    emplacedBulkLavaVolumeM3: input.intervalDurationsSeconds.reduce(
      (s, v, i) =>
        s +
        (v * input.denseMagmaDischargesM3PerSecond[i]) /
          (1 - input.emplacedVesicleFractions[i]),
      0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  intervalDurationsSeconds: [10, 20],
  denseMagmaDischargesM3PerSecond: [2, 3],
  emplacedVesicleFractions: [0, 0.5],
} satisfies Input;
export const exampleOutput = {
  denseRockEquivalentVolumeM3: 80,
  emplacedBulkLavaVolumeM3: 140,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/lava-flow-volume-effusion-duration",
  title: "Lava Flow Volume Effusion Duration",
  description:
    "Integrate piecewise dense-magma discharge into DRE and separately expanded emplaced bulk lava volume; unlike survey-rate inference, flow is a supplied forward boundary condition.",
  inputs: inputFields,
  outputs: [
    {
      id: "denseRockEquivalentVolumeM3",
      label: "Dense rock equivalent volume m3",
      kind: "number",
    },
    {
      id: "emplacedBulkLavaVolumeM3",
      label: "Emplaced bulk lava volume m3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      intervalDurationsSeconds:
        value.intervalDurationsSeconds as readonly number[],
      denseMagmaDischargesM3PerSecond:
        value.denseMagmaDischargesM3PerSecond as readonly number[],
      emplacedVesicleFractions:
        value.emplacedVesicleFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
