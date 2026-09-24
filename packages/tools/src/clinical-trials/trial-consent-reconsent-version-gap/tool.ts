import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly oldVersion: string;
  readonly newVersion: string;
  readonly signedVersion: string;
  readonly changeDay: number;
  readonly signedDay: number;
  readonly visitDay: number;
};
export type Output = {
  readonly versionChanged: boolean;
  readonly signedCurrent: boolean;
  readonly gapDays: number;
  readonly currentBeforeVisit: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oldVersion: { type: "string", maxLength: 8192 },
    newVersion: { type: "string", maxLength: 8192 },
    signedVersion: { type: "string", maxLength: 8192 },
    changeDay: { type: "integer" },
    signedDay: { type: "integer" },
    visitDay: { type: "integer" },
  },
  required: [
    "oldVersion",
    "newVersion",
    "signedVersion",
    "changeDay",
    "signedDay",
    "visitDay",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    versionChanged: { type: "boolean" },
    signedCurrent: { type: "boolean" },
    gapDays: { type: "integer" },
    currentBeforeVisit: { type: "boolean" },
  },
  required: [
    "versionChanged",
    "signedCurrent",
    "gapDays",
    "currentBeforeVisit",
  ],
} as const;
/** Audit supplied reconsent version/date metadata. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    oldVersion,
    newVersion,
    signedVersion,
    changeDay,
    signedDay,
    visitDay,
  } = request;
  const compute = (): Output => {
    return {
      versionChanged: oldVersion !== newVersion,
      signedCurrent: signedVersion === newVersion,
      gapDays: signedDay - changeDay,
      currentBeforeVisit:
        signedVersion === newVersion &&
        signedDay >= changeDay &&
        signedDay <= visitDay,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    oldVersion: "v1",
    newVersion: "v2",
    signedVersion: "v2",
    changeDay: 100,
    signedDay: 103,
    visitDay: 110,
  },
  output: {
    versionChanged: true,
    signedCurrent: true,
    gapDays: 3,
    currentBeforeVisit: true,
  },
} satisfies ToolExample<Input, Output>;
export const trialConsentReconsentVersionGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-trials/trial-consent-reconsent-version-gap",
    title: "Trial Consent Reconsent Version Gap Tool",
    description: "Audit supplied reconsent version/date metadata.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        oldVersion: { type: "string", maxLength: 8192 },
        newVersion: { type: "string", maxLength: 8192 },
        signedVersion: { type: "string", maxLength: 8192 },
        changeDay: { type: "integer" },
        signedDay: { type: "integer" },
        visitDay: { type: "integer" },
      },
      required: [
        "oldVersion",
        "newVersion",
        "signedVersion",
        "changeDay",
        "signedDay",
        "visitDay",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        versionChanged: { type: "boolean" },
        signedCurrent: { type: "boolean" },
        gapDays: { type: "integer" },
        currentBeforeVisit: { type: "boolean" },
      },
      required: [
        "versionChanged",
        "signedCurrent",
        "gapDays",
        "currentBeforeVisit",
      ],
    },
    ports: {
      inputs: [
        {
          id: "oldVersion",
          label: "Old Version",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "newVersion",
          label: "New Version",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "signedVersion",
          label: "Signed Version",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "changeDay",
          label: "Change Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "signedDay",
          label: "Signed Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "visitDay",
          label: "Visit Day",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "versionChanged",
          label: "Version Changed",
          valueType: { type: "boolean" },
        },
        {
          id: "signedCurrent",
          label: "Signed Current",
          valueType: { type: "boolean" },
        },
        { id: "gapDays", label: "Gap Days", valueType: { type: "integer" } },
        {
          id: "currentBeforeVisit",
          label: "Current Before Visit",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = trialConsentReconsentVersionGapTool.execute;
export default trialConsentReconsentVersionGapTool;
