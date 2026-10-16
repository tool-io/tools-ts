import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, orderedPair } from "../batch53-shared.js";

export type Input = Readonly<{
  aStart: number;
  aEnd: number;
  bStart: number;
  bEnd: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "aStart", label: "A start", kind: "number" },
  { id: "aEnd", label: "A end", kind: "number" },
  { id: "bStart", label: "B start", kind: "number" },
  { id: "bEnd", label: "B end", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  orderedPair(i.aStart, i.aEnd);
  orderedPair(i.bStart, i.bEnd);
  return {
    sharedEndpoints: [
      ...new Set(
        [i.aStart, i.aEnd].filter((v) => v === i.bStart || v === i.bEnd),
      ),
    ].sort((a, b) => a - b),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { aStart: 0, aEnd: 1, bStart: 1, bEnd: 2 },
  output: { result: { sharedEndpoints: [1] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "interval/interval-shared-endpoint-classifier",
  title: "Interval Shared Endpoint Classifier",
  description:
    "Identify exact shared endpoint values independently of whether interval interiors overlap.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sharedEndpoints: { type: "array", items: { type: "number" } },
        },
        required: ["sharedEndpoints"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
