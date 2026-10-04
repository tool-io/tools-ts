import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly signedVersion: string;
  readonly requiredVersion: string;
};
export type Output = { readonly matches: boolean; readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedVersion: { type: "string", maxLength: 8192 },
    requiredVersion: { type: "string", maxLength: 8192 },
  },
  required: ["signedVersion", "requiredVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    matches: { type: "boolean" },
    label: { type: "string", maxLength: 8192 },
  },
  required: ["matches", "label"],
} as const;
/** Compare consent form version identifiers literally; matching identifiers alone do not establish valid consent. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { signedVersion, requiredVersion } = request;
  const compute = (): Output => {
    H.domain(
      signedVersion.length > 0 && requiredVersion.length > 0,
      "signedVersion",
    );
    return {
      matches: signedVersion === requiredVersion,
      label:
        "signed=" +
        JSON.stringify(signedVersion) +
        "; required=" +
        JSON.stringify(requiredVersion),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { signedVersion: "v2", requiredVersion: "v3" },
  output: { matches: false, label: 'signed="v2"; required="v3"' },
} satisfies ToolExample<Input, Output>;
export const consentSignedVersionPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioethics/consent-signed-version-pair",
    title: "Consent Signed Version Pair Tool",
    description:
      "Compare consent form version identifiers literally; matching identifiers alone do not establish valid consent.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedVersion: { type: "string", maxLength: 8192 },
        requiredVersion: { type: "string", maxLength: 8192 },
      },
      required: ["signedVersion", "requiredVersion"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        matches: { type: "boolean" },
        label: { type: "string", maxLength: 8192 },
      },
      required: ["matches", "label"],
    },
    ports: {
      inputs: [
        {
          id: "signedVersion",
          label: "Signed Version",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "requiredVersion",
          label: "Required Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "matches", label: "Matches", valueType: { type: "boolean" } },
        { id: "label", label: "Label", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = consentSignedVersionPairTool.execute;
export default consentSignedVersionPairTool;
