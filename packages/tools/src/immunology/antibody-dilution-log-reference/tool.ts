import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reciprocalDilution: number;
  readonly referenceReciprocal: number;
  readonly logBase: number;
};
export type Output = { readonly logDifference: number; readonly ratio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reciprocalDilution: { type: "number", exclusiveMinimum: 0 },
    referenceReciprocal: { type: "number", exclusiveMinimum: 0 },
    logBase: { type: "number", exclusiveMinimum: 1 },
  },
  required: ["reciprocalDilution", "referenceReciprocal", "logBase"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { logDifference: { type: "number" }, ratio: { type: "number" } },
  required: ["logDifference", "ratio"],
} as const;
/** Logarithmic comparison of supplied dilution notation without recommending an assay dilution. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reciprocalDilution, referenceReciprocal, logBase } = request;
  const compute = (): Output => {
    H.positive(reciprocalDilution);
    H.positive(referenceReciprocal);
    H.domain(logBase > 1);
    return {
      logDifference:
        Math.log(reciprocalDilution / referenceReciprocal) / Math.log(logBase),
      ratio: reciprocalDilution / referenceReciprocal,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reciprocalDilution: 400, referenceReciprocal: 100, logBase: 2 },
  output: { logDifference: 2, ratio: 4 },
} satisfies ToolExample<Input, Output>;
export const antibodyDilutionLogReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "immunology/antibody-dilution-log-reference",
    title: "Antibody Dilution Log Reference Tool",
    description:
      "Logarithmic comparison of supplied dilution notation without recommending an assay dilution.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reciprocalDilution: { type: "number", exclusiveMinimum: 0 },
        referenceReciprocal: { type: "number", exclusiveMinimum: 0 },
        logBase: { type: "number", exclusiveMinimum: 1 },
      },
      required: ["reciprocalDilution", "referenceReciprocal", "logBase"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        logDifference: { type: "number" },
        ratio: { type: "number" },
      },
      required: ["logDifference", "ratio"],
    },
    ports: {
      inputs: [
        {
          id: "reciprocalDilution",
          label: "Reciprocal Dilution",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceReciprocal",
          label: "Reference Reciprocal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "logBase",
          label: "Log Base",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "logDifference",
          label: "Log Difference",
          valueType: { type: "number" },
        },
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = antibodyDilutionLogReferenceTool.execute;
export default antibodyDilutionLogReferenceTool;
