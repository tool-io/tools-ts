import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reportedCount: number;
  readonly suppliedVolumeUnitFactor: number;
  readonly backgroundCount: number;
  readonly subtractBackground: boolean;
};
export type Output = { readonly converted: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedCount: { type: "number" },
    suppliedVolumeUnitFactor: { type: "number", exclusiveMinimum: 0 },
    backgroundCount: { type: "number" },
    subtractBackground: { type: "boolean" },
  },
  required: [
    "reportedCount",
    "suppliedVolumeUnitFactor",
    "backgroundCount",
    "subtractBackground",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { converted: { type: "number" } },
  required: ["converted"],
} as const;
/** Convert a supplied research count concentration with an explicit volume-basis factor, retaining signed blank correction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    reportedCount,
    suppliedVolumeUnitFactor,
    backgroundCount,
    subtractBackground,
  } = request;
  const compute = (): Output => {
    H.positive(suppliedVolumeUnitFactor);
    return {
      converted:
        (reportedCount - (subtractBackground ? backgroundCount : 0)) *
        suppliedVolumeUnitFactor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    reportedCount: 10,
    suppliedVolumeUnitFactor: 1000,
    backgroundCount: 2,
    subtractBackground: true,
  },
  output: { converted: 8000 },
} satisfies ToolExample<Input, Output>;
export const bloodCellCountUnitFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hematology/blood-cell-count-unit-factor",
    title: "Blood Cell Count Unit Factor Tool",
    description:
      "Convert a supplied research count concentration with an explicit volume-basis factor, retaining signed blank correction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reportedCount: { type: "number" },
        suppliedVolumeUnitFactor: { type: "number", exclusiveMinimum: 0 },
        backgroundCount: { type: "number" },
        subtractBackground: { type: "boolean" },
      },
      required: [
        "reportedCount",
        "suppliedVolumeUnitFactor",
        "backgroundCount",
        "subtractBackground",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { converted: { type: "number" } },
      required: ["converted"],
    },
    ports: {
      inputs: [
        {
          id: "reportedCount",
          label: "Reported Count",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedVolumeUnitFactor",
          label: "Supplied Volume Unit Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "backgroundCount",
          label: "Background Count",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "subtractBackground",
          label: "Subtract Background",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "converted", label: "Converted", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = bloodCellCountUnitFactorTool.execute;
export default bloodCellCountUnitFactorTool;
