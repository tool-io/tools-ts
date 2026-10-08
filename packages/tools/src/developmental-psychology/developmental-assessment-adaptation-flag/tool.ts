import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly standardVersion: string;
  readonly usedVersion: string;
  readonly adaptationRecorded: boolean;
};
export type Output = {
  readonly versionDiffers: boolean;
  readonly adaptationDisclosureMissing: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    standardVersion: { type: "string", maxLength: 8192, minLength: 1 },
    usedVersion: { type: "string", maxLength: 8192, minLength: 1 },
    adaptationRecorded: { type: "boolean" },
  },
  required: ["standardVersion", "usedVersion", "adaptationRecorded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    versionDiffers: { type: "boolean" },
    adaptationDisclosureMissing: { type: "boolean" },
  },
  required: ["versionDiffers", "adaptationDisclosureMissing"],
} as const;
/** Compare explicit assessment-version identifiers and a recorded adaptation flag without determining score comparability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { standardVersion, usedVersion, adaptationRecorded } = request;
  const compute = (): Output => {
    H.domain(
      standardVersion.length > 0 && usedVersion.length > 0,
      "standardVersion",
    );
    const versionDiffers = standardVersion !== usedVersion;
    return {
      versionDiffers,
      adaptationDisclosureMissing: versionDiffers && !adaptationRecorded,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    standardVersion: "v2",
    usedVersion: "adapted-v2",
    adaptationRecorded: false,
  },
  output: { versionDiffers: true, adaptationDisclosureMissing: true },
} satisfies ToolExample<Input, Output>;
export const developmentalAssessmentAdaptationFlagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: [
          "developmental-psychology",
          "developmental psychology",
          "psychology",
        ],
        keywords: ["developmental psychology", "psychology"],
      },
      id: "developmental-psychology/developmental-assessment-adaptation-flag",
      title: "Developmental Assessment Adaptation Flag",
      description:
        "Compare explicit assessment-version identifiers and a recorded adaptation flag without determining score comparability.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          standardVersion: { type: "string", maxLength: 8192, minLength: 1 },
          usedVersion: { type: "string", maxLength: 8192, minLength: 1 },
          adaptationRecorded: { type: "boolean" },
        },
        required: ["standardVersion", "usedVersion", "adaptationRecorded"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          versionDiffers: { type: "boolean" },
          adaptationDisclosureMissing: { type: "boolean" },
        },
        required: ["versionDiffers", "adaptationDisclosureMissing"],
      },
      ports: {
        inputs: [
          {
            id: "standardVersion",
            label: "Standard Version",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "usedVersion",
            label: "Used Version",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "adaptationRecorded",
            label: "Adaptation Recorded",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "versionDiffers",
            label: "Version Differs",
            valueType: { type: "boolean" },
          },
          {
            id: "adaptationDisclosureMissing",
            label: "Adaptation Disclosure Missing",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = developmentalAssessmentAdaptationFlagTool.execute;
export default developmentalAssessmentAdaptationFlagTool;
