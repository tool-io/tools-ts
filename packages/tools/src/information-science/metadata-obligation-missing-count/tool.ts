import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredFields: readonly string[];
  readonly presentFields: readonly string[];
};
export type Output = {
  readonly missingCount: number;
  readonly missingFields: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredFields: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    presentFields: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["requiredFields", "presentFields"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    missingCount: { type: "integer" },
    missingFields: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["missingCount", "missingFields"],
} as const;
/** Count explicit metadata obligations without inferring a cataloging standard. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requiredFields, presentFields } = request;
  const compute = (): Output => {
    return {
      missingCount: new Set(
        requiredFields.filter((x) => !presentFields.includes(x)),
      ).size,
      missingFields: [
        ...new Set(requiredFields.filter((x) => !presentFields.includes(x))),
      ],
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requiredFields: ["title", "source"], presentFields: ["title"] },
  output: { missingCount: 1, missingFields: ["source"] },
} satisfies ToolExample<Input, Output>;
export const metadataObligationMissingCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information-science/metadata-obligation-missing-count",
    title: "Metadata Obligation Missing Count Tool",
    description:
      "Count explicit metadata obligations without inferring a cataloging standard.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredFields: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        presentFields: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["requiredFields", "presentFields"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        missingCount: { type: "integer" },
        missingFields: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["missingCount", "missingFields"],
    },
    ports: {
      inputs: [
        {
          id: "requiredFields",
          label: "Required Fields",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "presentFields",
          label: "Present Fields",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "missingCount",
          label: "Missing Count",
          valueType: { type: "integer" },
        },
        {
          id: "missingFields",
          label: "Missing Fields",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = metadataObligationMissingCountTool.execute;
export default metadataObligationMissingCountTool;
