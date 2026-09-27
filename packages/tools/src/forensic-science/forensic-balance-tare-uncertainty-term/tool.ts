import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly gross: number;
  readonly tare: number;
  readonly grossUncertainty: number;
  readonly tareUncertainty: number;
  readonly correlation: number;
};
export type Output = {
  readonly net: number;
  readonly combinedUncertainty: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gross: { type: "number" },
    tare: { type: "number" },
    grossUncertainty: { type: "number", minimum: 0 },
    tareUncertainty: { type: "number", minimum: 0 },
    correlation: { type: "number", minimum: -1, maximum: 1 },
  },
  required: [
    "gross",
    "tare",
    "grossUncertainty",
    "tareUncertainty",
    "correlation",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    net: { type: "number" },
    combinedUncertainty: { type: "number" },
  },
  required: ["net", "combinedUncertainty"],
} as const;
/** Net mass and first-order correlated standard uncertainty of a difference, without a coverage-factor expansion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { gross, tare, grossUncertainty, tareUncertainty, correlation } =
    request;
  const compute = (): Output => {
    H.domain(
      grossUncertainty >= 0 &&
        tareUncertainty >= 0 &&
        correlation >= -1 &&
        correlation <= 1,
    );
    return {
      net: gross - tare,
      combinedUncertainty: Math.sqrt(
        Math.max(
          0,
          grossUncertainty ** 2 +
            tareUncertainty ** 2 -
            2 * correlation * grossUncertainty * tareUncertainty,
        ),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    gross: 12,
    tare: 2,
    grossUncertainty: 0.3,
    tareUncertainty: 0.4,
    correlation: 0,
  },
  output: { net: 10, combinedUncertainty: 0.5 },
} satisfies ToolExample<Input, Output>;
export const forensicBalanceTareUncertaintyTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "forensic-science/forensic-balance-tare-uncertainty-term",
    title: "Forensic Balance Tare Uncertainty Term Tool",
    description:
      "Net mass and first-order correlated standard uncertainty of a difference, without a coverage-factor expansion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gross: { type: "number" },
        tare: { type: "number" },
        grossUncertainty: { type: "number", minimum: 0 },
        tareUncertainty: { type: "number", minimum: 0 },
        correlation: { type: "number", minimum: -1, maximum: 1 },
      },
      required: [
        "gross",
        "tare",
        "grossUncertainty",
        "tareUncertainty",
        "correlation",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        net: { type: "number" },
        combinedUncertainty: { type: "number" },
      },
      required: ["net", "combinedUncertainty"],
    },
    ports: {
      inputs: [
        {
          id: "gross",
          label: "Gross",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tare",
          label: "Tare",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "grossUncertainty",
          label: "Gross Uncertainty",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tareUncertainty",
          label: "Tare Uncertainty",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "correlation",
          label: "Correlation",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "net", label: "Net", valueType: { type: "number" } },
        {
          id: "combinedUncertainty",
          label: "Combined Uncertainty",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = forensicBalanceTareUncertaintyTermTool.execute;
export default forensicBalanceTareUncertaintyTermTool;
