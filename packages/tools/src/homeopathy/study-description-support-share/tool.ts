import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly descriptionFields: readonly string[];
  readonly required: readonly boolean[];
  readonly reported: readonly boolean[];
  readonly sourceVerifiable: readonly boolean[];
};
export type Output = {
  readonly requiredFields: number;
  readonly supportedFields: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    descriptionFields: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    required: { type: "array", maxItems: 256, items: { type: "boolean" } },
    reported: { type: "array", maxItems: 256, items: { type: "boolean" } },
    sourceVerifiable: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: ["descriptionFields", "required", "reported", "sourceVerifiable"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredFields: { type: "integer" },
    supportedFields: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["requiredFields", "supportedFields", "share", "defined"],
} as const;
/** Calculate study description support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { descriptionFields, required, reported, sourceVerifiable } = request;
  const compute = (): Output => {
    H.sameLength(descriptionFields, required);
    H.sameLength(descriptionFields, reported);
    H.sameLength(descriptionFields, sourceVerifiable);
    H.domain(new Set(descriptionFields).size === descriptionFields.length);
    return (() => {
      const requiredFields = required.filter(Boolean).length,
        supportedFields = required.filter(
          (x, i) => x && reported[i] && sourceVerifiable[i],
        ).length;
      return {
        requiredFields,
        supportedFields,
        share: requiredFields ? supportedFields / requiredFields : 0,
        defined: requiredFields > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    descriptionFields: ["a", "b", "c"],
    required: [true, true, false],
    reported: [true, true, true],
    sourceVerifiable: [true, false, true],
  },
  output: { requiredFields: 2, supportedFields: 1, share: 0.5, defined: true },
} satisfies ToolExample<Input, Output>;
export const studyDescriptionSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "homeopathy/study-description-support-share",
    title: "Study Description Support Share Tool",
    description:
      "Calculate study description support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        descriptionFields: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        required: { type: "array", maxItems: 256, items: { type: "boolean" } },
        reported: { type: "array", maxItems: 256, items: { type: "boolean" } },
        sourceVerifiable: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: [
        "descriptionFields",
        "required",
        "reported",
        "sourceVerifiable",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredFields: { type: "integer" },
        supportedFields: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["requiredFields", "supportedFields", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "descriptionFields",
          label: "Description Fields",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "required",
          label: "Required",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "reported",
          label: "Reported",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "sourceVerifiable",
          label: "Source Verifiable",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "requiredFields",
          label: "Required Fields",
          valueType: { type: "integer" },
        },
        {
          id: "supportedFields",
          label: "Supported Fields",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = studyDescriptionSupportShareTool.execute;
export default studyDescriptionSupportShareTool;
