import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly depositPerTool: number;
  readonly tools: number;
  readonly households: number;
  readonly splitByHousehold: boolean;
};
export type Output = {
  readonly totalDeposit: number;
  readonly chargePerUnit: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    depositPerTool: { type: "number", minimum: 0 },
    tools: { type: "integer", minimum: 1 },
    households: { type: "integer", minimum: 1 },
    splitByHousehold: { type: "boolean" },
  },
  required: ["depositPerTool", "tools", "households", "splitByHousehold"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalDeposit: { type: "number" },
    chargePerUnit: { type: "number" },
  },
  required: ["totalDeposit", "chargePerUnit"],
} as const;
/** Calculate shared tool deposit base flag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { depositPerTool, tools, households, splitByHousehold } = request;
  const compute = (): Output => {
    H.domain(depositPerTool >= 0);
    H.integer(tools, 1);
    H.integer(households, 1);
    return {
      totalDeposit: depositPerTool * tools,
      chargePerUnit:
        (depositPerTool * tools) / (splitByHousehold ? households : tools),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    depositPerTool: 20,
    tools: 3,
    households: 6,
    splitByHousehold: true,
  },
  output: { totalDeposit: 60, chargePerUnit: 10 },
} satisfies ToolExample<Input, Output>;
export const sharedToolDepositBaseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "community-development/shared-tool-deposit-base-flag",
    title: "Shared Tool Deposit Base Flag Tool",
    description:
      "Calculate shared tool deposit base flag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        depositPerTool: { type: "number", minimum: 0 },
        tools: { type: "integer", minimum: 1 },
        households: { type: "integer", minimum: 1 },
        splitByHousehold: { type: "boolean" },
      },
      required: ["depositPerTool", "tools", "households", "splitByHousehold"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalDeposit: { type: "number" },
        chargePerUnit: { type: "number" },
      },
      required: ["totalDeposit", "chargePerUnit"],
    },
    ports: {
      inputs: [
        {
          id: "depositPerTool",
          label: "Deposit Per Tool",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tools",
          label: "Tools",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "households",
          label: "Households",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "splitByHousehold",
          label: "Split By Household",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "totalDeposit",
          label: "Total Deposit",
          valueType: { type: "number" },
        },
        {
          id: "chargePerUnit",
          label: "Charge Per Unit",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sharedToolDepositBaseFlagTool.execute;
export default sharedToolDepositBaseFlagTool;
