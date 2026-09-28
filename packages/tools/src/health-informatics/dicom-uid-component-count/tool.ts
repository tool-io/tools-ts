import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
import { calculate as inspectUid } from "../../health-informatics/dicom-uid-leading-zero-guard/tool.js";
export type Input = { readonly uid: string };
export type Output = {
  readonly componentCount: number;
  readonly encodingSpellingValid: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { uid: { type: "string", maxLength: 8192 } },
  required: ["uid"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    componentCount: { type: "integer" },
    encodingSpellingValid: { type: "boolean" },
  },
  required: ["componentCount", "encodingSpellingValid"],
} as const;
/** Count supplied numeric UID components after strict lexical validation without interpreting or allocating the UID. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { uid } = request;
  const compute = (): Output => {
    const p = inspectUid({ uid });
    return {
      componentCount: uid.split(".").length,
      encodingSpellingValid:
        p.withinLengthLimit && p.leadingZeroComponents.length === 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { uid: "1.2.840.10008" },
  output: { componentCount: 4, encodingSpellingValid: true },
} satisfies ToolExample<Input, Output>;
export const dicomUidComponentCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-informatics/dicom-uid-component-count",
    title: "DICOM UID Component Count Tool",
    description:
      "Count supplied numeric UID components after strict lexical validation without interpreting or allocating the UID.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { uid: { type: "string", maxLength: 8192 } },
      required: ["uid"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        componentCount: { type: "integer" },
        encodingSpellingValid: { type: "boolean" },
      },
      required: ["componentCount", "encodingSpellingValid"],
    },
    ports: {
      inputs: [
        {
          id: "uid",
          label: "Uid",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "componentCount",
          label: "Component Count",
          valueType: { type: "integer" },
        },
        {
          id: "encodingSpellingValid",
          label: "Encoding Spelling Valid",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = dicomUidComponentCountTool.execute;
export default dicomUidComponentCountTool;
