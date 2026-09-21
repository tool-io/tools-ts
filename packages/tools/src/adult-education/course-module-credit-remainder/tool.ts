import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalCredits: number;
  readonly completedCredits: readonly number[];
};
export type Output = { readonly completed: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalCredits: { type: "number", minimum: 0 },
    completedCredits: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
  },
  required: ["totalCredits", "completedCredits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { completed: { type: "number" }, remainder: { type: "number" } },
  required: ["completed", "remainder"],
} as const;
/** Calculate course module credit remainder from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalCredits, completedCredits } = request;
  const compute = (): Output => {
    H.domain(totalCredits >= 0 && completedCredits.every((x) => x >= 0));
    return {
      completed: completedCredits.reduce((a, b) => a + b, 0),
      remainder: totalCredits - completedCredits.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalCredits: 12, completedCredits: [3, 4] },
  output: { completed: 7, remainder: 5 },
} satisfies ToolExample<Input, Output>;
export const courseModuleCreditRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "adult-education/course-module-credit-remainder",
    title: "Course Module Credit Remainder Tool",
    description:
      "Calculate course module credit remainder from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalCredits: { type: "number", minimum: 0 },
        completedCredits: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
      },
      required: ["totalCredits", "completedCredits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        completed: { type: "number" },
        remainder: { type: "number" },
      },
      required: ["completed", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "totalCredits",
          label: "Total Credits",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "completedCredits",
          label: "Completed Credits",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        { id: "completed", label: "Completed", valueType: { type: "number" } },
        { id: "remainder", label: "Remainder", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = courseModuleCreditRemainderTool.execute;
export default courseModuleCreditRemainderTool;
