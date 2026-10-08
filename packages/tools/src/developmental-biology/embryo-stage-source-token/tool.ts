import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly specimenCode: string;
  readonly stageCode: string;
  readonly stagingSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    specimenCode: { type: "string", maxLength: 8192, minLength: 1 },
    stageCode: { type: "string", maxLength: 8192, minLength: 1 },
    stagingSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["specimenCode", "stageCode", "stagingSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit specimen stage annotation and source without estimating embryo age or developmental status. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { specimenCode, stageCode, stagingSource } = request;
  const compute = (): Output => {
    H.domain(
      specimenCode.length > 0 &&
        stageCode.length > 0 &&
        stagingSource.length > 0,
      "specimenCode",
    );
    return { token: JSON.stringify([specimenCode, stageCode, stagingSource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    specimenCode: "S17",
    stageCode: "stage-A",
    stagingSource: "atlas edition 2",
  },
  output: { token: '["S17","stage-A","atlas edition 2"]' },
} satisfies ToolExample<Input, Output>;
export const embryoStageSourceTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["developmental-biology", "developmental biology", "biology"],
      keywords: ["developmental biology", "biology"],
    },
    id: "developmental-biology/embryo-stage-source-token",
    title: "Embryo Stage Source Token",
    description:
      "Record an explicit specimen stage annotation and source without estimating embryo age or developmental status.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        specimenCode: { type: "string", maxLength: 8192, minLength: 1 },
        stageCode: { type: "string", maxLength: 8192, minLength: 1 },
        stagingSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["specimenCode", "stageCode", "stagingSource"],
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
          id: "specimenCode",
          label: "Specimen Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "stageCode",
          label: "Stage Code",
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
export const run = embryoStageSourceTokenTool.execute;
export default embryoStageSourceTokenTool;
