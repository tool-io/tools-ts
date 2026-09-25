import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ages: readonly number[];
  readonly lowerWorkingAge: number;
  readonly upperWorkingAge: number;
};
export type Output = {
  readonly young: number;
  readonly working: number;
  readonly older: number;
  readonly ratio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ages: { type: "array", maxItems: 256, items: { type: "integer" } },
    lowerWorkingAge: { type: "integer", minimum: 0 },
    upperWorkingAge: { type: "integer" },
  },
  required: ["ages", "lowerWorkingAge", "upperWorkingAge"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    young: { type: "integer" },
    working: { type: "integer" },
    older: { type: "integer" },
    ratio: { type: "number" },
  },
  required: ["young", "working", "older", "ratio"],
} as const;
/** Caller-defined lower-inclusive, upper-exclusive working-age band, without a jurisdictional age definition. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ages, lowerWorkingAge, upperWorkingAge } = request;
  const compute = (): Output => {
    H.integer(lowerWorkingAge, 0);
    H.integer(upperWorkingAge, lowerWorkingAge + 1);
    H.domain(ages.every((a) => a >= 0));
    const young = ages.filter((a) => a < lowerWorkingAge).length,
      older = ages.filter((a) => a >= upperWorkingAge).length,
      working = ages.length - young - older;
    H.positive(working);
    return { young, working, older, ratio: (young + older) / working };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ages: [10, 20, 40, 70], lowerWorkingAge: 18, upperWorkingAge: 65 },
  output: { young: 1, working: 2, older: 1, ratio: 1 },
} satisfies ToolExample<Input, Output>;
export const dependencyAgeCutoffBoundaryPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "demographic-economics/dependency-age-cutoff-boundary-pair",
    title: "Dependency Age Cutoff Boundary Pair Tool",
    description:
      "Caller-defined lower-inclusive, upper-exclusive working-age band, without a jurisdictional age definition.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ages: { type: "array", maxItems: 256, items: { type: "integer" } },
        lowerWorkingAge: { type: "integer", minimum: 0 },
        upperWorkingAge: { type: "integer" },
      },
      required: ["ages", "lowerWorkingAge", "upperWorkingAge"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        young: { type: "integer" },
        working: { type: "integer" },
        older: { type: "integer" },
        ratio: { type: "number" },
      },
      required: ["young", "working", "older", "ratio"],
    },
    ports: {
      inputs: [
        {
          id: "ages",
          label: "Ages",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "lowerWorkingAge",
          label: "Lower Working Age",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "upperWorkingAge",
          label: "Upper Working Age",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "young", label: "Young", valueType: { type: "integer" } },
        { id: "working", label: "Working", valueType: { type: "integer" } },
        { id: "older", label: "Older", valueType: { type: "integer" } },
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = dependencyAgeCutoffBoundaryPairTool.execute;
export default dependencyAgeCutoffBoundaryPairTool;
