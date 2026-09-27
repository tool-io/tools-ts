import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly width: number;
  readonly sourceLengthInBaseUnits: number;
  readonly unit: string;
  readonly referenceUnit: string;
};
export type Output = {
  readonly baseWidth: number;
  readonly unitMatches: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    width: { type: "number", minimum: 0 },
    sourceLengthInBaseUnits: { type: "number", exclusiveMinimum: 0 },
    unit: { type: "string", maxLength: 8192 },
    referenceUnit: { type: "string", maxLength: 8192 },
  },
  required: ["width", "sourceLengthInBaseUnits", "unit", "referenceUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseWidth: { type: "number" },
    unitMatches: { type: "boolean" },
  },
  required: ["baseWidth", "unitMatches"],
} as const;
/** Convert a supplied line-width measurement using source-unit size in base units; no handwriting/source identification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { width, sourceLengthInBaseUnits, unit, referenceUnit } = request;
  const compute = (): Output => {
    H.positive(sourceLengthInBaseUnits);
    H.domain(width >= 0);
    return {
      baseWidth: width * sourceLengthInBaseUnits,
      unitMatches: unit === referenceUnit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    width: 2,
    sourceLengthInBaseUnits: 0.1,
    unit: "mm",
    referenceUnit: "mm",
  },
  output: { baseWidth: 0.2, unitMatches: true },
} satisfies ToolExample<Input, Output>;
export const questionedLineWidthUnitBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "forensic-science/questioned-line-width-unit-base",
    title: "Questioned Line Width Unit Base Tool",
    description:
      "Convert a supplied line-width measurement using source-unit size in base units; no handwriting/source identification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        width: { type: "number", minimum: 0 },
        sourceLengthInBaseUnits: { type: "number", exclusiveMinimum: 0 },
        unit: { type: "string", maxLength: 8192 },
        referenceUnit: { type: "string", maxLength: 8192 },
      },
      required: ["width", "sourceLengthInBaseUnits", "unit", "referenceUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseWidth: { type: "number" },
        unitMatches: { type: "boolean" },
      },
      required: ["baseWidth", "unitMatches"],
    },
    ports: {
      inputs: [
        {
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceLengthInBaseUnits",
          label: "Source Length In Base Units",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unit",
          label: "Unit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "referenceUnit",
          label: "Reference Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "baseWidth", label: "Base Width", valueType: { type: "number" } },
        {
          id: "unitMatches",
          label: "Unit Matches",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = questionedLineWidthUnitBaseTool.execute;
export default questionedLineWidthUnitBaseTool;
