import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lesionId: string;
  readonly recordedStatus: string;
  readonly source: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lesionId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedStatus: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["lesionId", "recordedStatus", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Record supplied lesion target-status wording and source without classifying a lesion under response criteria. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lesionId, recordedStatus, source } = request;
  const compute = (): Output => {
    H.domain(
      lesionId.length > 0 && recordedStatus.length > 0 && source.length > 0,
      "lesionId",
    );
    return { label: lesionId + " [" + recordedStatus + "; " + source + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lesionId: "L17", recordedStatus: "target", source: "Protocol A" },
  output: { label: "L17 [target; Protocol A]" },
} satisfies ToolExample<Input, Output>;
export const lesionTargetStatusLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["oncology", "health and medicine"],
      keywords: ["oncology", "health and medicine"],
    },
    id: "oncology/lesion-target-status-label",
    title: "Lesion Target Status Label",
    description:
      "Record supplied lesion target-status wording and source without classifying a lesion under response criteria.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lesionId: { type: "string", maxLength: 8192, minLength: 1 },
        recordedStatus: { type: "string", maxLength: 8192, minLength: 1 },
        source: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["lesionId", "recordedStatus", "source"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "lesionId",
          label: "Lesion Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedStatus",
          label: "Recorded Status",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = lesionTargetStatusLabelTool.execute;
export default lesionTargetStatusLabelTool;
