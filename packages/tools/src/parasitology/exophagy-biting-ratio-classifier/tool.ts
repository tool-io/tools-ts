import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch53-shared.js";

export type Input = Readonly<{ indoorBites: number; outdoorBites: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "indoorBites", label: "Indoor bites", kind: "number" },
  { id: "outdoorBites", label: "Outdoor bites", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(i.indoorBites, "indoor");
  nonnegative(i.outdoorBites, "outdoor");
  positive(i.indoorBites + i.outdoorBites, "total");
  return {
    outdoorFraction: i.outdoorBites / (i.indoorBites + i.outdoorBites),
    observedPredominance:
      i.outdoorBites > i.indoorBites
        ? "outdoor"
        : i.outdoorBites < i.indoorBites
          ? "indoor"
          : "tie",
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { indoorBites: 2, outdoorBites: 6 },
  output: {
    result: { outdoorFraction: 0.75, observedPredominance: "outdoor" },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/exophagy-biting-ratio-classifier",
  title: "Exophagy Indoor-Outdoor Biting Ratio Behavior Classifier",
  description:
    "Compare observed indoor/outdoor bites; retains ties and does not establish intrinsic host-seeking behavior.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
