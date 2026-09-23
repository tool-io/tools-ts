import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly age: number;
  readonly binLower: number;
  readonly binUpper: number;
  readonly includeLower: boolean;
  readonly includeUpper: boolean;
};
export type Output = {
  readonly lowerGap: number;
  readonly upperGap: number;
  readonly inBin: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    age: { type: "number" },
    binLower: { type: "number" },
    binUpper: { type: "number" },
    includeLower: { type: "boolean" },
    includeUpper: { type: "boolean" },
  },
  required: ["age", "binLower", "binUpper", "includeLower", "includeUpper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerGap: { type: "number" },
    upperGap: { type: "number" },
    inBin: { type: "boolean" },
  },
  required: ["lowerGap", "upperGap", "inBin"],
} as const;
/** Calculate cohort age boundary gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { age, binLower, binUpper, includeLower, includeUpper } = request;
  const compute = (): Output => {
    H.domain(binUpper >= binLower);
    return {
      lowerGap: age - binLower,
      upperGap: binUpper - age,
      inBin:
        (includeLower ? age >= binLower : age > binLower) &&
        (includeUpper ? age <= binUpper : age < binUpper),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    age: 5,
    binLower: 0,
    binUpper: 5,
    includeLower: true,
    includeUpper: false,
  },
  output: { lowerGap: 5, upperGap: 0, inBin: false },
} satisfies ToolExample<Input, Output>;
export const cohortAgeBoundaryGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "business-analytics/cohort-age-boundary-gap",
    title: "Cohort Age Boundary Gap Tool",
    description:
      "Calculate cohort age boundary gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        age: { type: "number" },
        binLower: { type: "number" },
        binUpper: { type: "number" },
        includeLower: { type: "boolean" },
        includeUpper: { type: "boolean" },
      },
      required: ["age", "binLower", "binUpper", "includeLower", "includeUpper"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerGap: { type: "number" },
        upperGap: { type: "number" },
        inBin: { type: "boolean" },
      },
      required: ["lowerGap", "upperGap", "inBin"],
    },
    ports: {
      inputs: [
        {
          id: "age",
          label: "Age",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "binLower",
          label: "Bin Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "binUpper",
          label: "Bin Upper",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeLower",
          label: "Include Lower",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "includeUpper",
          label: "Include Upper",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "lowerGap", label: "Lower Gap", valueType: { type: "number" } },
        { id: "upperGap", label: "Upper Gap", valueType: { type: "number" } },
        { id: "inBin", label: "In Bin", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = cohortAgeBoundaryGapTool.execute;
export default cohortAgeBoundaryGapTool;
