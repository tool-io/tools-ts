import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly taskMinutes: readonly number[];
  readonly sharedMinutes: number;
  readonly operators: number;
};
export type Output = {
  readonly netLaborMinutes: number;
  readonly perOperator: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    taskMinutes: { type: "array", maxItems: 256, items: { type: "number" } },
    sharedMinutes: { type: "number", minimum: 0 },
    operators: { type: "integer", minimum: 1 },
  },
  required: ["taskMinutes", "sharedMinutes", "operators"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netLaborMinutes: { type: "number" },
    perOperator: { type: "number" },
  },
  required: ["netLaborMinutes", "perOperator"],
} as const;
/** Calculate line balance shared operator credit from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { taskMinutes, sharedMinutes, operators } = request;
  const compute = (): Output => {
    H.integer(operators, 1);
    H.domain(
      taskMinutes.every((x) => x >= 0) &&
        sharedMinutes >= 0 &&
        sharedMinutes <= taskMinutes.reduce((a, b) => a + b, 0),
    );
    return {
      netLaborMinutes: taskMinutes.reduce((a, b) => a + b, 0) - sharedMinutes,
      perOperator:
        (taskMinutes.reduce((a, b) => a + b, 0) - sharedMinutes) / operators,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { taskMinutes: [10, 20, 15], sharedMinutes: 5, operators: 2 },
  output: { netLaborMinutes: 40, perOperator: 20 },
} satisfies ToolExample<Input, Output>;
export const lineBalanceSharedOperatorCreditTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-engineering/line-balance-shared-operator-credit",
    title: "Line Balance Shared Operator Credit Tool",
    description:
      "Calculate line balance shared operator credit from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        taskMinutes: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        sharedMinutes: { type: "number", minimum: 0 },
        operators: { type: "integer", minimum: 1 },
      },
      required: ["taskMinutes", "sharedMinutes", "operators"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netLaborMinutes: { type: "number" },
        perOperator: { type: "number" },
      },
      required: ["netLaborMinutes", "perOperator"],
    },
    ports: {
      inputs: [
        {
          id: "taskMinutes",
          label: "Task Minutes",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "sharedMinutes",
          label: "Shared Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "operators",
          label: "Operators",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "netLaborMinutes",
          label: "Net Labor Minutes",
          valueType: { type: "number" },
        },
        {
          id: "perOperator",
          label: "Per Operator",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = lineBalanceSharedOperatorCreditTool.execute;
export default lineBalanceSharedOperatorCreditTool;
