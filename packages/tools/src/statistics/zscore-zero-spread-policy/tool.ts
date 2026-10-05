import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly center: number;
  readonly spread: number;
  readonly zeroPolicy: string;
};
export type Output = { readonly defined: boolean; readonly zscore: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    center: { type: "number" },
    spread: { type: "number" },
    zeroPolicy: {
      type: "string",
      maxLength: 8192,
      enum: ["reject", "report-undefined"],
    },
  },
  required: ["value", "center", "spread", "zeroPolicy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { defined: { type: "boolean" }, zscore: { type: "number" } },
  required: ["defined", "zscore"],
} as const;
/** Apply a supplied center and spread to one z-score, with an explicit zero-spread policy. When undefined, the numeric zero is a sentinel identified by defined=false. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, center, spread, zeroPolicy } = request;
  const compute = (): Output => {
    H.domain(spread >= 0, "spread");
    H.domain(["reject", "report-undefined"].includes(zeroPolicy), "zeroPolicy");
    if (spread === 0) {
      H.domain(zeroPolicy !== "reject", "spread");
      return { defined: false, zscore: 0 };
    }
    return { defined: true, zscore: (value - center) / spread };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 8, center: 5, spread: 2, zeroPolicy: "reject" },
  output: { defined: true, zscore: 1.5 },
} satisfies ToolExample<Input, Output>;
export const zscoreZeroSpreadPolicyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "statistics/zscore-zero-spread-policy",
    title: "Zscore Zero Spread Policy Tool",
    description:
      "Apply a supplied center and spread to one z-score, with an explicit zero-spread policy. When undefined, the numeric zero is a sentinel identified by defined=false.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        center: { type: "number" },
        spread: { type: "number" },
        zeroPolicy: {
          type: "string",
          maxLength: 8192,
          enum: ["reject", "report-undefined"],
        },
      },
      required: ["value", "center", "spread", "zeroPolicy"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { defined: { type: "boolean" }, zscore: { type: "number" } },
      required: ["defined", "zscore"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "center",
          label: "Center",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "spread",
          label: "Spread",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "zeroPolicy",
          label: "Zero Policy",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
        { id: "zscore", label: "Zscore", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = zscoreZeroSpreadPolicyTool.execute;
export default zscoreZeroSpreadPolicyTool;
