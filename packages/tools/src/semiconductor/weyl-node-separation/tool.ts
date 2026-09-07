import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedWeylNodeAReciprocalCoordinates: readonly number[];
  readonly observedWeylNodeBReciprocalCoordinates: readonly number[];
}>;
export type Output = Readonly<{
  readonly directedWeylNodeSeparation: readonly number[];
  readonly weylNodeSeparationMagnitude: number;
}>;
const inputFields = [
  {
    id: "observedWeylNodeAReciprocalCoordinates",
    label: "Observed weyl node a reciprocal coordinates",
    kind: "numberList",
  },
  {
    id: "observedWeylNodeBReciprocalCoordinates",
    label: "Observed weyl node b reciprocal coordinates",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    input.observedWeylNodeAReciprocalCoordinates.length !== 3 ||
    input.observedWeylNodeBReciprocalCoordinates.length !== 3
  )
    simpleError(
      "nodes",
      "Three caller same-frame reciprocal coordinates per independently identified Weyl node required.",
    );
  const delta = input.observedWeylNodeBReciprocalCoordinates.map(
    (v, i) => v - input.observedWeylNodeAReciprocalCoordinates[i],
  );
  return {
    directedWeylNodeSeparation: delta,
    weylNodeSeparationMagnitude: Math.hypot(...delta),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedWeylNodeAReciprocalCoordinates: [1, 2, 3],
  observedWeylNodeBReciprocalCoordinates: [4, 6, 3],
} satisfies Input;
export const exampleOutput = {
  directedWeylNodeSeparation: [3, 4, 0],
  weylNodeSeparationMagnitude: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/weyl-node-separation",
  title: "Semiconductor Weyl Node Separation Calculator",
  description:
    "Resolve observed Weyl-node directed displacement in one caller reciprocal-space frame, no Brillouin-zone periodic minimum, real-space geodesy or identification of Weyl nodes.",
  inputs: inputFields,
  outputs: [
    {
      id: "directedWeylNodeSeparation",
      label: "Directed weyl node separation",
      kind: "numberList",
    },
    {
      id: "weylNodeSeparationMagnitude",
      label: "Weyl node separation magnitude",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedWeylNodeAReciprocalCoordinates:
        value.observedWeylNodeAReciprocalCoordinates as readonly number[],
      observedWeylNodeBReciprocalCoordinates:
        value.observedWeylNodeBReciprocalCoordinates as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
