import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wip: number;
  readonly throughputPerHour: number;
  readonly observedFlowHours: number;
};
export type Output = {
  readonly impliedFlowHours: number;
  readonly identityResidual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wip: { type: "number", minimum: 0 },
    throughputPerHour: { type: "number", exclusiveMinimum: 0 },
    observedFlowHours: { type: "number", minimum: 0 },
  },
  required: ["wip", "throughputPerHour", "observedFlowHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    impliedFlowHours: { type: "number" },
    identityResidual: { type: "number" },
  },
  required: ["impliedFlowHours", "identityResidual"],
} as const;
/** Little-law mean inventory identity for a consistently bounded stable flow system; supplied observations must use matched periods. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wip, throughputPerHour, observedFlowHours } = request;
  const compute = (): Output => {
    H.domain(wip >= 0 && observedFlowHours >= 0);
    H.positive(throughputPerHour);
    return {
      impliedFlowHours: wip / throughputPerHour,
      identityResidual: wip - throughputPerHour * observedFlowHours,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wip: 100, throughputPerHour: 20, observedFlowHours: 4 },
  output: { impliedFlowHours: 5, identityResidual: 20 },
} satisfies ToolExample<Input, Output>;
export const littlelawWipThroughputTimeIdentityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-engineering/littlelaw-wip-throughput-time-identity",
    title: "Littlelaw Wip Throughput Time Identity Tool",
    description:
      "Little-law mean inventory identity for a consistently bounded stable flow system; supplied observations must use matched periods.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wip: { type: "number", minimum: 0 },
        throughputPerHour: { type: "number", exclusiveMinimum: 0 },
        observedFlowHours: { type: "number", minimum: 0 },
      },
      required: ["wip", "throughputPerHour", "observedFlowHours"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        impliedFlowHours: { type: "number" },
        identityResidual: { type: "number" },
      },
      required: ["impliedFlowHours", "identityResidual"],
    },
    ports: {
      inputs: [
        {
          id: "wip",
          label: "Wip",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "throughputPerHour",
          label: "Throughput Per Hour",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observedFlowHours",
          label: "Observed Flow Hours",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "impliedFlowHours",
          label: "Implied Flow Hours",
          valueType: { type: "number" },
        },
        {
          id: "identityResidual",
          label: "Identity Residual",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = littlelawWipThroughputTimeIdentityTool.execute;
export default littlelawWipThroughputTimeIdentityTool;
