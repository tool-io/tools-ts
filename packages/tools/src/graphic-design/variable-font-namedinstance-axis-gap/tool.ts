import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly current: number;
  readonly namedValue: number;
  readonly minimum: number;
  readonly defaultValue: number;
  readonly maximum: number;
};
export type Output = {
  readonly difference: number;
  readonly normalizedCurrent: number;
  readonly normalizedNamed: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    current: { type: "number" },
    namedValue: { type: "number" },
    minimum: { type: "number" },
    defaultValue: { type: "number" },
    maximum: { type: "number" },
  },
  required: ["current", "namedValue", "minimum", "defaultValue", "maximum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    difference: { type: "number" },
    normalizedCurrent: { type: "number" },
    normalizedNamed: { type: "number" },
  },
  required: ["difference", "normalizedCurrent", "normalizedNamed"],
} as const;
/** Default-centered OpenType variation-axis normalization before any avar remapping; named instance values are caller-supplied. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { current, namedValue, minimum, defaultValue, maximum } = request;
  const compute = (): Output => {
    H.domain(
      minimum <= defaultValue &&
        defaultValue <= maximum &&
        maximum > minimum &&
        current >= minimum &&
        current <= maximum &&
        namedValue >= minimum &&
        namedValue <= maximum,
    );
    return {
      difference: current - namedValue,
      normalizedCurrent:
        current === defaultValue
          ? 0
          : current < defaultValue
            ? (current - defaultValue) / (defaultValue - minimum)
            : (current - defaultValue) / (maximum - defaultValue),
      normalizedNamed:
        namedValue === defaultValue
          ? 0
          : namedValue < defaultValue
            ? (namedValue - defaultValue) / (defaultValue - minimum)
            : (namedValue - defaultValue) / (maximum - defaultValue),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    current: 700,
    namedValue: 400,
    minimum: 100,
    defaultValue: 400,
    maximum: 900,
  },
  output: { difference: 300, normalizedCurrent: 0.6, normalizedNamed: 0 },
} satisfies ToolExample<Input, Output>;
export const variableFontNamedinstanceAxisGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graphic-design/variable-font-namedinstance-axis-gap",
    title: "Variable Font Namedinstance Axis Gap Tool",
    description:
      "Default-centered OpenType variation-axis normalization before any avar remapping; named instance values are caller-supplied.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        current: { type: "number" },
        namedValue: { type: "number" },
        minimum: { type: "number" },
        defaultValue: { type: "number" },
        maximum: { type: "number" },
      },
      required: ["current", "namedValue", "minimum", "defaultValue", "maximum"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        difference: { type: "number" },
        normalizedCurrent: { type: "number" },
        normalizedNamed: { type: "number" },
      },
      required: ["difference", "normalizedCurrent", "normalizedNamed"],
    },
    ports: {
      inputs: [
        {
          id: "current",
          label: "Current",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "namedValue",
          label: "Named Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "minimum",
          label: "Minimum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "defaultValue",
          label: "Default Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "maximum",
          label: "Maximum",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "difference",
          label: "Difference",
          valueType: { type: "number" },
        },
        {
          id: "normalizedCurrent",
          label: "Normalized Current",
          valueType: { type: "number" },
        },
        {
          id: "normalizedNamed",
          label: "Normalized Named",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = variableFontNamedinstanceAxisGapTool.execute;
export default variableFontNamedinstanceAxisGapTool;
