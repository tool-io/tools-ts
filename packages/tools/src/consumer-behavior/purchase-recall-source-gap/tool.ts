import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly purchaseAt: number;
  readonly recallAt: number;
  readonly recordCreatedAt: number;
};
export type Output = {
  readonly recallDelay: number;
  readonly recordDelay: number;
  readonly sourceTimingGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    purchaseAt: { type: "number" },
    recallAt: { type: "number" },
    recordCreatedAt: { type: "number" },
  },
  required: ["purchaseAt", "recallAt", "recordCreatedAt"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recallDelay: { type: "number" },
    recordDelay: { type: "number" },
    sourceTimingGap: { type: "number" },
  },
  required: ["recallDelay", "recordDelay", "sourceTimingGap"],
} as const;
/** Calculate purchase recall source gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { purchaseAt, recallAt, recordCreatedAt } = request;
  const compute = (): Output => {
    H.domain(recallAt >= purchaseAt && recordCreatedAt >= purchaseAt);
    return {
      recallDelay: recallAt - purchaseAt,
      recordDelay: recordCreatedAt - purchaseAt,
      sourceTimingGap: recallAt - recordCreatedAt,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { purchaseAt: 10, recallAt: 20, recordCreatedAt: 12 },
  output: { recallDelay: 10, recordDelay: 2, sourceTimingGap: 8 },
} satisfies ToolExample<Input, Output>;
export const purchaseRecallSourceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "consumer-behavior/purchase-recall-source-gap",
    title: "Purchase Recall Source Gap Tool",
    description:
      "Calculate purchase recall source gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        purchaseAt: { type: "number" },
        recallAt: { type: "number" },
        recordCreatedAt: { type: "number" },
      },
      required: ["purchaseAt", "recallAt", "recordCreatedAt"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recallDelay: { type: "number" },
        recordDelay: { type: "number" },
        sourceTimingGap: { type: "number" },
      },
      required: ["recallDelay", "recordDelay", "sourceTimingGap"],
    },
    ports: {
      inputs: [
        {
          id: "purchaseAt",
          label: "Purchase At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recallAt",
          label: "Recall At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recordCreatedAt",
          label: "Record Created At",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "recallDelay",
          label: "Recall Delay",
          valueType: { type: "number" },
        },
        {
          id: "recordDelay",
          label: "Record Delay",
          valueType: { type: "number" },
        },
        {
          id: "sourceTimingGap",
          label: "Source Timing Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = purchaseRecallSourceGapTool.execute;
export default purchaseRecallSourceGapTool;
