import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly runId: string;
  readonly oneBasedPosition: number;
  readonly sampleId: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    runId: { type: "string", maxLength: 8192, minLength: 1 },
    oneBasedPosition: { type: "integer", minimum: 1 },
    sampleId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["runId", "oneBasedPosition", "sampleId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicit one-based run sequence position without assigning or randomizing samples. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { runId, oneBasedPosition, sampleId } = request;
  const compute = (): Output => {
    H.domain(runId.length > 0 && sampleId.length > 0, "runId");
    (H.domain(
      Number.isSafeInteger(oneBasedPosition) &&
        oneBasedPosition >= 1 &&
        oneBasedPosition <= Number.MAX_SAFE_INTEGER,
      "oneBasedPosition",
    ),
      oneBasedPosition);
    return { label: runId + " #" + oneBasedPosition + " [" + sampleId + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { runId: "RUN17", oneBasedPosition: 3, sampleId: "S2" },
  output: { label: "RUN17 #3 [S2]" },
} satisfies ToolExample<Input, Output>;
export const qcRunSequencePositionLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "quality-control",
        "quality control",
        "research and quality management",
      ],
      keywords: ["quality control", "research and quality management"],
    },
    id: "quality-control/qc-run-sequence-position-label",
    title: "QC Run Sequence Position Label",
    description:
      "Label an explicit one-based run sequence position without assigning or randomizing samples.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        runId: { type: "string", maxLength: 8192, minLength: 1 },
        oneBasedPosition: { type: "integer", minimum: 1 },
        sampleId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["runId", "oneBasedPosition", "sampleId"],
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
          id: "runId",
          label: "Run Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "oneBasedPosition",
          label: "One Based Position",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sampleId",
          label: "Sample Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = qcRunSequencePositionLabelTool.execute;
export default qcRunSequencePositionLabelTool;
