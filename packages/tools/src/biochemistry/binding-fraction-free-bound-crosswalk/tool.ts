import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly freeAmount: number;
  readonly boundAmount: number;
};
export type Output = {
  readonly boundFraction: number;
  readonly freeFraction: number;
  readonly totalAmount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    freeAmount: { type: "number", minimum: 0 },
    boundAmount: { type: "number", minimum: 0 },
  },
  required: ["freeAmount", "boundAmount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    boundFraction: { type: "number" },
    freeFraction: { type: "number" },
    totalAmount: { type: "number" },
  },
  required: ["boundFraction", "freeFraction", "totalAmount"],
} as const;
/** Describe a supplied two-pool free/bound amount partition without fitting an affinity or binding model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { freeAmount, boundAmount } = request;
  const compute = (): Output => {
    H.domain(
      freeAmount >= 0 && boundAmount >= 0 && freeAmount + boundAmount > 0,
      "freeAmount",
    );
    return {
      boundFraction: boundAmount / (freeAmount + boundAmount),
      freeFraction: freeAmount / (freeAmount + boundAmount),
      totalAmount: freeAmount + boundAmount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { freeAmount: 20, boundAmount: 80 },
  output: { boundFraction: 0.8, freeFraction: 0.2, totalAmount: 100 },
} satisfies ToolExample<Input, Output>;
export const bindingFractionFreeBoundCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biochemistry", "biology"],
      keywords: ["biochemistry", "biology"],
    },
    id: "biochemistry/binding-fraction-free-bound-crosswalk",
    title: "Binding Fraction Free Bound Crosswalk",
    description:
      "Describe a supplied two-pool free/bound amount partition without fitting an affinity or binding model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        freeAmount: { type: "number", minimum: 0 },
        boundAmount: { type: "number", minimum: 0 },
      },
      required: ["freeAmount", "boundAmount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        boundFraction: { type: "number" },
        freeFraction: { type: "number" },
        totalAmount: { type: "number" },
      },
      required: ["boundFraction", "freeFraction", "totalAmount"],
    },
    ports: {
      inputs: [
        {
          id: "freeAmount",
          label: "Free Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "boundAmount",
          label: "Bound Amount",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "boundFraction",
          label: "Bound Fraction",
          valueType: { type: "number" },
        },
        {
          id: "freeFraction",
          label: "Free Fraction",
          valueType: { type: "number" },
        },
        {
          id: "totalAmount",
          label: "Total Amount",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = bindingFractionFreeBoundCrosswalkTool.execute;
export default bindingFractionFreeBoundCrosswalkTool;
