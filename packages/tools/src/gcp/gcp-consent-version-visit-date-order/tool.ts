import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly consentVersion: string;
  readonly requiredVersion: string;
  readonly signedDay: number;
  readonly visitDay: number;
  readonly versionEffectiveDay: number;
  readonly withdrawn: boolean;
};
export type Output = {
  readonly versionMatches: boolean;
  readonly signedBeforeVisit: boolean;
  readonly signedAfterEffective: boolean;
  readonly recordMatches: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    consentVersion: { type: "string", maxLength: 8192 },
    requiredVersion: { type: "string", maxLength: 8192 },
    signedDay: { type: "integer" },
    visitDay: { type: "integer" },
    versionEffectiveDay: { type: "integer" },
    withdrawn: { type: "boolean" },
  },
  required: [
    "consentVersion",
    "requiredVersion",
    "signedDay",
    "visitDay",
    "versionEffectiveDay",
    "withdrawn",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    versionMatches: { type: "boolean" },
    signedBeforeVisit: { type: "boolean" },
    signedAfterEffective: { type: "boolean" },
    recordMatches: { type: "boolean" },
  },
  required: [
    "versionMatches",
    "signedBeforeVisit",
    "signedAfterEffective",
    "recordMatches",
  ],
} as const;
/** Audit explicit consent-version/date records without deciding legal consent. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    consentVersion,
    requiredVersion,
    signedDay,
    visitDay,
    versionEffectiveDay,
    withdrawn,
  } = request;
  const compute = (): Output => {
    const versionMatches = consentVersion === requiredVersion,
      signedBeforeVisit = signedDay <= visitDay,
      signedAfterEffective = signedDay >= versionEffectiveDay;
    return {
      versionMatches,
      signedBeforeVisit,
      signedAfterEffective,
      recordMatches:
        versionMatches &&
        signedBeforeVisit &&
        signedAfterEffective &&
        !withdrawn,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    consentVersion: "v2",
    requiredVersion: "v2",
    signedDay: 105,
    visitDay: 110,
    versionEffectiveDay: 100,
    withdrawn: false,
  },
  output: {
    versionMatches: true,
    signedBeforeVisit: true,
    signedAfterEffective: true,
    recordMatches: true,
  },
} satisfies ToolExample<Input, Output>;
export const gcpConsentVersionVisitDateOrderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gcp/gcp-consent-version-visit-date-order",
    title: "GCP Consent Version Visit Date Order Tool",
    description:
      "Audit explicit consent-version/date records without deciding legal consent.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        consentVersion: { type: "string", maxLength: 8192 },
        requiredVersion: { type: "string", maxLength: 8192 },
        signedDay: { type: "integer" },
        visitDay: { type: "integer" },
        versionEffectiveDay: { type: "integer" },
        withdrawn: { type: "boolean" },
      },
      required: [
        "consentVersion",
        "requiredVersion",
        "signedDay",
        "visitDay",
        "versionEffectiveDay",
        "withdrawn",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        versionMatches: { type: "boolean" },
        signedBeforeVisit: { type: "boolean" },
        signedAfterEffective: { type: "boolean" },
        recordMatches: { type: "boolean" },
      },
      required: [
        "versionMatches",
        "signedBeforeVisit",
        "signedAfterEffective",
        "recordMatches",
      ],
    },
    ports: {
      inputs: [
        {
          id: "consentVersion",
          label: "Consent Version",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "requiredVersion",
          label: "Required Version",
          required: true,
          valueType: { type: "string" },
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
        {
          id: "versionEffectiveDay",
          label: "Version Effective Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "withdrawn",
          label: "Withdrawn",
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
          id: "signedBeforeVisit",
          label: "Signed Before Visit",
          valueType: { type: "boolean" },
        },
        {
          id: "signedAfterEffective",
          label: "Signed After Effective",
          valueType: { type: "boolean" },
        },
        {
          id: "recordMatches",
          label: "Record Matches",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = gcpConsentVersionVisitDateOrderTool.execute;
export default gcpConsentVersionVisitDateOrderTool;
