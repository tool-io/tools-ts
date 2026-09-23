import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly reviewAt: number; readonly cutoff: number };
export type Output = { readonly age: number; readonly futureRecord: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { reviewAt: { type: "number" }, cutoff: { type: "number" } },
  required: ["reviewAt", "cutoff"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { age: { type: "number" }, futureRecord: { type: "boolean" } },
  required: ["age", "futureRecord"],
} as const;
/** Calculate protective equipment review age from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reviewAt, cutoff } = request;
  const compute = (): Output => {
    return { age: cutoff - reviewAt, futureRecord: reviewAt > cutoff };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reviewAt: 10, cutoff: 25 },
  output: { age: 15, futureRecord: false },
} satisfies ToolExample<Input, Output>;
export const protectiveEquipmentReviewAgeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosafety/protective-equipment-review-age",
    title: "Protective Equipment Review Age Tool",
    description:
      "Calculate protective equipment review age from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { reviewAt: { type: "number" }, cutoff: { type: "number" } },
      required: ["reviewAt", "cutoff"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        age: { type: "number" },
        futureRecord: { type: "boolean" },
      },
      required: ["age", "futureRecord"],
    },
    ports: {
      inputs: [
        {
          id: "reviewAt",
          label: "Review At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cutoff",
          label: "Cutoff",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "age", label: "Age", valueType: { type: "number" } },
        {
          id: "futureRecord",
          label: "Future Record",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = protectiveEquipmentReviewAgeTool.execute;
export default protectiveEquipmentReviewAgeTool;
