import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly actualLeadTimes: readonly number[];
  readonly plannedLeadTimes: readonly number[];
};
export type Output = {
  readonly signedBias: number;
  readonly totalError: number;
  readonly observations: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actualLeadTimes: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    plannedLeadTimes: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["actualLeadTimes", "plannedLeadTimes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedBias: { type: "number" },
    totalError: { type: "number" },
    observations: { type: "integer" },
  },
  required: ["signedBias", "totalError", "observations"],
} as const;
/** Calculate lead time bias component from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { actualLeadTimes, plannedLeadTimes } = request;
  const compute = (): Output => {
    H.sameLength(actualLeadTimes, plannedLeadTimes);
    H.domain(
      actualLeadTimes.length > 0 &&
        actualLeadTimes.every((x) => x >= 0) &&
        plannedLeadTimes.every((x) => x >= 0),
    );
    return {
      signedBias:
        actualLeadTimes.reduce((a, b, i) => a + b - plannedLeadTimes[i], 0) /
        actualLeadTimes.length,
      totalError: actualLeadTimes.reduce(
        (a, b, i) => a + b - plannedLeadTimes[i],
        0,
      ),
      observations: actualLeadTimes.length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { actualLeadTimes: [10, 14, 12], plannedLeadTimes: [8, 12, 13] },
  output: { signedBias: 1, totalError: 3, observations: 3 },
} satisfies ToolExample<Input, Output>;
export const leadTimeBiasComponentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "supply-chain/lead-time-bias-component",
    title: "Lead Time Bias Component Tool",
    description:
      "Calculate lead time bias component from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        actualLeadTimes: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        plannedLeadTimes: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["actualLeadTimes", "plannedLeadTimes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedBias: { type: "number" },
        totalError: { type: "number" },
        observations: { type: "integer" },
      },
      required: ["signedBias", "totalError", "observations"],
    },
    ports: {
      inputs: [
        {
          id: "actualLeadTimes",
          label: "Actual Lead Times",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "plannedLeadTimes",
          label: "Planned Lead Times",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "signedBias",
          label: "Signed Bias",
          valueType: { type: "number" },
        },
        {
          id: "totalError",
          label: "Total Error",
          valueType: { type: "number" },
        },
        {
          id: "observations",
          label: "Observations",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = leadTimeBiasComponentTool.execute;
export default leadTimeBiasComponentTool;
