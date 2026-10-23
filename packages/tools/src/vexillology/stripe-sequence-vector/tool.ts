import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  unique,
  catalogIndex,
  simpleError,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly orderedStripeColorIds: readonly string[];
  readonly callerPaletteOrder: readonly string[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "orderedStripeColorIds",
    label: "Ordered stripe color ids",
    kind: "stringList",
  },
  {
    id: "callerPaletteOrder",
    label: "Caller palette order",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  unique(input.callerPaletteOrder, "palette");
  if (!input.orderedStripeColorIds.length)
    simpleError("stripes", "Explicit nonempty caller ordered stripes.");
  return {
    stripePaletteVector: input.orderedStripeColorIds.map((v) =>
      catalogIndex(input.callerPaletteOrder, v),
    ),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    orderedStripeColorIds: ["red", "white", "red"],
    callerPaletteOrder: ["white", "red", "blue"],
  },
  output: { result: { stripePaletteVector: [1, 0, 1] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/stripe-sequence-vector",
  title: "Stripe Sequence Vector Encoder",
  description:
    "Encode actual ordered stripe colour ID sinto zero-based indices of a caller palette; not a sequence generator or canonical flag identity.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          stripePaletteVector: { type: "array", items: { type: "number" } },
        },
        required: ["stripePaletteVector"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
