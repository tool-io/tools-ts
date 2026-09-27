import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingStock: number;
  readonly receivedStock: number;
  readonly usedStock: number;
  readonly observedClosing: number;
  readonly measuredLoss: number;
};
export type Output = {
  readonly expectedClosing: number;
  readonly discrepancy: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingStock: { type: "number", minimum: 0 },
    receivedStock: { type: "number", minimum: 0 },
    usedStock: { type: "number", minimum: 0 },
    observedClosing: { type: "number", minimum: 0 },
    measuredLoss: { type: "number", minimum: 0 },
  },
  required: [
    "openingStock",
    "receivedStock",
    "usedStock",
    "observedClosing",
    "measuredLoss",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedClosing: { type: "number" },
    discrepancy: { type: "number" },
  },
  required: ["expectedClosing", "discrepancy"],
} as const;
/** Calculate household stock source gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    openingStock,
    receivedStock,
    usedStock,
    observedClosing,
    measuredLoss,
  } = request;
  const compute = (): Output => {
    H.domain(
      openingStock >= 0 &&
        receivedStock >= 0 &&
        usedStock >= 0 &&
        observedClosing >= 0 &&
        measuredLoss >= 0,
    );
    return (() => {
      const expectedClosing =
        openingStock + receivedStock - usedStock - measuredLoss;
      return {
        expectedClosing,
        discrepancy: observedClosing - expectedClosing,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    openingStock: 20,
    receivedStock: 10,
    usedStock: 8,
    observedClosing: 20,
    measuredLoss: 1,
  },
  output: { expectedClosing: 21, discrepancy: -1 },
} satisfies ToolExample<Input, Output>;
export const householdStockSourceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-security/household-stock-source-gap",
    title: "Household Stock Source Gap Tool",
    description:
      "Calculate household stock source gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingStock: { type: "number", minimum: 0 },
        receivedStock: { type: "number", minimum: 0 },
        usedStock: { type: "number", minimum: 0 },
        observedClosing: { type: "number", minimum: 0 },
        measuredLoss: { type: "number", minimum: 0 },
      },
      required: [
        "openingStock",
        "receivedStock",
        "usedStock",
        "observedClosing",
        "measuredLoss",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedClosing: { type: "number" },
        discrepancy: { type: "number" },
      },
      required: ["expectedClosing", "discrepancy"],
    },
    ports: {
      inputs: [
        {
          id: "openingStock",
          label: "Opening Stock",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "receivedStock",
          label: "Received Stock",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "usedStock",
          label: "Used Stock",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observedClosing",
          label: "Observed Closing",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredLoss",
          label: "Measured Loss",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "expectedClosing",
          label: "Expected Closing",
          valueType: { type: "number" },
        },
        {
          id: "discrepancy",
          label: "Discrepancy",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = householdStockSourceGapTool.execute;
export default householdStockSourceGapTool;
