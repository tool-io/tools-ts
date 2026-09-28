import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly prefix: readonly string[];
  readonly given: readonly string[];
  readonly family: string;
  readonly suffix: readonly string[];
};
export type Output = {
  readonly parts: readonly string[];
  readonly display: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    prefix: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    given: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    family: { type: "string", maxLength: 8192 },
    suffix: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["prefix", "given", "family", "suffix"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parts: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    display: { type: "string", maxLength: 8192 },
  },
  required: ["parts", "display"],
} as const;
/** Assemble explicitly ordered name components with spaces for a caller-selected display convention; no cultural ordering is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { prefix, given, family, suffix } = request;
  const compute = (): Output => {
    H.domain([...prefix, ...given, ...suffix].every((x) => x.length > 0));
    const parts = [
      ...prefix,
      ...given,
      ...(family.length ? [family] : []),
      ...suffix,
    ];
    return { parts, display: parts.join(" ") };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    prefix: ["Dr"],
    given: ["Alex", "J."],
    family: "Smith",
    suffix: ["Jr"],
  },
  output: {
    parts: ["Dr", "Alex", "J.", "Smith", "Jr"],
    display: "Dr Alex J. Smith Jr",
  },
} satisfies ToolExample<Input, Output>;
export const fhirHumanNamePrefixSuffixComponentsTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "health-informatics/fhir-human-name-prefix-suffix-components",
      title: "FHIR Human Name Prefix Suffix Components Tool",
      description:
        "Assemble explicitly ordered name components with spaces for a caller-selected display convention; no cultural ordering is inferred.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          prefix: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          given: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          family: { type: "string", maxLength: 8192 },
          suffix: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["prefix", "given", "family", "suffix"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          parts: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          display: { type: "string", maxLength: 8192 },
        },
        required: ["parts", "display"],
      },
      ports: {
        inputs: [
          {
            id: "prefix",
            label: "Prefix",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "given",
            label: "Given",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "family",
            label: "Family",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suffix",
            label: "Suffix",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
        outputs: [
          {
            id: "parts",
            label: "Parts",
            valueType: { type: "list", items: { type: "string" } },
          },
          { id: "display", label: "Display", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = fhirHumanNamePrefixSuffixComponentsTool.execute;
export default fhirHumanNamePrefixSuffixComponentsTool;
