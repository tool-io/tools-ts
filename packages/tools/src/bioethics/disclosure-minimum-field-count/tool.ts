import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredFields: readonly string[];
  readonly disclosedFields: readonly string[];
};
export type Output = {
  readonly requiredCount: number;
  readonly presentCount: number;
  readonly missingCount: number;
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
    disclosedFields: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["requiredFields", "disclosedFields"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredCount: { type: "integer" },
    presentCount: { type: "integer" },
    missingCount: { type: "integer" },
  },
  required: ["requiredCount", "presentCount", "missingCount"],
} as const;
/** Calculate disclosure minimum field count from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requiredFields, disclosedFields } = request;
  const compute = (): Output => {
    return {
      requiredCount: new Set(requiredFields).size,
      presentCount: new Set(
        requiredFields.filter((x) => disclosedFields.includes(x)),
      ).size,
      missingCount: new Set(
        requiredFields.filter((x) => !disclosedFields.includes(x)),
      ).size,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requiredFields: ["purpose", "risk"], disclosedFields: ["purpose"] },
  output: { requiredCount: 2, presentCount: 1, missingCount: 1 },
} satisfies ToolExample<Input, Output>;
export const disclosureMinimumFieldCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioethics/disclosure-minimum-field-count",
    title: "Disclosure Minimum Field Count Tool",
    description:
      "Calculate disclosure minimum field count from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredFields: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        disclosedFields: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["requiredFields", "disclosedFields"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredCount: { type: "integer" },
        presentCount: { type: "integer" },
        missingCount: { type: "integer" },
      },
      required: ["requiredCount", "presentCount", "missingCount"],
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
          id: "disclosedFields",
          label: "Disclosed Fields",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "requiredCount",
          label: "Required Count",
          valueType: { type: "integer" },
        },
        {
          id: "presentCount",
          label: "Present Count",
          valueType: { type: "integer" },
        },
        {
          id: "missingCount",
          label: "Missing Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = disclosureMinimumFieldCountTool.execute;
export default disclosureMinimumFieldCountTool;
