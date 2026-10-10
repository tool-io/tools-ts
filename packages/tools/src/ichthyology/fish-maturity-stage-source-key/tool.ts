import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly specimenId: string;
  readonly suppliedStage: string;
  readonly stagingSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    specimenId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedStage: { type: "string", maxLength: 8192, minLength: 1 },
    stagingSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["specimenId", "suppliedStage", "stagingSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit fish maturity-stage and source metadata without assigning reproductive status. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { specimenId, suppliedStage, stagingSource } = request;
  const compute = (): Output => {
    H.domain(specimenId.length > 0, "specimenId");
    H.domain(suppliedStage.length > 0, "suppliedStage");
    H.domain(stagingSource.length > 0, "stagingSource");
    return {
      token: JSON.stringify([specimenId, suppliedStage, stagingSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    specimenId: "S17",
    suppliedStage: "stage A",
    stagingSource: "table T4",
  },
  output: { token: '["S17","stage A","table T4"]' },
} satisfies ToolExample<Input, Output>;
export const fishMaturityStageSourceKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ichthyology/fish-maturity-stage-source-key",
    title: "Fish Maturity Stage Source Key Tool",
    description:
      "Preserve explicit fish maturity-stage and source metadata without assigning reproductive status.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        specimenId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedStage: { type: "string", maxLength: 8192, minLength: 1 },
        stagingSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["specimenId", "suppliedStage", "stagingSource"],
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
          id: "stagingSource",
          label: "Staging Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = fishMaturityStageSourceKeyTool.execute;
export default fishMaturityStageSourceKeyTool;
