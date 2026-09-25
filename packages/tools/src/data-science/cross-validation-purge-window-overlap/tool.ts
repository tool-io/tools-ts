import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly labelStart: number;
  readonly labelEnd: number;
  readonly validationStart: number;
  readonly validationEnd: number;
  readonly embargo: number;
};
export type Output = { readonly overlap: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    labelStart: { type: "number" },
    labelEnd: { type: "number" },
    validationStart: { type: "number" },
    validationEnd: { type: "number" },
    embargo: { type: "number", minimum: 0 },
  },
  required: [
    "labelStart",
    "labelEnd",
    "validationStart",
    "validationEnd",
    "embargo",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { overlap: { type: "boolean" } },
  required: ["overlap"],
} as const;
/** Half-open label and validation information windows with an explicit embargo appended after validation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { labelStart, labelEnd, validationStart, validationEnd, embargo } =
    request;
  const compute = (): Output => {
    H.domain(
      labelEnd >= labelStart &&
        validationEnd >= validationStart &&
        embargo >= 0,
    );
    return {
      overlap:
        Math.min(labelEnd, validationEnd + embargo) >
        Math.max(labelStart, validationStart),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    labelStart: 1,
    labelEnd: 5,
    validationStart: 4,
    validationEnd: 8,
    embargo: 0,
  },
  output: { overlap: true },
} satisfies ToolExample<Input, Output>;
export const crossValidationPurgeWindowOverlapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "data-science/cross-validation-purge-window-overlap",
    title: "Cross Validation Purge Window Overlap Tool",
    description:
      "Half-open label and validation information windows with an explicit embargo appended after validation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        labelStart: { type: "number" },
        labelEnd: { type: "number" },
        validationStart: { type: "number" },
        validationEnd: { type: "number" },
        embargo: { type: "number", minimum: 0 },
      },
      required: [
        "labelStart",
        "labelEnd",
        "validationStart",
        "validationEnd",
        "embargo",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { overlap: { type: "boolean" } },
      required: ["overlap"],
    },
    ports: {
      inputs: [
        {
          id: "labelStart",
          label: "Label Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "labelEnd",
          label: "Label End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "validationStart",
          label: "Validation Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "validationEnd",
          label: "Validation End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "embargo",
          label: "Embargo",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "overlap", label: "Overlap", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = crossValidationPurgeWindowOverlapTool.execute;
export default crossValidationPurgeWindowOverlapTool;
