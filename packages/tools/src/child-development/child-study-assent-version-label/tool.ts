import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly studyCode: string;
  readonly assentVersion: string;
  readonly assentRecorded: boolean;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    studyCode: { type: "string", maxLength: 8192, minLength: 1 },
    assentVersion: { type: "string", maxLength: 8192, minLength: 1 },
    assentRecorded: { type: "boolean" },
  },
  required: ["studyCode", "assentVersion", "assentRecorded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label explicit study assent-version metadata without determining consent requirements or participation authorization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { studyCode, assentVersion, assentRecorded } = request;
  const compute = (): Output => {
    H.domain(studyCode.length > 0 && assentVersion.length > 0, "studyCode");
    return {
      label:
        studyCode +
        "; assent version=" +
        assentVersion +
        "; " +
        (assentRecorded ? "recorded" : "not recorded"),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { studyCode: "ST17", assentVersion: "v2", assentRecorded: true },
  output: { label: "ST17; assent version=v2; recorded" },
} satisfies ToolExample<Input, Output>;
export const childStudyAssentVersionLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["child-development", "child development", "psychology"],
      keywords: ["child development", "psychology"],
    },
    id: "child-development/child-study-assent-version-label",
    title: "Child Study Assent Version Label",
    description:
      "Label explicit study assent-version metadata without determining consent requirements or participation authorization.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        studyCode: { type: "string", maxLength: 8192, minLength: 1 },
        assentVersion: { type: "string", maxLength: 8192, minLength: 1 },
        assentRecorded: { type: "boolean" },
      },
      required: ["studyCode", "assentVersion", "assentRecorded"],
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
          id: "studyCode",
          label: "Study Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "assentVersion",
          label: "Assent Version",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "assentRecorded",
          label: "Assent Recorded",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = childStudyAssentVersionLabelTool.execute;
export default childStudyAssentVersionLabelTool;
