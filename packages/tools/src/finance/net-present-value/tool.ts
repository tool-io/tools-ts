import { resourceLimitIssue } from "../../core/limits.js";
import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type NetPresentValueInput = {
  /** Cash flows in order; the initial outlay is typically negative. */
  readonly cashFlows: readonly number[];
  readonly discountRatePercent: number;
};

export type NetPresentValueOutput = {
  readonly netPresentValue: number;
};

const round2 = (value: number): number => Math.round(value * 100) / 100;

export const netPresentValueInputSchema = {
  additionalProperties: false,
  properties: {
    cashFlows: {
      description:
        "Cash flows at the end of each period, starting with period zero.",
      items: { type: "number" },
      maxItems: 1000,
      minItems: 1,
      type: "array",
    },
    discountRatePercent: {
      description: "Periodic discount rate in percent.",
      exclusiveMinimum: -100,
      type: "number",
    },
  },
  required: ["cashFlows", "discountRatePercent"],
  type: "object",
} as const;

export const netPresentValueOutputSchema = {
  additionalProperties: false,
  properties: {
    netPresentValue: {
      description: "Sum of discounted cash flows, rounded to two decimals.",
      type: "number",
    },
  },
  required: ["netPresentValue"],
  type: "object",
} as const;

export const netPresentValueExample = {
  input: {
    cashFlows: [-1000, 300, 400, 500],
    discountRatePercent: 10,
  },
  output: { netPresentValue: -21.04 },
} satisfies ToolExample<NetPresentValueInput, NetPresentValueOutput>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const isNetPresentValueOutput = (
  value: unknown,
): value is NetPresentValueOutput =>
  isRecord(value) &&
  typeof value.netPresentValue === "number" &&
  Number.isFinite(value.netPresentValue);

export const calculateNetPresentValue = (
  input: unknown,
): ToolResult<NetPresentValueOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const issues: ToolIssue[] = [];
  for (const field of Object.keys(input))
    if (field !== "cashFlows" && field !== "discountRatePercent")
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });

  const rawFlows = input.cashFlows;
  let flows: readonly number[] = [];
  if (rawFlows === undefined)
    return invalidInput([
      ...issues,
      {
        code: "cash_flows_required",
        field: "cashFlows",
        message: "cashFlows is required.",
      },
    ]);
  if (!Array.isArray(rawFlows))
    return invalidInput([
      ...issues,
      {
        code: "cash_flows_invalid",
        field: "cashFlows",
        message: "cashFlows must be an array of numbers.",
      },
    ]);
  const limitIssue = resourceLimitIssue(
    "generatedValues",
    rawFlows.length,
    "cashFlows",
  );
  if (limitIssue) return invalidInput([...issues, limitIssue]);
  if (rawFlows.length < 1)
    return invalidInput([
      ...issues,
      {
        code: "cash_flows_empty",
        field: "cashFlows",
        message: "cashFlows must contain at least one entry.",
      },
    ]);
  rawFlows.forEach((entry, index) => {
    if (
      typeof entry !== "number" ||
      !Number.isFinite(entry)
    )
      issues.push({
        code: "cash_flow_invalid",
        field: `cashFlows.${index}`,
        message: `cashFlows.${index} must be a finite number.`,
      });
  });
  flows = rawFlows as readonly number[];

  const rate = input.discountRatePercent as number | undefined;
  if (rate === undefined)
    return invalidInput([
      ...issues,
      {
        code: "discount_rate_required",
        field: "discountRatePercent",
        message: "discountRatePercent is required.",
      },
    ]);
  if (
    typeof rate !== "number" ||
    !Number.isFinite(rate) ||
    rate <= -100
  )
    return invalidInput([
      ...issues,
      {
        code: "discount_rate_invalid",
        field: "discountRatePercent",
        message: "discountRatePercent must be greater than -100.",
      },
    ]);
  if (issues.length > 0) return invalidInput(issues);

  const periodicRate = rate / 100;
  let present = 0;
  for (let index = 0; index < flows.length; index += 1)
    present += (flows[index] as number) / Math.pow(1 + periodicRate, index);
  return toolSuccess({ netPresentValue: round2(present) });
};

export const netPresentValueTool = defineTool<
  NetPresentValueInput,
  NetPresentValueOutput
>({
  contractVersion: 1,
  description:
    "Discount a series of cash flows to period zero and sum them into a net present value.",
  discovery: {
    aliases: ["dcf", "npv-calculator"],
    keywords: ["cash flow", "discounting", "finance", "investment"],
  },
  execute: calculateNetPresentValue,
  execution: { kind: "pure" },
  id: "finance/net-present-value",
  inputSchema: netPresentValueInputSchema,
  outputSchema: netPresentValueOutputSchema,
  ports: {
    inputs: [
      {
        description: "Cash flows per period, starting at period zero.",
        id: "cashFlows",
        label: "Cash flows",
        required: true,
        valueType: {
          format: "currency-amount",
          items: { format: "currency-amount", type: "number" },
          type: "list",
        },
      },
      {
        description: "Periodic discount rate in percent.",
        id: "discountRatePercent",
        label: "Discount rate",
        required: true,
        valueType: { format: "ratio-percent", type: "number", unit: "%" },
      },
    ],
    outputs: [
      {
        description: "Sum of discounted cash flows.",
        id: "netPresentValue",
        label: "Net present value",
        valueType: { format: "currency-amount", type: "number" },
      },
    ],
  },
  title: "Net Present Value",
});

export const runNetPresentValue = netPresentValueTool.execute;
export default netPresentValueTool;
