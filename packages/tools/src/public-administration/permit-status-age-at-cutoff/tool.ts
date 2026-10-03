import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly statusAt: number; readonly cutoff: number };
export type Output = { readonly age: number; readonly futureStatus: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { statusAt: { type: "number" }, cutoff: { type: "number" } },
  required: ["statusAt", "cutoff"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { age: { type: "number" }, futureStatus: { type: "boolean" } },
  required: ["age", "futureStatus"],
} as const;
/** Report age of an explicitly supplied status record without determining permit validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { statusAt, cutoff } = request;
  const compute = (): Output => {
    return { age: cutoff - statusAt, futureStatus: statusAt > cutoff };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { statusAt: 10, cutoff: 25 },
  output: { age: 15, futureStatus: false },
} satisfies ToolExample<Input, Output>;
export const permitStatusAgeAtCutoffTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-administration/permit-status-age-at-cutoff",
    title: "Permit Status Age At Cutoff Tool",
    description:
      "Report age of an explicitly supplied status record without determining permit validity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { statusAt: { type: "number" }, cutoff: { type: "number" } },
      required: ["statusAt", "cutoff"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        age: { type: "number" },
        futureStatus: { type: "boolean" },
      },
      required: ["age", "futureStatus"],
    },
    ports: {
      inputs: [
        {
          id: "statusAt",
          label: "Status At",
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
          id: "futureStatus",
          label: "Future Status",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = permitStatusAgeAtCutoffTool.execute;
export default permitStatusAgeAtCutoffTool;
