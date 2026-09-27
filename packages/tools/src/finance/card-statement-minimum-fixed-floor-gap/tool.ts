import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly balance: number;
  readonly rate: number;
  readonly fixedFloor: number;
};
export type Output = {
  readonly percentageTerm: number;
  readonly minimumPayment: number;
  readonly floorBinding: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    balance: { type: "number", minimum: 0 },
    rate: { type: "number", minimum: 0, maximum: 1 },
    fixedFloor: { type: "number", minimum: 0 },
  },
  required: ["balance", "rate", "fixedFloor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    percentageTerm: { type: "number" },
    minimumPayment: { type: "number" },
    floorBinding: { type: "boolean" },
  },
  required: ["percentageTerm", "minimumPayment", "floorBinding"],
} as const;
/** Calculate card statement minimum fixed floor gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { balance, rate, fixedFloor } = request;
  const compute = (): Output => {
    H.domain(balance >= 0 && fixedFloor >= 0);
    H.probability(rate);
    const percentageTerm = balance * rate;
    return {
      percentageTerm,
      minimumPayment: Math.min(balance, Math.max(fixedFloor, percentageTerm)),
      floorBinding: fixedFloor > percentageTerm,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { balance: 1000, rate: 0.02, fixedFloor: 25 },
  output: { percentageTerm: 20, minimumPayment: 25, floorBinding: true },
} satisfies ToolExample<Input, Output>;
export const cardStatementMinimumFixedFloorGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "finance/card-statement-minimum-fixed-floor-gap",
    title: "Card Statement Minimum Fixed Floor Gap Tool",
    description:
      "Calculate card statement minimum fixed floor gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        balance: { type: "number", minimum: 0 },
        rate: { type: "number", minimum: 0, maximum: 1 },
        fixedFloor: { type: "number", minimum: 0 },
      },
      required: ["balance", "rate", "fixedFloor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        percentageTerm: { type: "number" },
        minimumPayment: { type: "number" },
        floorBinding: { type: "boolean" },
      },
      required: ["percentageTerm", "minimumPayment", "floorBinding"],
    },
    ports: {
      inputs: [
        {
          id: "balance",
          label: "Balance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rate",
          label: "Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fixedFloor",
          label: "Fixed Floor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "percentageTerm",
          label: "Percentage Term",
          valueType: { type: "number" },
        },
        {
          id: "minimumPayment",
          label: "Minimum Payment",
          valueType: { type: "number" },
        },
        {
          id: "floorBinding",
          label: "Floor Binding",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = cardStatementMinimumFixedFloorGapTool.execute;
export default cardStatementMinimumFixedFloorGapTool;
