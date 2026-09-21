import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly distance: number;
  readonly suppliedRate: number;
  readonly actualCost: number;
  readonly remainingCap: number;
};
export type Output = {
  readonly rateAmount: number;
  readonly payable: number;
  readonly unreimbursed: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distance: { type: "number", minimum: 0 },
    suppliedRate: { type: "number", minimum: 0 },
    actualCost: { type: "number", minimum: 0 },
    remainingCap: { type: "number", minimum: 0 },
  },
  required: ["distance", "suppliedRate", "actualCost", "remainingCap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rateAmount: { type: "number" },
    payable: { type: "number" },
    unreimbursed: { type: "number" },
  },
  required: ["rateAmount", "payable", "unreimbursed"],
} as const;
/** Calculate extension grant travel reimbursement cap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { distance, suppliedRate, actualCost, remainingCap } = request;
  const compute = (): Output => {
    H.domain(
      distance >= 0 &&
        suppliedRate >= 0 &&
        actualCost >= 0 &&
        remainingCap >= 0,
    );
    return {
      rateAmount: distance * suppliedRate,
      payable: Math.min(distance * suppliedRate, actualCost, remainingCap),
      unreimbursed:
        actualCost -
        Math.min(distance * suppliedRate, actualCost, remainingCap),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { distance: 100, suppliedRate: 0.5, actualCost: 80, remainingCap: 60 },
  output: { rateAmount: 50, payable: 50, unreimbursed: 30 },
} satisfies ToolExample<Input, Output>;
export const extensionGrantTravelReimbursementCapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agricultural-extension/extension-grant-travel-reimbursement-cap",
      title: "Extension Grant Travel Reimbursement Cap Tool",
      description:
        "Calculate extension grant travel reimbursement cap from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          distance: { type: "number", minimum: 0 },
          suppliedRate: { type: "number", minimum: 0 },
          actualCost: { type: "number", minimum: 0 },
          remainingCap: { type: "number", minimum: 0 },
        },
        required: ["distance", "suppliedRate", "actualCost", "remainingCap"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          rateAmount: { type: "number" },
          payable: { type: "number" },
          unreimbursed: { type: "number" },
        },
        required: ["rateAmount", "payable", "unreimbursed"],
      },
      ports: {
        inputs: [
          {
            id: "distance",
            label: "Distance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedRate",
            label: "Supplied Rate",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "actualCost",
            label: "Actual Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "remainingCap",
            label: "Remaining Cap",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "rateAmount",
            label: "Rate Amount",
            valueType: { type: "number" },
          },
          { id: "payable", label: "Payable", valueType: { type: "number" } },
          {
            id: "unreimbursed",
            label: "Unreimbursed",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = extensionGrantTravelReimbursementCapTool.execute;
export default extensionGrantTravelReimbursementCapTool;
