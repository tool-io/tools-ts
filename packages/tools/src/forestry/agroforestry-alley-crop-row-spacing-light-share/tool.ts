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
  fraction,
  aligned,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedAlleyWidthsM: readonly number[];
  readonly observedTreeShadowWidthsM: readonly number[];
  readonly observedShadowLightTransmissionFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly modeledAlleyAreaMeanLightFractions: readonly number[];
}>;
const inputFields = [
  {
    id: "observedAlleyWidthsM",
    label: "Observed alley widths m",
    kind: "numberList",
  },
  {
    id: "observedTreeShadowWidthsM",
    label: "Observed tree shadow widths m",
    kind: "numberList",
  },
  {
    id: "observedShadowLightTransmissionFractions",
    label: "Observed shadow light transmission fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedAlleyWidthsM.forEach((v) =>
    positive(v, "observedAlleyWidthsM"),
  );
  input.observedTreeShadowWidthsM.forEach((v) =>
    nonnegative(v, "observedTreeShadowWidthsM"),
  );
  input.observedShadowLightTransmissionFractions.forEach((v) =>
    fraction(v, "observedShadowLightTransmissionFractions"),
  );
  aligned(
    input.observedAlleyWidthsM,
    input.observedTreeShadowWidthsM,
    "observedAlleyWidthsM",
  );
  aligned(
    input.observedAlleyWidthsM,
    input.observedShadowLightTransmissionFractions,
    "observedAlleyWidthsM",
  );
  input.observedTreeShadowWidthsM.forEach((v, i) => {
    if (v > input.observedAlleyWidthsM[i])
      simpleError("shadow", "Observed union shadow width≤alley width.");
  });
  return {
    modeledAlleyAreaMeanLightFractions: input.observedAlleyWidthsM.map(
      (v, i) =>
        1 -
        (input.observedTreeShadowWidthsM[i] / v) *
          (1 - input.observedShadowLightTransmissionFractions[i]),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAlleyWidthsM: [10, 20],
  observedTreeShadowWidthsM: [2, 5],
  observedShadowLightTransmissionFractions: [0.5, 0.2],
} satisfies Input;
export const exampleOutput = {
  modeledAlleyAreaMeanLightFractions: [0.9, 0.8],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/agroforestry-alley-crop-row-spacing-light-share",
  title: "Alley Cropping Row Spacing Light Share Calculator",
  description:
    "Budget observed alley union-shadow width and independent shadow transmission into width-mean light share, not Beer–Lambert LAI or predicted crop yield. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledAlleyAreaMeanLightFractions",
      label: "Modeled alley area mean light fractions",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAlleyWidthsM: value.observedAlleyWidthsM as readonly number[],
      observedTreeShadowWidthsM:
        value.observedTreeShadowWidthsM as readonly number[],
      observedShadowLightTransmissionFractions:
        value.observedShadowLightTransmissionFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
