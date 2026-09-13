import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
  mean,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyEstablishedOrderedBogardusDistanceCodes: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyEstablishedOrderedBogardusDistanceCodes",
    label: "Actual independently established ordered bogardus distance codes",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualIndependentlyEstablishedOrderedBogardusDistanceCodes.length)
    simpleError("codes", "Actualobservationsrequired.");
  input.actualIndependentlyEstablishedOrderedBogardusDistanceCodes.forEach(
    (v) => bounded(v, "code", 1, 7),
  );
  return {
    observedMeanQualifiedDistanceCode: mean(
      input.actualIndependentlyEstablishedOrderedBogardusDistanceCodes,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIndependentlyEstablishedOrderedBogardusDistanceCodes: [1, 3, 5],
  },
  output: { result: { observedMeanQualifiedDistanceCode: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/social-distance-bogardus",
  title: "Bogardus Social Distance Calculator",
  description:
    "Arithmetic mean actual separately coded Bogardus1\u20137social distance responses, standard ordinal code convention not interval validity or individual group-attitude inference; no questionnaire words or normative interpretation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
