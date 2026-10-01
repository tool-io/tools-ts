import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baselineDimension: number;
  readonly followupDimension: number;
  readonly suppliedScale: number;
};
export type Output = {
  readonly absoluteChange: number;
  readonly relativeChange: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baselineDimension: { type: "number", minimum: 0 },
    followupDimension: { type: "number", minimum: 0 },
    suppliedScale: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["baselineDimension", "followupDimension", "suppliedScale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    absoluteChange: { type: "number" },
    relativeChange: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["absoluteChange", "relativeChange", "defined"],
} as const;
/** Compare supplied research dimensions without clinical response criteria or diagnosis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baselineDimension, followupDimension, suppliedScale } = request;
  const compute = (): Output => {
    H.domain(baselineDimension >= 0 && followupDimension >= 0);
    H.positive(suppliedScale);
    return {
      absoluteChange: (followupDimension - baselineDimension) * suppliedScale,
      relativeChange:
        baselineDimension !== 0
          ? (followupDimension - baselineDimension) / baselineDimension
          : 0,
      defined: baselineDimension !== 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { baselineDimension: 10, followupDimension: 12, suppliedScale: 1 },
  output: { absoluteChange: 2, relativeChange: 0.2, defined: true },
} satisfies ToolExample<Input, Output>;
export const researchLesionDimensionChangeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "oncology/research-lesion-dimension-change",
    title: "Research Lesion Dimension Change Tool",
    description:
      "Compare supplied research dimensions without clinical response criteria or diagnosis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baselineDimension: { type: "number", minimum: 0 },
        followupDimension: { type: "number", minimum: 0 },
        suppliedScale: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["baselineDimension", "followupDimension", "suppliedScale"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        absoluteChange: { type: "number" },
        relativeChange: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["absoluteChange", "relativeChange", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "baselineDimension",
          label: "Baseline Dimension",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "followupDimension",
          label: "Followup Dimension",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedScale",
          label: "Supplied Scale",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "absoluteChange",
          label: "Absolute Change",
          valueType: { type: "number" },
        },
        {
          id: "relativeChange",
          label: "Relative Change",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = researchLesionDimensionChangeTool.execute;
export default researchLesionDimensionChangeTool;
