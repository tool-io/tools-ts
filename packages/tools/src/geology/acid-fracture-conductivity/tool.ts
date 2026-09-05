import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
  aligned,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly etchedChannelWidthsM: readonly number[];
  readonly closureRetainedFractions: readonly number[];
  readonly channelAreaFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly etchedParallelChannelConductivitiesM3: readonly number[];
}>;
const inputFields = [
  {
    id: "etchedChannelWidthsM",
    label: "Etched channel widths m",
    kind: "numberList",
  },
  {
    id: "closureRetainedFractions",
    label: "Closure retained fractions",
    kind: "numberList",
  },
  {
    id: "channelAreaFractions",
    label: "Channel area fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.etchedChannelWidthsM.forEach((v) =>
    nonnegative(v, "etchedChannelWidthsM"),
  );
  input.closureRetainedFractions.forEach((v) =>
    fraction(v, "closureRetainedFractions"),
  );
  input.channelAreaFractions.forEach((v) =>
    fraction(v, "channelAreaFractions"),
  );
  aligned(
    input.etchedChannelWidthsM,
    input.closureRetainedFractions,
    "etchedChannelWidthsM",
  );
  aligned(
    input.etchedChannelWidthsM,
    input.channelAreaFractions,
    "etchedChannelWidthsM",
  );
  return {
    etchedParallelChannelConductivitiesM3: input.etchedChannelWidthsM.map(
      (v, i) =>
        ((v * input.closureRetainedFractions[i]) ** 3 *
          input.channelAreaFractions[i]) /
        12,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  etchedChannelWidthsM: [0.01, 0.02],
  closureRetainedFractions: [0.5, 1],
  channelAreaFractions: [0.2, 0.4],
} satisfies Input;
export const exampleOutput = {
  etchedParallelChannelConductivitiesM3: [
    2.0833333333333338e-9, 2.666666666666667e-7,
  ],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/acid-fracture-conductivity",
  title: "Geology Acid Fracture Conductivity Calculator",
  description:
    "Ideal etched unpropped channel cubic conductance with independently measured closure retention/channel area, not proppant k×width or acid-treatment efficacy. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "etchedParallelChannelConductivitiesM3",
      label: "Etched parallel channel conductivities m3",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      etchedChannelWidthsM: value.etchedChannelWidthsM as readonly number[],
      closureRetainedFractions:
        value.closureRetainedFractions as readonly number[],
      channelAreaFractions: value.channelAreaFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
