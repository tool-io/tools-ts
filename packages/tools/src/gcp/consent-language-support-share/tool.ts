import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly participantIds: readonly string[];
  readonly preferredLanguages: readonly string[];
  readonly consentLanguages: readonly string[];
  readonly consentVersions: readonly string[];
  readonly requiredVersions: readonly string[];
};
export type Output = {
  readonly participants: number;
  readonly languageAndVersionSupported: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    participantIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    preferredLanguages: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    consentLanguages: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    consentVersions: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    requiredVersions: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: [
    "participantIds",
    "preferredLanguages",
    "consentLanguages",
    "consentVersions",
    "requiredVersions",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    participants: { type: "integer" },
    languageAndVersionSupported: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["participants", "languageAndVersionSupported", "share", "defined"],
} as const;
/** Calculate consent language support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    participantIds,
    preferredLanguages,
    consentLanguages,
    consentVersions,
    requiredVersions,
  } = request;
  const compute = (): Output => {
    H.sameLength(participantIds, preferredLanguages);
    H.sameLength(participantIds, consentLanguages);
    H.sameLength(participantIds, consentVersions);
    H.sameLength(participantIds, requiredVersions);
    return (() => {
      const all = new Set(participantIds),
        yes = new Set(
          participantIds.filter(
            (x, i) =>
              preferredLanguages[i] === consentLanguages[i] &&
              consentVersions[i] === requiredVersions[i],
          ),
        );
      return {
        participants: all.size,
        languageAndVersionSupported: yes.size,
        share: all.size ? yes.size / all.size : 0,
        defined: all.size > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    participantIds: ["p1", "p2"],
    preferredLanguages: ["en", "fr"],
    consentLanguages: ["en", "en"],
    consentVersions: ["v2", "v2"],
    requiredVersions: ["v2", "v2"],
  },
  output: {
    participants: 2,
    languageAndVersionSupported: 1,
    share: 0.5,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const consentLanguageSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gcp/consent-language-support-share",
    title: "Consent Language Support Share Tool",
    description:
      "Calculate consent language support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        participantIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        preferredLanguages: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        consentLanguages: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        consentVersions: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        requiredVersions: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: [
        "participantIds",
        "preferredLanguages",
        "consentLanguages",
        "consentVersions",
        "requiredVersions",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        participants: { type: "integer" },
        languageAndVersionSupported: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "participants",
        "languageAndVersionSupported",
        "share",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "participantIds",
          label: "Participant Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "preferredLanguages",
          label: "Preferred Languages",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "consentLanguages",
          label: "Consent Languages",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "consentVersions",
          label: "Consent Versions",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "requiredVersions",
          label: "Required Versions",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "participants",
          label: "Participants",
          valueType: { type: "integer" },
        },
        {
          id: "languageAndVersionSupported",
          label: "Language And Version Supported",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = consentLanguageSupportShareTool.execute;
export default consentLanguageSupportShareTool;
