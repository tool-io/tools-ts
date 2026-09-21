import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly allocation: number;
  readonly used: number;
  readonly transferredOut: number;
  readonly transferredIn: number;
};
export type Output = {
  readonly available: number;
  readonly unused: number;
  readonly exceeded: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allocation: { type: "number", minimum: 0 },
    used: { type: "number", minimum: 0 },
    transferredOut: { type: "number", minimum: 0 },
    transferredIn: { type: "number", minimum: 0 },
  },
  required: ["allocation", "used", "transferredOut", "transferredIn"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    available: { type: "number" },
    unused: { type: "number" },
    exceeded: { type: "boolean" },
  },
  required: ["available", "unused", "exceeded"],
} as const;
/** Calculate agricultural quota unused allocation term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { allocation, used, transferredOut, transferredIn } = request;
  const compute = (): Output => {
    H.domain(
      allocation >= 0 &&
        used >= 0 &&
        transferredOut >= 0 &&
        transferredIn >= 0 &&
        transferredOut <= allocation + transferredIn,
    );
    return {
      available: allocation + transferredIn - transferredOut,
      unused: Math.max(0, allocation + transferredIn - transferredOut - used),
      exceeded: used > allocation + transferredIn - transferredOut,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { allocation: 100, used: 60, transferredOut: 10, transferredIn: 20 },
  output: { available: 110, unused: 50, exceeded: false },
} satisfies ToolExample<Input, Output>;
export const agriculturalQuotaUnusedAllocationTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agricultural-policy/agricultural-quota-unused-allocation-term",
      title: "Agricultural Quota Unused Allocation Term Tool",
      description:
        "Calculate agricultural quota unused allocation term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          allocation: { type: "number", minimum: 0 },
          used: { type: "number", minimum: 0 },
          transferredOut: { type: "number", minimum: 0 },
          transferredIn: { type: "number", minimum: 0 },
        },
        required: ["allocation", "used", "transferredOut", "transferredIn"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          available: { type: "number" },
          unused: { type: "number" },
          exceeded: { type: "boolean" },
        },
        required: ["available", "unused", "exceeded"],
      },
      ports: {
        inputs: [
          {
            id: "allocation",
            label: "Allocation",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "used",
            label: "Used",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "transferredOut",
            label: "Transferred Out",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "transferredIn",
            label: "Transferred In",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "available",
            label: "Available",
            valueType: { type: "number" },
          },
          { id: "unused", label: "Unused", valueType: { type: "number" } },
          { id: "exceeded", label: "Exceeded", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = agriculturalQuotaUnusedAllocationTermTool.execute;
export default agriculturalQuotaUnusedAllocationTermTool;
