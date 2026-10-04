import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly labeledCountDecimal: string;
  readonly orbitSizeDecimal: string;
};
export type Output = { readonly unlabeledCountDecimal: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    labeledCountDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    orbitSizeDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
  },
  required: ["labeledCountDecimal", "orbitSizeDecimal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unlabeledCountDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
  },
  required: ["unlabeledCountDecimal"],
} as const;
/** Divide an exact labeled-object count by a supplied common orbit size, requiring exact divisibility. Applicability of the common-size assumption is the caller's responsibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { labeledCountDecimal, orbitSizeDecimal } = request;
  const compute = (): Output => {
    const a = H.decimal(labeledCountDecimal),
      b = H.decimal(orbitSizeDecimal);
    H.domain(a >= 0n && b > 0n && a % b === 0n, "");
    return { unlabeledCountDecimal: (a / b).toString() };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { labeledCountDecimal: "120", orbitSizeDecimal: "6" },
  output: { unlabeledCountDecimal: "20" },
} satisfies ToolExample<Input, Output>;
export const labeledUnlabeledOrbitQuotientTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "combinatorics/labeled-unlabeled-orbit-quotient",
    title: "Labeled Unlabeled Orbit Quotient Tool",
    description:
      "Divide an exact labeled-object count by a supplied common orbit size, requiring exact divisibility. Applicability of the common-size assumption is the caller's responsibility.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        labeledCountDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        orbitSizeDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
      },
      required: ["labeledCountDecimal", "orbitSizeDecimal"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unlabeledCountDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
      },
      required: ["unlabeledCountDecimal"],
    },
    ports: {
      inputs: [
        {
          id: "labeledCountDecimal",
          label: "Labeled Count Decimal",
          required: true,
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "orbitSizeDecimal",
          label: "Orbit Size Decimal",
          required: true,
          valueType: { type: "string", format: "integer-decimal" },
        },
      ],
      outputs: [
        {
          id: "unlabeledCountDecimal",
          label: "Unlabeled Count Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
      ],
    },
  },
  calculate,
});
export const run = labeledUnlabeledOrbitQuotientTool.execute;
export default labeledUnlabeledOrbitQuotientTool;
