import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cash: number;
  readonly reserve: number;
  readonly monthlyBurn: number;
};
export type Output = {
  readonly grossMonths: number;
  readonly reserveAdjustedMonths: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cash: { type: "number", minimum: 0 },
    reserve: { type: "number", minimum: 0 },
    monthlyBurn: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["cash", "reserve", "monthlyBurn"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossMonths: { type: "number" },
    reserveAdjustedMonths: { type: "number" },
  },
  required: ["grossMonths", "reserveAdjustedMonths"],
} as const;
/** Supplied constant-burn runway budget retaining a signed reserve shortfall, without a business forecast. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cash, reserve, monthlyBurn } = request;
  const compute = (): Output => {
    H.positive(monthlyBurn);
    H.domain(cash >= 0 && reserve >= 0);
    return {
      grossMonths: cash / monthlyBurn,
      reserveAdjustedMonths: (cash - reserve) / monthlyBurn,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cash: 100, reserve: 20, monthlyBurn: 10 },
  output: { grossMonths: 10, reserveAdjustedMonths: 8 },
} satisfies ToolExample<Input, Output>;
export const runwayBufferAtBurnRateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entrepreneurship-studies/runway-buffer-at-burn-rate",
    title: "Runway Buffer At Burn Rate Tool",
    description:
      "Supplied constant-burn runway budget retaining a signed reserve shortfall, without a business forecast.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cash: { type: "number", minimum: 0 },
        reserve: { type: "number", minimum: 0 },
        monthlyBurn: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["cash", "reserve", "monthlyBurn"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossMonths: { type: "number" },
        reserveAdjustedMonths: { type: "number" },
      },
      required: ["grossMonths", "reserveAdjustedMonths"],
    },
    ports: {
      inputs: [
        {
          id: "cash",
          label: "Cash",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reserve",
          label: "Reserve",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "monthlyBurn",
          label: "Monthly Burn",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "grossMonths",
          label: "Gross Months",
          valueType: { type: "number" },
        },
        {
          id: "reserveAdjustedMonths",
          label: "Reserve Adjusted Months",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = runwayBufferAtBurnRateTool.execute;
export default runwayBufferAtBurnRateTool;
