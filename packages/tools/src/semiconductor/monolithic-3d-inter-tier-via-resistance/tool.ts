import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  bounded,
  aligned,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedIntertierViaCount: readonly number[];
  readonly observedParallelViaClusterOhms: readonly number[];
  readonly observedIndependentClusterContactOhms: readonly number[];
}>;
export type Output = Readonly<{
  readonly inferredSingleIntertierViaOhms: readonly number[];
}>;
const inputFields = [
  {
    id: "observedIntertierViaCount",
    label: "Observed intertier via count",
    kind: "numberList",
  },
  {
    id: "observedParallelViaClusterOhms",
    label: "Observed parallel via cluster ohms",
    kind: "numberList",
  },
  {
    id: "observedIndependentClusterContactOhms",
    label: "Observed independent cluster contact ohms",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedParallelViaClusterOhms.forEach((v) =>
    positive(v, "observedParallelViaClusterOhms"),
  );
  input.observedIndependentClusterContactOhms.forEach((v) =>
    nonnegative(v, "observedIndependentClusterContactOhms"),
  );
  aligned(
    input.observedIntertierViaCount,
    input.observedParallelViaClusterOhms,
    "observedIntertierViaCount",
  );
  aligned(
    input.observedIntertierViaCount,
    input.observedIndependentClusterContactOhms,
    "observedIntertierViaCount",
  );
  input.observedIntertierViaCount.forEach((v) =>
    bounded(v, "vias", 1, 1000000),
  );
  return {
    inferredSingleIntertierViaOhms: input.observedParallelViaClusterOhms.map(
      (v, i) =>
        (v - input.observedIndependentClusterContactOhms[i]) *
        input.observedIntertierViaCount[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedIntertierViaCount: [2, 4],
  observedParallelViaClusterOhms: [1, 2],
  observedIndependentClusterContactOhms: [0.1, 0.2],
} satisfies Input;
export const exampleOutput = {
  inferredSingleIntertierViaOhms: [1.8, 7.2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/monolithic-3d-inter-tier-via-resistance",
  title: "Semiconductor Monolithic 3d Inter Tier Via Resistance Calculator",
  description:
    "Infer actual equivalent single inter-tier via resistance from matched equal-parallel clusters after independent cluster contact subtraction, signed mismatch retained; not cylindrical copper geometry resistance.",
  inputs: inputFields,
  outputs: [
    {
      id: "inferredSingleIntertierViaOhms",
      label: "Inferred single intertier via ohms",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedIntertierViaCount:
        value.observedIntertierViaCount as readonly number[],
      observedParallelViaClusterOhms:
        value.observedParallelViaClusterOhms as readonly number[],
      observedIndependentClusterContactOhms:
        value.observedIndependentClusterContactOhms as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
