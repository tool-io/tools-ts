import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredVersion: string;
  readonly acknowledgedVersion: string;
  readonly acknowledged: boolean;
  readonly revoked: boolean;
};
export type Output = {
  readonly versionMatches: boolean;
  readonly acknowledgedCurrent: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredVersion: { type: "string", maxLength: 8192 },
    acknowledgedVersion: { type: "string", maxLength: 8192 },
    acknowledged: { type: "boolean" },
    revoked: { type: "boolean" },
  },
  required: [
    "requiredVersion",
    "acknowledgedVersion",
    "acknowledged",
    "revoked",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    versionMatches: { type: "boolean" },
    acknowledgedCurrent: { type: "boolean" },
  },
  required: ["versionMatches", "acknowledgedCurrent"],
} as const;
/** Compare acknowledged and required supplied protective-policy versions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requiredVersion, acknowledgedVersion, acknowledged, revoked } =
    request;
  const compute = (): Output => {
    H.domain(requiredVersion.length > 0 && acknowledgedVersion.length > 0);
    const versionMatches = requiredVersion === acknowledgedVersion;
    return {
      versionMatches,
      acknowledgedCurrent: versionMatches && acknowledged && !revoked,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    requiredVersion: "v3",
    acknowledgedVersion: "v2",
    acknowledged: true,
    revoked: false,
  },
  output: { versionMatches: false, acknowledgedCurrent: false },
} satisfies ToolExample<Input, Output>;
export const biosecurityTrainingAcknowledgedVersionPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biosecurity/biosecurity-training-acknowledged-version-pair",
      title: "Biosecurity Training Acknowledged Version Pair Tool",
      description:
        "Compare acknowledged and required supplied protective-policy versions.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          requiredVersion: { type: "string", maxLength: 8192 },
          acknowledgedVersion: { type: "string", maxLength: 8192 },
          acknowledged: { type: "boolean" },
          revoked: { type: "boolean" },
        },
        required: [
          "requiredVersion",
          "acknowledgedVersion",
          "acknowledged",
          "revoked",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          versionMatches: { type: "boolean" },
          acknowledgedCurrent: { type: "boolean" },
        },
        required: ["versionMatches", "acknowledgedCurrent"],
      },
      ports: {
        inputs: [
          {
            id: "requiredVersion",
            label: "Required Version",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "acknowledgedVersion",
            label: "Acknowledged Version",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "acknowledged",
            label: "Acknowledged",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "revoked",
            label: "Revoked",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "versionMatches",
            label: "Version Matches",
            valueType: { type: "boolean" },
          },
          {
            id: "acknowledgedCurrent",
            label: "Acknowledged Current",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = biosecurityTrainingAcknowledgedVersionPairTool.execute;
export default biosecurityTrainingAcknowledgedVersionPairTool;
