import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  unique,
  ordered,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedGloveHandLengthMm: number;
  readonly callerGloveHandLengthLowerMm: readonly number[];
  readonly callerGloveHandLengthUpperMm: readonly number[];
  readonly callerGloveHandLengthSizeIds: readonly string[];
}>;
export type Output = Readonly<{
  readonly matchingCallerSizeIds: readonly string[];
}>;
const inputFields = [
  {
    id: "observedGloveHandLengthMm",
    label: "Observed glove hand length mm",
    kind: "number",
  },
  {
    id: "callerGloveHandLengthLowerMm",
    label: "Caller glove hand length lower mm",
    kind: "numberList",
  },
  {
    id: "callerGloveHandLengthUpperMm",
    label: "Caller glove hand length upper mm",
    kind: "numberList",
  },
  {
    id: "callerGloveHandLengthSizeIds",
    label: "Caller glove hand length size ids",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerGloveHandLengthLowerMm,
    input.callerGloveHandLengthUpperMm,
    "callerGloveHandLengthLowerMm",
  );
  aligned(
    input.callerGloveHandLengthLowerMm,
    input.callerGloveHandLengthSizeIds,
    "callerGloveHandLengthLowerMm",
  );
  positive(input.observedGloveHandLengthMm, "measurement");
  unique(input.callerGloveHandLengthSizeIds, "sizes");
  input.callerGloveHandLengthLowerMm.forEach((v, i) =>
    ordered(v, input.callerGloveHandLengthUpperMm[i]),
  );
  return {
    matchingCallerSizeIds: input.callerGloveHandLengthSizeIds.filter(
      (_, i) =>
        input.observedGloveHandLengthMm >=
          input.callerGloveHandLengthLowerMm[i] &&
        input.observedGloveHandLengthMm <=
          input.callerGloveHandLengthUpperMm[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedGloveHandLengthMm: 200,
  callerGloveHandLengthLowerMm: [180, 200],
  callerGloveHandLengthUpperMm: [200, 220],
  callerGloveHandLengthSizeIds: ["a", "b"],
} satisfies Input;
export const exampleOutput = {
  matchingCallerSizeIds: ["a", "b"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/hand-length-glove-size-mapper",
  title: "Anthropometric Hand Length Glove Size Mapper",
  description:
    "Hand-length caller glove chart lookup must include hand breadth/fit context externally, no universal size. Overlaps/boundaries retained. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "matchingCallerSizeIds",
      label: "Matching caller size ids",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedGloveHandLengthMm: value.observedGloveHandLengthMm as number,
      callerGloveHandLengthLowerMm:
        value.callerGloveHandLengthLowerMm as readonly number[],
      callerGloveHandLengthUpperMm:
        value.callerGloveHandLengthUpperMm as readonly number[],
      callerGloveHandLengthSizeIds:
        value.callerGloveHandLengthSizeIds as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
