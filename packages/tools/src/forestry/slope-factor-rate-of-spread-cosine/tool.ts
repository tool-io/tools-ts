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
  aligned,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedAlongSlopeSpreadMSecond: readonly number[];
  readonly observedSlopeAngleDegrees: readonly number[];
}>;
export type Output = Readonly<{
  readonly horizontalProjectedSpreadMSecond: readonly number[];
}>;
const inputFields = [
  {
    id: "observedAlongSlopeSpreadMSecond",
    label: "Observed along slope spread m second",
    kind: "numberList",
  },
  {
    id: "observedSlopeAngleDegrees",
    label: "Observed slope angle degrees",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedAlongSlopeSpreadMSecond.forEach((v) =>
    nonnegative(v, "observedAlongSlopeSpreadMSecond"),
  );
  aligned(
    input.observedAlongSlopeSpreadMSecond,
    input.observedSlopeAngleDegrees,
    "observedAlongSlopeSpreadMSecond",
  );
  input.observedSlopeAngleDegrees.forEach((v) => {
    if (Math.abs(v) >= 90)
      simpleError(
        "slope",
        "Observed slope angle strictly between−90 and90 degrees.",
      );
  });
  return {
    horizontalProjectedSpreadMSecond: input.observedAlongSlopeSpreadMSecond.map(
      (v, i) =>
        v * Math.cos((input.observedSlopeAngleDegrees[i] * Math.PI) / 180),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAlongSlopeSpreadMSecond: [1, 2],
  observedSlopeAngleDegrees: [0, 60],
} satisfies Input;
export const exampleOutput = {
  horizontalProjectedSpreadMSecond: [1, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/slope-factor-rate-of-spread-cosine",
  title: "Slope Factor Rate of Spread Cosine Calculator",
  description:
    "Cosine project actual along-slope front motion onto horizontal run, not a guessed fire acceleration/slope enhancement factor. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "horizontalProjectedSpreadMSecond",
      label: "Horizontal projected spread m second",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAlongSlopeSpreadMSecond:
        value.observedAlongSlopeSpreadMSecond as readonly number[],
      observedSlopeAngleDegrees:
        value.observedSlopeAngleDegrees as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
