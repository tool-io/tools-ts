import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly branchLength: number;
  readonly suppliedTimePerUnit: number;
  readonly referenceTime: number;
};
export type Output = { readonly time: number; readonly referenceGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    branchLength: { type: "number", minimum: 0 },
    suppliedTimePerUnit: { type: "number", exclusiveMinimum: 0 },
    referenceTime: { type: "number" },
  },
  required: ["branchLength", "suppliedTimePerUnit", "referenceTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { time: { type: "number" }, referenceGap: { type: "number" } },
  required: ["time", "referenceGap"],
} as const;
/** Use a caller-established branch/time calibration; no molecular clock is fitted. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { branchLength, suppliedTimePerUnit, referenceTime } = request;
  const compute = (): Output => {
    H.domain(branchLength >= 0);
    H.positive(suppliedTimePerUnit);
    return {
      time: branchLength * suppliedTimePerUnit,
      referenceGap: branchLength * suppliedTimePerUnit - referenceTime,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { branchLength: 0.2, suppliedTimePerUnit: 100, referenceTime: 15 },
  output: { time: 20, referenceGap: 5 },
} satisfies ToolExample<Input, Output>;
export const treeBranchTimeUnitFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "evolutionary-biology/tree-branch-time-unit-factor",
    title: "Tree Branch Time Unit Factor Tool",
    description:
      "Use a caller-established branch/time calibration; no molecular clock is fitted.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        branchLength: { type: "number", minimum: 0 },
        suppliedTimePerUnit: { type: "number", exclusiveMinimum: 0 },
        referenceTime: { type: "number" },
      },
      required: ["branchLength", "suppliedTimePerUnit", "referenceTime"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        time: { type: "number" },
        referenceGap: { type: "number" },
      },
      required: ["time", "referenceGap"],
    },
    ports: {
      inputs: [
        {
          id: "branchLength",
          label: "Branch Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedTimePerUnit",
          label: "Supplied Time Per Unit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceTime",
          label: "Reference Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "time", label: "Time", valueType: { type: "number" } },
        {
          id: "referenceGap",
          label: "Reference Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = treeBranchTimeUnitFactorTool.execute;
export default treeBranchTimeUnitFactorTool;
