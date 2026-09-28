import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedGravity: number;
  readonly suppliedDatumOffset: number;
  readonly suppliedScale: number;
  readonly subtractOffset: boolean;
};
export type Output = {
  readonly correction: number;
  readonly corrected: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedGravity: { type: "number" },
    suppliedDatumOffset: { type: "number" },
    suppliedScale: { type: "number", exclusiveMinimum: 0 },
    subtractOffset: { type: "boolean" },
  },
  required: [
    "observedGravity",
    "suppliedDatumOffset",
    "suppliedScale",
    "subtractOffset",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { correction: { type: "number" }, corrected: { type: "number" } },
  required: ["correction", "corrected"],
} as const;
/** Apply a signed supplied gravity datum correction and unit factor without estimating a geophysical datum. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    observedGravity,
    suppliedDatumOffset,
    suppliedScale,
    subtractOffset,
  } = request;
  const compute = (): Output => {
    H.positive(suppliedScale);
    return {
      correction:
        (subtractOffset ? -1 : 1) * suppliedDatumOffset * suppliedScale,
      corrected:
        observedGravity +
        (subtractOffset ? -1 : 1) * suppliedDatumOffset * suppliedScale,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observedGravity: 100,
    suppliedDatumOffset: 2,
    suppliedScale: 3,
    subtractOffset: true,
  },
  output: { correction: -6, corrected: 94 },
} satisfies ToolExample<Input, Output>;
export const gravityDatumOffsetContributionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geophysics/gravity-datum-offset-contribution",
    title: "Gravity Datum Offset Contribution Tool",
    description:
      "Apply a signed supplied gravity datum correction and unit factor without estimating a geophysical datum.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedGravity: { type: "number" },
        suppliedDatumOffset: { type: "number" },
        suppliedScale: { type: "number", exclusiveMinimum: 0 },
        subtractOffset: { type: "boolean" },
      },
      required: [
        "observedGravity",
        "suppliedDatumOffset",
        "suppliedScale",
        "subtractOffset",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correction: { type: "number" },
        corrected: { type: "number" },
      },
      required: ["correction", "corrected"],
    },
    ports: {
      inputs: [
        {
          id: "observedGravity",
          label: "Observed Gravity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedDatumOffset",
          label: "Supplied Datum Offset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedScale",
          label: "Supplied Scale",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "subtractOffset",
          label: "Subtract Offset",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "correction",
          label: "Correction",
          valueType: { type: "number" },
        },
        { id: "corrected", label: "Corrected", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = gravityDatumOffsetContributionTool.execute;
export default gravityDatumOffsetContributionTool;
