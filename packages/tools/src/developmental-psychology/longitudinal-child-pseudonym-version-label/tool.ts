import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly participantId: string;
  readonly pseudonym: string;
  readonly version: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    participantId: { type: "string", maxLength: 8192, minLength: 1 },
    pseudonym: { type: "string", maxLength: 8192, minLength: 1 },
    version: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["participantId", "pseudonym", "version"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Associate an explicit longitudinal-study pseudonym with its supplied version without asserting deidentification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { participantId, pseudonym, version } = request;
  const compute = (): Output => {
    H.domain(participantId.length > 0, "participantId");
    H.domain(pseudonym.length > 0, "pseudonym");
    H.domain(version.length > 0, "version");
    return { token: JSON.stringify([participantId, pseudonym, version]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { participantId: "P17", pseudonym: "Child A", version: "v2" },
  output: { token: '["P17","Child A","v2"]' },
} satisfies ToolExample<Input, Output>;
export const longitudinalChildPseudonymVersionLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "developmental-psychology/longitudinal-child-pseudonym-version-label",
      title: "Longitudinal Child Pseudonym Version Label Tool",
      description:
        "Associate an explicit longitudinal-study pseudonym with its supplied version without asserting deidentification.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          participantId: { type: "string", maxLength: 8192, minLength: 1 },
          pseudonym: { type: "string", maxLength: 8192, minLength: 1 },
          version: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["participantId", "pseudonym", "version"],
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
            id: "participantId",
            label: "Participant Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "pseudonym",
            label: "Pseudonym",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "version",
            label: "Version",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = longitudinalChildPseudonymVersionLabelTool.execute;
export default longitudinalChildPseudonymVersionLabelTool;
