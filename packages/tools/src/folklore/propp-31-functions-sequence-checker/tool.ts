import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  sequence,
  simpleError,
} from "../batch44-shared.js";

export type Input = Readonly<{
  readonly independentlyAnnotatedFunctionOrdinals: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyAnnotatedFunctionOrdinals",
    label: "Independently annotated function ordinals",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.independentlyAnnotatedFunctionOrdinals.length)
    simpleError(
      "functions",
      "Explicit Propp numbered functions 1–31, from absentation to wedding; initial situation is not a numbered function.",
    );
  input.independentlyAnnotatedFunctionOrdinals.forEach((v) =>
    bounded(v, "function", 1, 31),
  );
  return {
    descendingFunctionIndices:
      input.independentlyAnnotatedFunctionOrdinals.flatMap((v, i) =>
        i && v < input.independentlyAnnotatedFunctionOrdinals[i - 1] ? [i] : [],
      ),
    repeatedFunctionIndices:
      input.independentlyAnnotatedFunctionOrdinals.flatMap((v, i) =>
        i && v === input.independentlyAnnotatedFunctionOrdinals[i - 1]
          ? [i]
          : [],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { independentlyAnnotatedFunctionOrdinals: [1, 3, 8, 12, 31] },
  output: {
    result: { descendingFunctionIndices: [], repeatedFunctionIndices: [] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/propp-31-functions-sequence-checker",
  title: "Propp 31 Functions Sequence Checker",
  description:
    "Audit caller annotated Propp1\u201331ordinals for descending steps and adjacent repeats. Omission is allowed; repeated/compound moves require separate narrative segmentation. Not proof of universal folktale conformity. Propp, Morphology of the Folktale.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
