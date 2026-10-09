import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalUnits: number;
  readonly vestingMonths: number;
  readonly completedMonths: number;
  readonly cliffMonths: number;
};
export type Output = {
  readonly vestedUnits: number;
  readonly unvestedUnits: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalUnits: { type: "integer", minimum: 0 },
    vestingMonths: { type: "integer", minimum: 1 },
    completedMonths: { type: "integer", minimum: 0 },
    cliffMonths: { type: "integer", minimum: 0 },
  },
  required: ["totalUnits", "vestingMonths", "completedMonths", "cliffMonths"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    vestedUnits: { type: "number" },
    unvestedUnits: { type: "number" },
  },
  required: ["vestedUnits", "unvestedUnits"],
} as const;
/** Apply an explicitly supplied monthly linear vesting schedule with a cliff and full catch-up, without rounding fractional units or interpreting a contract. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalUnits, vestingMonths, completedMonths, cliffMonths } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(totalUnits) &&
        totalUnits >= 0 &&
        totalUnits <= Number.MAX_SAFE_INTEGER,
      "totalUnits",
    ),
      totalUnits);
    (H.domain(
      Number.isSafeInteger(vestingMonths) &&
        vestingMonths >= 1 &&
        vestingMonths <= Number.MAX_SAFE_INTEGER,
      "vestingMonths",
    ),
      vestingMonths);
    (H.domain(
      Number.isSafeInteger(completedMonths) &&
        completedMonths >= 0 &&
        completedMonths <= Number.MAX_SAFE_INTEGER,
      "completedMonths",
    ),
      completedMonths);
    (H.domain(
      Number.isSafeInteger(cliffMonths) &&
        cliffMonths >= 0 &&
        cliffMonths <= vestingMonths,
      "cliffMonths",
    ),
      cliffMonths);
    return (() => {
      const vestedUnits =
        completedMonths < cliffMonths
          ? 0
          : (totalUnits * Math.min(completedMonths, vestingMonths)) /
            vestingMonths;
      return { vestedUnits, unvestedUnits: totalUnits - vestedUnits };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    totalUnits: 4800,
    vestingMonths: 48,
    completedMonths: 18,
    cliffMonths: 12,
  },
  output: { vestedUnits: 1800, unvestedUnits: 3000 },
} satisfies ToolExample<Input, Output>;
export const founderEquityVestingMonthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "entrepreneurship-studies",
        "entrepreneurship studies",
        "business and finance",
      ],
      keywords: ["entrepreneurship studies", "business and finance"],
    },
    id: "entrepreneurship-studies/founder-equity-vesting-month",
    title: "Founder Equity Vesting Month",
    description:
      "Apply an explicitly supplied monthly linear vesting schedule with a cliff and full catch-up, without rounding fractional units or interpreting a contract.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalUnits: { type: "integer", minimum: 0 },
        vestingMonths: { type: "integer", minimum: 1 },
        completedMonths: { type: "integer", minimum: 0 },
        cliffMonths: { type: "integer", minimum: 0 },
      },
      required: [
        "totalUnits",
        "vestingMonths",
        "completedMonths",
        "cliffMonths",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        vestedUnits: { type: "number" },
        unvestedUnits: { type: "number" },
      },
      required: ["vestedUnits", "unvestedUnits"],
    },
    ports: {
      inputs: [
        {
          id: "totalUnits",
          label: "Total Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "vestingMonths",
          label: "Vesting Months",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "completedMonths",
          label: "Completed Months",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "cliffMonths",
          label: "Cliff Months",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "vestedUnits",
          label: "Vested Units",
          valueType: { type: "number" },
        },
        {
          id: "unvestedUnits",
          label: "Unvested Units",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = founderEquityVestingMonthTool.execute;
export default founderEquityVestingMonthTool;
