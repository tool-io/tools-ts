import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly workIncrements: readonly number[] };
export type Output = {
  readonly positiveWork: number;
  readonly negativeWork: number;
  readonly netWork: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    workIncrements: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["workIncrements"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    positiveWork: { type: "number" },
    negativeWork: { type: "number" },
    netWork: { type: "number" },
  },
  required: ["positiveWork", "negativeWork", "netWork"],
} as const;
/** Split already integrated signed work increments; negativeWork retains its sign. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { workIncrements } = request;
  const compute = (): Output => {
    return {
      positiveWork: workIncrements
        .filter((x) => x > 0)
        .reduce((a, b) => a + b, 0),
      negativeWork: workIncrements
        .filter((x) => x < 0)
        .reduce((a, b) => a + b, 0),
      netWork: workIncrements.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { workIncrements: [3, -2, 4, -1] },
  output: { positiveWork: 7, negativeWork: -3, netWork: 4 },
} satisfies ToolExample<Input, Output>;
export const mechanicalWorkPositiveNegativeSplitTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biomechanics/mechanical-work-positive-negative-split",
      title: "Mechanical Work Positive Negative Split Tool",
      description:
        "Split already integrated signed work increments; negativeWork retains its sign.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          workIncrements: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
        },
        required: ["workIncrements"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          positiveWork: { type: "number" },
          negativeWork: { type: "number" },
          netWork: { type: "number" },
        },
        required: ["positiveWork", "negativeWork", "netWork"],
      },
      ports: {
        inputs: [
          {
            id: "workIncrements",
            label: "Work Increments",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
        outputs: [
          {
            id: "positiveWork",
            label: "Positive Work",
            valueType: { type: "number" },
          },
          {
            id: "negativeWork",
            label: "Negative Work",
            valueType: { type: "number" },
          },
          { id: "netWork", label: "Net Work", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = mechanicalWorkPositiveNegativeSplitTool.execute;
export default mechanicalWorkPositiveNegativeSplitTool;
