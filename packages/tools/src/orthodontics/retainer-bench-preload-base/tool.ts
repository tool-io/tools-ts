import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalLoad: number;
  readonly preload: number;
  readonly useNet: boolean;
  readonly displacement: number;
};
export type Output = {
  readonly reportedLoad: number;
  readonly stiffness: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalLoad: { type: "number" },
    preload: { type: "number" },
    useNet: { type: "boolean" },
    displacement: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["totalLoad", "preload", "useNet", "displacement"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedLoad: { type: "number" },
    stiffness: { type: "number" },
  },
  required: ["reportedLoad", "stiffness"],
} as const;
/** Compute a supplied bench load/displacement quotient under an explicit preload basis; no therapeutic force recommendation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalLoad, preload, useNet, displacement } = request;
  const compute = (): Output => {
    H.positive(displacement);
    return {
      reportedLoad: totalLoad - (useNet ? preload : 0),
      stiffness: (totalLoad - (useNet ? preload : 0)) / displacement,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalLoad: 10, preload: 2, useNet: true, displacement: 4 },
  output: { reportedLoad: 8, stiffness: 2 },
} satisfies ToolExample<Input, Output>;
export const retainerBenchPreloadBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "orthodontics/retainer-bench-preload-base",
    title: "Retainer Bench Preload Base Tool",
    description:
      "Compute a supplied bench load/displacement quotient under an explicit preload basis; no therapeutic force recommendation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalLoad: { type: "number" },
        preload: { type: "number" },
        useNet: { type: "boolean" },
        displacement: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["totalLoad", "preload", "useNet", "displacement"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reportedLoad: { type: "number" },
        stiffness: { type: "number" },
      },
      required: ["reportedLoad", "stiffness"],
    },
    ports: {
      inputs: [
        {
          id: "totalLoad",
          label: "Total Load",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "preload",
          label: "Preload",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "useNet",
          label: "Use Net",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "displacement",
          label: "Displacement",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "reportedLoad",
          label: "Reported Load",
          valueType: { type: "number" },
        },
        { id: "stiffness", label: "Stiffness", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = retainerBenchPreloadBaseTool.execute;
export default retainerBenchPreloadBaseTool;
