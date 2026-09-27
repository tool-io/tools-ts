import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tipYear: number;
  readonly rootYear: number;
  readonly rootDistance: number;
  readonly clockRate: number;
};
export type Output = {
  readonly elapsedYears: number;
  readonly expectedDistance: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tipYear: { type: "number" },
    rootYear: { type: "number" },
    rootDistance: { type: "number", minimum: 0 },
    clockRate: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["tipYear", "rootYear", "rootDistance", "clockRate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsedYears: { type: "number" },
    expectedDistance: { type: "number" },
    residual: { type: "number" },
  },
  required: ["elapsedYears", "expectedDistance", "residual"],
} as const;
/** Calculate phylogenetic tip date root distance gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tipYear, rootYear, rootDistance, clockRate } = request;
  const compute = (): Output => {
    H.domain(tipYear >= rootYear && rootDistance >= 0);
    H.positive(clockRate);
    return {
      elapsedYears: tipYear - rootYear,
      expectedDistance: (tipYear - rootYear) * clockRate,
      residual: rootDistance - (tipYear - rootYear) * clockRate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    tipYear: 2020,
    rootYear: 2000,
    rootDistance: 0.025,
    clockRate: 0.001,
  },
  output: {
    elapsedYears: 20,
    expectedDistance: 0.02,
    residual: 0.005000000000000001,
  },
} satisfies ToolExample<Input, Output>;
export const phylogeneticTipDateRootDistanceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "evolutionary-biology/phylogenetic-tip-date-root-distance-gap",
    title: "Phylogenetic Tip Date Root Distance Gap Tool",
    description:
      "Calculate phylogenetic tip date root distance gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tipYear: { type: "number" },
        rootYear: { type: "number" },
        rootDistance: { type: "number", minimum: 0 },
        clockRate: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["tipYear", "rootYear", "rootDistance", "clockRate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsedYears: { type: "number" },
        expectedDistance: { type: "number" },
        residual: { type: "number" },
      },
      required: ["elapsedYears", "expectedDistance", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "tipYear",
          label: "Tip Year",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rootYear",
          label: "Root Year",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rootDistance",
          label: "Root Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "clockRate",
          label: "Clock Rate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "elapsedYears",
          label: "Elapsed Years",
          valueType: { type: "number" },
        },
        {
          id: "expectedDistance",
          label: "Expected Distance",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = phylogeneticTipDateRootDistanceGapTool.execute;
export default phylogeneticTipDateRootDistanceGapTool;
