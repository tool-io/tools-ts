import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly signedBalance: number;
  readonly positiveMeansReceivable: boolean;
};
export type Output = {
  readonly classification: string;
  readonly magnitude: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedBalance: { type: "number" },
    positiveMeansReceivable: { type: "boolean" },
  },
  required: ["signedBalance", "positiveMeansReceivable"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    classification: { type: "string", maxLength: 8192 },
    magnitude: { type: "number" },
  },
  required: ["classification", "magnitude"],
} as const;
/** Label one intercompany balance using an explicit sign convention while preserving its nonnegative magnitude. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { signedBalance, positiveMeansReceivable } = request;
  const compute = (): Output => {
    return {
      classification:
        signedBalance === 0
          ? "settled"
          : signedBalance > 0 === positiveMeansReceivable
            ? "receivable"
            : "payable",
      magnitude: Math.abs(signedBalance),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { signedBalance: 500, positiveMeansReceivable: true },
  output: { classification: "receivable", magnitude: 500 },
} satisfies ToolExample<Input, Output>;
export const intercompanyBalanceSignLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "business-administration",
        "business administration",
        "business and finance",
      ],
      keywords: ["business administration", "business and finance"],
    },
    id: "business-administration/intercompany-balance-sign-label",
    title: "Intercompany Balance Sign Label",
    description:
      "Label one intercompany balance using an explicit sign convention while preserving its nonnegative magnitude.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedBalance: { type: "number" },
        positiveMeansReceivable: { type: "boolean" },
      },
      required: ["signedBalance", "positiveMeansReceivable"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        classification: { type: "string", maxLength: 8192 },
        magnitude: { type: "number" },
      },
      required: ["classification", "magnitude"],
    },
    ports: {
      inputs: [
        {
          id: "signedBalance",
          label: "Signed Balance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "positiveMeansReceivable",
          label: "Positive Means Receivable",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "classification",
          label: "Classification",
          valueType: { type: "string" },
        },
        { id: "magnitude", label: "Magnitude", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = intercompanyBalanceSignLabelTool.execute;
export default intercompanyBalanceSignLabelTool;
