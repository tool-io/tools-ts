import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly storedAt: number;
  readonly processedAt: number;
  readonly suppliedLimit: number;
};
export type Output = { readonly elapsed: number; readonly slack: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    storedAt: { type: "number" },
    processedAt: { type: "number" },
    suppliedLimit: { type: "number", minimum: 0 },
  },
  required: ["storedAt", "processedAt", "suppliedLimit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { elapsed: { type: "number" }, slack: { type: "number" } },
  required: ["elapsed", "slack"],
} as const;
/** Audit explicit research storage times against a caller-supplied limit without inventing stability guidance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { storedAt, processedAt, suppliedLimit } = request;
  const compute = (): Output => {
    H.domain(processedAt >= storedAt && suppliedLimit >= 0);
    return {
      elapsed: processedAt - storedAt,
      slack: suppliedLimit - (processedAt - storedAt),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { storedAt: 10, processedAt: 25, suppliedLimit: 20 },
  output: { elapsed: 15, slack: 5 },
} satisfies ToolExample<Input, Output>;
export const specimenStorageTimeGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "endocrinology/specimen-storage-time-gap",
    title: "Specimen Storage Time Gap Tool",
    description:
      "Audit explicit research storage times against a caller-supplied limit without inventing stability guidance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        storedAt: { type: "number" },
        processedAt: { type: "number" },
        suppliedLimit: { type: "number", minimum: 0 },
      },
      required: ["storedAt", "processedAt", "suppliedLimit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { elapsed: { type: "number" }, slack: { type: "number" } },
      required: ["elapsed", "slack"],
    },
    ports: {
      inputs: [
        {
          id: "storedAt",
          label: "Stored At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "processedAt",
          label: "Processed At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedLimit",
          label: "Supplied Limit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "elapsed", label: "Elapsed", valueType: { type: "number" } },
        { id: "slack", label: "Slack", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = specimenStorageTimeGapTool.execute;
export default specimenStorageTimeGapTool;
