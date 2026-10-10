import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly studyId: string;
  readonly controlCode: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    studyId: { type: "string", maxLength: 8192, minLength: 1 },
    controlCode: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["studyId", "controlCode", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit study-control code by source without validating a comparator. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { studyId, controlCode, source } = request;
  const compute = (): Output => {
    H.domain(studyId.length > 0, "studyId");
    H.domain(controlCode.length > 0, "controlCode");
    H.domain(source.length > 0, "source");
    return { token: JSON.stringify([studyId, controlCode, source]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { studyId: "ST17", controlCode: "C2", source: "Protocol A" },
  output: { token: '["ST17","C2","Protocol A"]' },
} satisfies ToolExample<Input, Output>;
export const naturopathyStudyControlSourceCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["naturopathy", "health and medicine"],
      keywords: ["naturopathy", "health and medicine"],
    },
    id: "naturopathy/naturopathy-study-control-source-code",
    title: "Naturopathy Study Control Source Code",
    description:
      "Qualify an explicit study-control code by source without validating a comparator.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        studyId: { type: "string", maxLength: 8192, minLength: 1 },
        controlCode: { type: "string", maxLength: 8192, minLength: 1 },
        source: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["studyId", "controlCode", "source"],
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
          id: "controlCode",
          label: "Control Code",
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
export const run = naturopathyStudyControlSourceCodeTool.execute;
export default naturopathyStudyControlSourceCodeTool;
