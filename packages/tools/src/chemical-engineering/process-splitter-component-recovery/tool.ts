import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly branchComponentFlow: number;
  readonly inletComponentFlow: number;
};
export type Output = {
  readonly componentRecovery: number;
  readonly unrecoveredComponentFlow: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    branchComponentFlow: { type: "number", minimum: 0 },
    inletComponentFlow: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["branchComponentFlow", "inletComponentFlow"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    componentRecovery: { type: "number" },
    unrecoveredComponentFlow: { type: "number" },
  },
  required: ["componentRecovery", "unrecoveredComponentFlow"],
} as const;
/** Calculate a supplied splitter branch component recovery fraction and unassigned inlet-component remainder. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { branchComponentFlow, inletComponentFlow } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(inletComponentFlow) && inletComponentFlow > 0,
      "inletComponentFlow",
    ),
      inletComponentFlow);
    H.domain(
      branchComponentFlow >= 0 && branchComponentFlow <= inletComponentFlow,
      "branchComponentFlow",
    );
    return {
      componentRecovery: branchComponentFlow / inletComponentFlow,
      unrecoveredComponentFlow: inletComponentFlow - branchComponentFlow,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { branchComponentFlow: 15, inletComponentFlow: 60 },
  output: { componentRecovery: 0.25, unrecoveredComponentFlow: 45 },
} satisfies ToolExample<Input, Output>;
export const processSplitterComponentRecoveryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["chemical-engineering", "chemical engineering", "engineering"],
      keywords: ["chemical engineering", "engineering"],
    },
    id: "chemical-engineering/process-splitter-component-recovery",
    title: "Process Splitter Component Recovery",
    description:
      "Calculate a supplied splitter branch component recovery fraction and unassigned inlet-component remainder.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        branchComponentFlow: { type: "number", minimum: 0 },
        inletComponentFlow: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["branchComponentFlow", "inletComponentFlow"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        componentRecovery: { type: "number" },
        unrecoveredComponentFlow: { type: "number" },
      },
      required: ["componentRecovery", "unrecoveredComponentFlow"],
    },
    ports: {
      inputs: [
        {
          id: "branchComponentFlow",
          label: "Branch Component Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inletComponentFlow",
          label: "Inlet Component Flow",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "componentRecovery",
          label: "Component Recovery",
          valueType: { type: "number" },
        },
        {
          id: "unrecoveredComponentFlow",
          label: "Unrecovered Component Flow",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = processSplitterComponentRecoveryTool.execute;
export default processSplitterComponentRecoveryTool;
