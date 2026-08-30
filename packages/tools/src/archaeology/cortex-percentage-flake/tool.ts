import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly observedCortexAreasMm2: readonly number[];
  readonly observedDorsalAreasMm2: readonly number[];
}>;
export type Output = Readonly<{
  readonly perFlakeCortexPercentages: readonly number[];
  readonly pooledAreaCortexPercentage: number;
}>;
const inputFields = [
  {
    id: "observedCortexAreasMm2",
    label: "Observed cortex areas mm2",
    kind: "numberList",
  },
  {
    id: "observedDorsalAreasMm2",
    label: "Observed dorsal areas mm2",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedDorsalAreasMm2.forEach((v) =>
    positive(v, "observedDorsalAreasMm2"),
  );
  input.observedCortexAreasMm2.forEach((v) =>
    nonnegative(v, "observedCortexAreasMm2"),
  );
  aligned(
    input.observedCortexAreasMm2,
    input.observedDorsalAreasMm2,
    "observedCortexAreasMm2",
  );
  const perFlakeCortexPercentages = input.observedCortexAreasMm2.map(
    (v, i) =>
      100 *
      fraction(v / input.observedDorsalAreasMm2[i], "observedCortexAreasMm2"),
  );
  return {
    perFlakeCortexPercentages,
    pooledAreaCortexPercentage:
      (100 * input.observedCortexAreasMm2.reduce((a, b) => a + b, 0)) /
      input.observedDorsalAreasMm2.reduce((a, b) => a + b, 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCortexAreasMm2: [1, 0, 6],
  observedDorsalAreasMm2: [2, 2, 6],
} satisfies Input;
export const exampleOutput = {
  perFlakeCortexPercentages: [50, 0, 100],
  pooledAreaCortexPercentage: 70,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/cortex-percentage-flake",
  title: "Cortex Percentage Flake Estimator",
  description:
    "Summarize measured dorsal cortex coverage per flake and pooled physical area, distinguishing unequal-sized flakes from a mean percentage.",
  inputs: inputFields,
  outputs: [
    {
      id: "perFlakeCortexPercentages",
      label: "Per flake cortex percentages",
      kind: "numberList",
    },
    {
      id: "pooledAreaCortexPercentage",
      label: "Pooled area cortex percentage",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCortexAreasMm2: value.observedCortexAreasMm2 as readonly number[],
      observedDorsalAreasMm2: value.observedDorsalAreasMm2 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
