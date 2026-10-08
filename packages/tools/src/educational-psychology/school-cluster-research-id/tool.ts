import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly studyNamespace: string;
  readonly schoolCode: string;
  readonly participantCode: string;
};
export type Output = { readonly idToken: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    studyNamespace: { type: "string", maxLength: 8192, minLength: 1 },
    schoolCode: { type: "string", maxLength: 8192, minLength: 1 },
    participantCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["studyNamespace", "schoolCode", "participantCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { idToken: { type: "string", maxLength: 8192 } },
  required: ["idToken"],
} as const;
/** Namespace explicit research school-cluster and participant codes without resolving a child’s identity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { studyNamespace, schoolCode, participantCode } = request;
  const compute = (): Output => {
    H.domain(
      studyNamespace.length > 0 &&
        schoolCode.length > 0 &&
        participantCode.length > 0,
      "studyNamespace",
    );
    return {
      idToken: JSON.stringify([studyNamespace, schoolCode, participantCode]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { studyNamespace: "ST17", schoolCode: "SC3", participantCode: "P2" },
  output: { idToken: '["ST17","SC3","P2"]' },
} satisfies ToolExample<Input, Output>;
export const schoolClusterResearchIdTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "educational-psychology",
        "educational psychology",
        "psychology",
      ],
      keywords: ["educational psychology", "psychology"],
    },
    id: "educational-psychology/school-cluster-research-id",
    title: "School Cluster Research ID",
    description:
      "Namespace explicit research school-cluster and participant codes without resolving a child’s identity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        studyNamespace: { type: "string", maxLength: 8192, minLength: 1 },
        schoolCode: { type: "string", maxLength: 8192, minLength: 1 },
        participantCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["studyNamespace", "schoolCode", "participantCode"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { idToken: { type: "string", maxLength: 8192 } },
      required: ["idToken"],
    },
    ports: {
      inputs: [
        {
          id: "studyNamespace",
          label: "Study Namespace",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "schoolCode",
          label: "School Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "participantCode",
          label: "Participant Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "idToken", label: "Id Token", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = schoolClusterResearchIdTool.execute;
export default schoolClusterResearchIdTool;
