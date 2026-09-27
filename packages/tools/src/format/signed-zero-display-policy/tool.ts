import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly source: string; readonly accounting: boolean };
export type Output = {
  readonly display: string;
  readonly negativeSource: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    source: {
      type: "string",
      maxLength: 8192,
      enum: ["0", "+0", "-0", "0.0", "+0.0", "-0.0"],
    },
    accounting: { type: "boolean" },
  },
  required: ["source", "accounting"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    display: { type: "string", maxLength: 8192 },
    negativeSource: { type: "boolean" },
  },
  required: ["display", "negativeSource"],
} as const;
/** Preserve explicit source sign evidence while selecting a narrow zero display policy; no numeric rounding is performed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { source, accounting } = request;
  const compute = (): Output => {
    H.domain(["0", "+0", "-0", "0.0", "+0.0", "-0.0"].includes(source));
    const negativeSource = source.startsWith("-");
    return {
      display: accounting && negativeSource ? "(0)" : "0",
      negativeSource,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { source: "-0", accounting: true },
  output: { display: "(0)", negativeSource: true },
} satisfies ToolExample<Input, Output>;
export const signedZeroDisplayPolicyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "format/signed-zero-display-policy",
    title: "Signed Zero Display Policy Tool",
    description:
      "Preserve explicit source sign evidence while selecting a narrow zero display policy; no numeric rounding is performed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        source: {
          type: "string",
          maxLength: 8192,
          enum: ["0", "+0", "-0", "0.0", "+0.0", "-0.0"],
        },
        accounting: { type: "boolean" },
      },
      required: ["source", "accounting"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        display: { type: "string", maxLength: 8192 },
        negativeSource: { type: "boolean" },
      },
      required: ["display", "negativeSource"],
    },
    ports: {
      inputs: [
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "accounting",
          label: "Accounting",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "display", label: "Display", valueType: { type: "string" } },
        {
          id: "negativeSource",
          label: "Negative Source",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = signedZeroDisplayPolicyTool.execute;
export default signedZeroDisplayPolicyTool;
