import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly specimenId: string;
  readonly suppliedStage: string;
  readonly tableVersion: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    specimenId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedStage: { type: "string", maxLength: 8192, minLength: 1 },
    tableVersion: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["specimenId", "suppliedStage", "tableVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit embryology stage assertion and table version without mapping or assigning stages. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { specimenId, suppliedStage, tableVersion } = request;
  const compute = (): Output => {
    H.domain(specimenId.length > 0, "specimenId");
    H.domain(suppliedStage.length > 0, "suppliedStage");
    H.domain(tableVersion.length > 0, "tableVersion");
    return { token: JSON.stringify([specimenId, suppliedStage, tableVersion]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    specimenId: "S17",
    suppliedStage: "stage A",
    tableVersion: "table v2",
  },
  output: { token: '["S17","stage A","table v2"]' },
} satisfies ToolExample<Input, Output>;
export const embryologyStageTableVersionTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-biology/embryology-stage-table-version-token",
    title: "Embryology Stage Table Version Token Tool",
    description:
      "Preserve an explicit embryology stage assertion and table version without mapping or assigning stages.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        specimenId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedStage: { type: "string", maxLength: 8192, minLength: 1 },
        tableVersion: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["specimenId", "suppliedStage", "tableVersion"],
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
          id: "specimenId",
          label: "Specimen Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedStage",
          label: "Supplied Stage",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "tableVersion",
          label: "Table Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = embryologyStageTableVersionTokenTool.execute;
export default embryologyStageTableVersionTokenTool;
