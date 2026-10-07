import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly studyId: string;
  readonly controlTypeWording: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    studyId: { type: "string", maxLength: 8192, minLength: 1 },
    controlTypeWording: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["studyId", "controlTypeWording", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicitly reported study-control type by protocol source without assessing treatment efficacy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { studyId, controlTypeWording, source } = request;
  const compute = (): Output => {
    H.domain(studyId.length > 0, "studyId");
    H.domain(controlTypeWording.length > 0, "controlTypeWording");
    H.domain(source.length > 0, "source");
    return { token: JSON.stringify([studyId, controlTypeWording, source]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    studyId: "ST17",
    controlTypeWording: "usual care",
    source: "Protocol v2",
  },
  output: { token: '["ST17","usual care","Protocol v2"]' },
} satisfies ToolExample<Input, Output>;
export const chiropracticStudyControlTypeLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["chiropractic", "health and medicine"],
      keywords: ["chiropractic", "health and medicine"],
    },
    id: "chiropractic/chiropractic-study-control-type-label",
    title: "Chiropractic Study Control Type Label",
    description:
      "Qualify an explicitly reported study-control type by protocol source without assessing treatment efficacy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        studyId: { type: "string", maxLength: 8192, minLength: 1 },
        controlTypeWording: { type: "string", maxLength: 8192, minLength: 1 },
        source: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["studyId", "controlTypeWording", "source"],
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
          id: "studyId",
          label: "Study Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "controlTypeWording",
          label: "Control Type Wording",
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
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = chiropracticStudyControlTypeLabelTool.execute;
export default chiropracticStudyControlTypeLabelTool;
