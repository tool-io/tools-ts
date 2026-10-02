import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  lowerProbability: number;
  upperProbability: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "lowerProbability", label: "Lower probability", kind: "number" },
  { id: "upperProbability", label: "Upper probability", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bounded(i.lowerProbability, 0, 1);
  H.bounded(i.upperProbability, i.lowerProbability, 1);
  return H.finish({
    complementLower: 1 - i.upperProbability,
    complementUpper: 1 - i.lowerProbability,
  });
};
export const example = {
  input: { lowerProbability: 0.2, upperProbability: 0.7 },
  output: { result: { complementLower: 0.3, complementUpper: 0.8 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "probability/event-complement-interval-bounds",
  title: "Probability: Event Complement Interval Bounds Tool",
  description:
    "Transform a closed probability-uncertainty interval through the decreasing complement map, reversing endpoints.",
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
          complementLower: { type: "number" },
          complementUpper: { type: "number" },
        },
        required: ["complementLower", "complementUpper"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
