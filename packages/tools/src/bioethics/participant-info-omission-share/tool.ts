import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredFields: readonly string[];
  readonly disclosedFields: readonly string[];
  readonly fieldWeights: readonly number[];
};
export type Output = {
  readonly missingWeight: number;
  readonly requiredWeight: number;
  readonly omissionShare: number;
  readonly defined: boolean;
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
    fieldWeights: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
  },
  required: ["requiredFields", "disclosedFields", "fieldWeights"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    missingWeight: { type: "number" },
    requiredWeight: { type: "number" },
    omissionShare: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["missingWeight", "requiredWeight", "omissionShare", "defined"],
} as const;
/** Measure weighted disclosure omissions against an explicit field inventory, without assessing consent adequacy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requiredFields, disclosedFields, fieldWeights } = request;
  const compute = (): Output => {
    H.sameLength(requiredFields, fieldWeights);
    H.domain(
      new Set(requiredFields).size === requiredFields.length &&
        fieldWeights.every((x) => x >= 0),
    );
    return (() => {
      const requiredWeight = fieldWeights.reduce((a, b) => a + b, 0),
        missingWeight = fieldWeights.reduce(
          (s, w, i) =>
            s + (disclosedFields.includes(requiredFields[i]) ? 0 : w),
          0,
        );
      return {
        missingWeight,
        requiredWeight,
        omissionShare: requiredWeight > 0 ? missingWeight / requiredWeight : 0,
        defined: requiredWeight > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    requiredFields: ["purpose", "contact"],
    disclosedFields: ["purpose"],
    fieldWeights: [3, 1],
  },
  output: {
    missingWeight: 1,
    requiredWeight: 4,
    omissionShare: 0.25,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const participantInfoOmissionShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioethics/participant-info-omission-share",
    title: "Participant Info Omission Share Tool",
    description:
      "Measure weighted disclosure omissions against an explicit field inventory, without assessing consent adequacy.",
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
        fieldWeights: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
      },
      required: ["requiredFields", "disclosedFields", "fieldWeights"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        missingWeight: { type: "number" },
        requiredWeight: { type: "number" },
        omissionShare: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["missingWeight", "requiredWeight", "omissionShare", "defined"],
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
        {
          id: "fieldWeights",
          label: "Field Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "missingWeight",
          label: "Missing Weight",
          valueType: { type: "number" },
        },
        {
          id: "requiredWeight",
          label: "Required Weight",
          valueType: { type: "number" },
        },
        {
          id: "omissionShare",
          label: "Omission Share",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = participantInfoOmissionShareTool.execute;
export default participantInfoOmissionShareTool;
