import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  occurrenceIndex: number;
  derivativeValue: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "occurrenceIndex", label: "Occurrence index", kind: "integer" },
  { id: "derivativeValue", label: "Derivative value", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.occurrenceIndex, 0, 32);
  return H.finish({
    derivativeOrder: i.occurrenceIndex,
    dividedDifferenceValue:
      i.derivativeValue / Number(H.factorial(i.occurrenceIndex)),
  });
};
export const example = {
  input: { occurrenceIndex: 2, derivativeValue: 6 },
  output: { result: { derivativeOrder: 2, dividedDifferenceValue: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "interpolation/repeated-node-derivative-label",
  title: "Interpolation: Repeated Node Derivative Label Tool",
  description:
    "Convert one supplied repeated-node derivative into its confluent divided-difference value f^(k)/k!, with occurrence zero denoting function value.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          derivativeOrder: { type: "number" },
          dividedDifferenceValue: { type: "number" },
        },
        required: ["derivativeOrder", "dividedDifferenceValue"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
