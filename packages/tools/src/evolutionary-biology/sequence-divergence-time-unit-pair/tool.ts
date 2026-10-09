import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly estimateId: string;
  readonly timeText: string;
  readonly suppliedUnit: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    estimateId: { type: "string", maxLength: 8192, minLength: 1 },
    timeText: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedUnit: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["estimateId", "timeText", "suppliedUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit sequence-divergence time transcription and unit without converting generations or calibrating a clock. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { estimateId, timeText, suppliedUnit } = request;
  const compute = (): Output => {
    H.domain(estimateId.length > 0, "estimateId");
    H.domain(timeText.length > 0, "timeText");
    H.domain(suppliedUnit.length > 0, "suppliedUnit");
    return { token: JSON.stringify([estimateId, timeText, suppliedUnit]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { estimateId: "E17", timeText: "2.4", suppliedUnit: "million years" },
  output: { token: '["E17","2.4","million years"]' },
} satisfies ToolExample<Input, Output>;
export const sequenceDivergenceTimeUnitPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "evolutionary-biology/sequence-divergence-time-unit-pair",
    title: "Sequence Divergence Time Unit Pair Tool",
    description:
      "Preserve an explicit sequence-divergence time transcription and unit without converting generations or calibrating a clock.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        estimateId: { type: "string", maxLength: 8192, minLength: 1 },
        timeText: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedUnit: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["estimateId", "timeText", "suppliedUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "estimateId",
          label: "Estimate Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "timeText",
          label: "Time Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedUnit",
          label: "Supplied Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = sequenceDivergenceTimeUnitPairTool.execute;
export default sequenceDivergenceTimeUnitPairTool;
