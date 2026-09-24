import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredLanguages: readonly string[];
  readonly suppliedLanguages: readonly string[];
  readonly editionLabels: readonly string[];
  readonly requiredEdition: string;
};
export type Output = {
  readonly required: number;
  readonly languagePresent: number;
  readonly currentEditionLanguages: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredLanguages: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    suppliedLanguages: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    editionLabels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    requiredEdition: { type: "string", maxLength: 8192 },
  },
  required: [
    "requiredLanguages",
    "suppliedLanguages",
    "editionLabels",
    "requiredEdition",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    required: { type: "integer" },
    languagePresent: { type: "integer" },
    currentEditionLanguages: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: [
    "required",
    "languagePresent",
    "currentEditionLanguages",
    "share",
    "defined",
  ],
} as const;
/** Calculate leaflet language support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    requiredLanguages,
    suppliedLanguages,
    editionLabels,
    requiredEdition,
  } = request;
  const compute = (): Output => {
    H.sameLength(suppliedLanguages, editionLabels);
    return (() => {
      const r = [...new Set(requiredLanguages)],
        languagePresent = r.filter((x) => suppliedLanguages.includes(x)).length,
        currentEditionLanguages = r.filter((x) =>
          suppliedLanguages.some(
            (s, i) => s === x && editionLabels[i] === requiredEdition,
          ),
        ).length;
      return {
        required: r.length,
        languagePresent,
        currentEditionLanguages,
        share: r.length ? currentEditionLanguages / r.length : 0,
        defined: r.length > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    requiredLanguages: ["en", "fr"],
    suppliedLanguages: ["en", "fr"],
    editionLabels: ["v2", "v1"],
    requiredEdition: "v2",
  },
  output: {
    required: 2,
    languagePresent: 2,
    currentEditionLanguages: 1,
    share: 0.5,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const leafletLanguageSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "community-pharmacy/leaflet-language-support-share",
    title: "Leaflet Language Support Share Tool",
    description:
      "Calculate leaflet language support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredLanguages: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        suppliedLanguages: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        editionLabels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        requiredEdition: { type: "string", maxLength: 8192 },
      },
      required: [
        "requiredLanguages",
        "suppliedLanguages",
        "editionLabels",
        "requiredEdition",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        required: { type: "integer" },
        languagePresent: { type: "integer" },
        currentEditionLanguages: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "required",
        "languagePresent",
        "currentEditionLanguages",
        "share",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "requiredLanguages",
          label: "Required Languages",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "suppliedLanguages",
          label: "Supplied Languages",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "editionLabels",
          label: "Edition Labels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "requiredEdition",
          label: "Required Edition",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "required", label: "Required", valueType: { type: "integer" } },
        {
          id: "languagePresent",
          label: "Language Present",
          valueType: { type: "integer" },
        },
        {
          id: "currentEditionLanguages",
          label: "Current Edition Languages",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = leafletLanguageSupportShareTool.execute;
export default leafletLanguageSupportShareTool;
