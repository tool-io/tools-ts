import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly length: number;
  readonly slackLength: number;
  readonly referenceStrain: number;
};
export type Output = {
  readonly strain: number;
  readonly extension: number;
  readonly strainGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "number", minimum: 0 },
    slackLength: { type: "number", exclusiveMinimum: 0 },
    referenceStrain: { type: "number" },
  },
  required: ["length", "slackLength", "referenceStrain"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    strain: { type: "number" },
    extension: { type: "number" },
    strainGap: { type: "number" },
  },
  required: ["strain", "extension", "strainGap"],
} as const;
/** Engineering strain relative to a caller-supplied slack length; negative values remain visible without implying tendon compression mechanics. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { length, slackLength, referenceStrain } = request;
  const compute = (): Output => {
    H.domain(length >= 0);
    H.positive(slackLength);
    return {
      strain: (length - slackLength) / slackLength,
      extension: length - slackLength,
      strainGap: (length - slackLength) / slackLength - referenceStrain,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { length: 110, slackLength: 100, referenceStrain: 0.08 },
  output: { strain: 0.1, extension: 10, strainGap: 0.020000000000000004 },
} satisfies ToolExample<Input, Output>;
export const tendonStrainSlackLengthReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biomechanics/tendon-strain-slack-length-reference",
    title: "Tendon Strain Slack Length Reference Tool",
    description:
      "Engineering strain relative to a caller-supplied slack length; negative values remain visible without implying tendon compression mechanics.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        length: { type: "number", minimum: 0 },
        slackLength: { type: "number", exclusiveMinimum: 0 },
        referenceStrain: { type: "number" },
      },
      required: ["length", "slackLength", "referenceStrain"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        strain: { type: "number" },
        extension: { type: "number" },
        strainGap: { type: "number" },
      },
      required: ["strain", "extension", "strainGap"],
    },
    ports: {
      inputs: [
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "slackLength",
          label: "Slack Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceStrain",
          label: "Reference Strain",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "strain", label: "Strain", valueType: { type: "number" } },
        { id: "extension", label: "Extension", valueType: { type: "number" } },
        { id: "strainGap", label: "Strain Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = tendonStrainSlackLengthReferenceTool.execute;
export default tendonStrainSlackLengthReferenceTool;
