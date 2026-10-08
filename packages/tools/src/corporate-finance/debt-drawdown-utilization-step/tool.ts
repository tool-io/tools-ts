import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly facilityLimit: number;
  readonly openingDrawn: number;
  readonly newDrawdown: number;
  readonly repayment: number;
};
export type Output = {
  readonly closingDrawn: number;
  readonly utilization: number;
  readonly undrawn: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    facilityLimit: { type: "number", exclusiveMinimum: 0 },
    openingDrawn: { type: "number", minimum: 0 },
    newDrawdown: { type: "number", minimum: 0 },
    repayment: { type: "number", minimum: 0 },
  },
  required: ["facilityLimit", "openingDrawn", "newDrawdown", "repayment"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    closingDrawn: { type: "number" },
    utilization: { type: "number" },
    undrawn: { type: "number" },
  },
  required: ["closingDrawn", "utilization", "undrawn"],
} as const;
/** Balance one explicitly recorded facility drawdown/repayment step and report resulting utilization without inferring credit availability covenants. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { facilityLimit, openingDrawn, newDrawdown, repayment } = request;
  const compute = (): Output => {
    (H.domain(facilityLimit > 0, "facilityLimit"), facilityLimit);
    H.domain(
      openingDrawn >= 0 &&
        openingDrawn <= facilityLimit &&
        newDrawdown >= 0 &&
        repayment >= 0,
      "openingDrawn",
    );
    return (() => {
      const closingDrawn = openingDrawn + newDrawdown - repayment;
      H.domain(
        closingDrawn >= 0 && closingDrawn <= facilityLimit,
        "facilityLimit",
      );
      return {
        closingDrawn,
        utilization: closingDrawn / facilityLimit,
        undrawn: facilityLimit - closingDrawn,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    facilityLimit: 1000,
    openingDrawn: 400,
    newDrawdown: 200,
    repayment: 100,
  },
  output: { closingDrawn: 500, utilization: 0.5, undrawn: 500 },
} satisfies ToolExample<Input, Output>;
export const debtDrawdownUtilizationStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "trading"],
      fields: [
        "corporate-finance",
        "corporate finance",
        "business and finance",
      ],
      keywords: ["corporate finance", "business and finance"],
    },
    id: "corporate-finance/debt-drawdown-utilization-step",
    title: "Debt Drawdown Utilization Step",
    description:
      "Balance one explicitly recorded facility drawdown/repayment step and report resulting utilization without inferring credit availability covenants.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        facilityLimit: { type: "number", exclusiveMinimum: 0 },
        openingDrawn: { type: "number", minimum: 0 },
        newDrawdown: { type: "number", minimum: 0 },
        repayment: { type: "number", minimum: 0 },
      },
      required: ["facilityLimit", "openingDrawn", "newDrawdown", "repayment"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        closingDrawn: { type: "number" },
        utilization: { type: "number" },
        undrawn: { type: "number" },
      },
      required: ["closingDrawn", "utilization", "undrawn"],
    },
    ports: {
      inputs: [
        {
          id: "facilityLimit",
          label: "Facility Limit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "openingDrawn",
          label: "Opening Drawn",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "newDrawdown",
          label: "New Drawdown",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "repayment",
          label: "Repayment",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "closingDrawn",
          label: "Closing Drawn",
          valueType: { type: "number" },
        },
        {
          id: "utilization",
          label: "Utilization",
          valueType: { type: "number" },
        },
        { id: "undrawn", label: "Undrawn", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = debtDrawdownUtilizationStepTool.execute;
export default debtDrawdownUtilizationStepTool;
