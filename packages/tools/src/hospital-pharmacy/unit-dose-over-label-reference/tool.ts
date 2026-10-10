import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly doseRecordId: string;
  readonly overLabelId: string;
  readonly sourceLabelId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    doseRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    overLabelId: { type: "string", maxLength: 8192, minLength: 1 },
    sourceLabelId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["doseRecordId", "overLabelId", "sourceLabelId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Pair explicit unit-dose over-label and source-label references without creating dispensing instructions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { doseRecordId, overLabelId, sourceLabelId } = request;
  const compute = (): Output => {
    H.domain(doseRecordId.length > 0, "doseRecordId");
    H.domain(overLabelId.length > 0, "overLabelId");
    H.domain(sourceLabelId.length > 0, "sourceLabelId");
    return {
      token: JSON.stringify([doseRecordId, overLabelId, sourceLabelId]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { doseRecordId: "D17", overLabelId: "OVER2", sourceLabelId: "SRC2" },
  output: { token: '["D17","OVER2","SRC2"]' },
} satisfies ToolExample<Input, Output>;
export const unitDoseOverLabelReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["hospital-pharmacy", "hospital pharmacy", "pharmacy"],
      keywords: ["hospital pharmacy", "pharmacy"],
    },
    id: "hospital-pharmacy/unit-dose-over-label-reference",
    title: "Unit Dose Over Label Reference",
    description:
      "Pair explicit unit-dose over-label and source-label references without creating dispensing instructions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        doseRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        overLabelId: { type: "string", maxLength: 8192, minLength: 1 },
        sourceLabelId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["doseRecordId", "overLabelId", "sourceLabelId"],
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
          id: "doseRecordId",
          label: "Dose Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "overLabelId",
          label: "Over Label Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceLabelId",
          label: "Source Label Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = unitDoseOverLabelReferenceTool.execute;
export default unitDoseOverLabelReferenceTool;
