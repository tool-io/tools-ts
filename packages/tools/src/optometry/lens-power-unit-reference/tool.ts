import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reportedPower: number;
  readonly suppliedDioptersPerUnit: number;
  readonly referenceDiopters: number;
};
export type Output = {
  readonly convertedDiopters: number;
  readonly gapDiopters: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedPower: { type: "number" },
    suppliedDioptersPerUnit: { type: "number", exclusiveMinimum: 0 },
    referenceDiopters: { type: "number" },
  },
  required: ["reportedPower", "suppliedDioptersPerUnit", "referenceDiopters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    convertedDiopters: { type: "number" },
    gapDiopters: { type: "number" },
  },
  required: ["convertedDiopters", "gapDiopters"],
} as const;
/** Compare supplied signed optical-power units to an explicit reference without a prescription or lens recommendation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reportedPower, suppliedDioptersPerUnit, referenceDiopters } = request;
  const compute = (): Output => {
    H.positive(suppliedDioptersPerUnit);
    return {
      convertedDiopters: reportedPower * suppliedDioptersPerUnit,
      gapDiopters: reportedPower * suppliedDioptersPerUnit - referenceDiopters,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    reportedPower: -2,
    suppliedDioptersPerUnit: 1,
    referenceDiopters: -1.5,
  },
  output: { convertedDiopters: -2, gapDiopters: -0.5 },
} satisfies ToolExample<Input, Output>;
export const lensPowerUnitReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "optometry/lens-power-unit-reference",
    title: "Lens Power Unit Reference Tool",
    description:
      "Compare supplied signed optical-power units to an explicit reference without a prescription or lens recommendation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reportedPower: { type: "number" },
        suppliedDioptersPerUnit: { type: "number", exclusiveMinimum: 0 },
        referenceDiopters: { type: "number" },
      },
      required: [
        "reportedPower",
        "suppliedDioptersPerUnit",
        "referenceDiopters",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        convertedDiopters: { type: "number" },
        gapDiopters: { type: "number" },
      },
      required: ["convertedDiopters", "gapDiopters"],
    },
    ports: {
      inputs: [
        {
          id: "reportedPower",
          label: "Reported Power",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedDioptersPerUnit",
          label: "Supplied Diopters Per Unit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceDiopters",
          label: "Reference Diopters",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "convertedDiopters",
          label: "Converted Diopters",
          valueType: { type: "number" },
        },
        {
          id: "gapDiopters",
          label: "Gap Diopters",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = lensPowerUnitReferenceTool.execute;
export default lensPowerUnitReferenceTool;
