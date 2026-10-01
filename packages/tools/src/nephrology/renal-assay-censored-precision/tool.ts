import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly qualifier: string;
  readonly quantum: number;
};
export type Output = {
  readonly lower: number;
  readonly upper: number;
  readonly lowerBounded: boolean;
  readonly upperBounded: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    qualifier: {
      type: "string",
      maxLength: 8192,
      enum: ["exact", "less-than", "greater-than"],
    },
    quantum: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["value", "qualifier", "quantum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lower: { type: "number" },
    upper: { type: "number" },
    lowerBounded: { type: "boolean" },
    upperBounded: { type: "boolean" },
  },
  required: ["lower", "upper", "lowerBounded", "upperBounded"],
} as const;
/** Represent supplied assay qualifier bounds; unbounded endpoints use flagged zero placeholders and exact means nearest supplied quantum. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, qualifier, quantum } = request;
  const compute = (): Output => {
    H.domain(["exact", "less-than", "greater-than"].includes(qualifier));
    H.positive(quantum);
    return qualifier === "exact"
      ? {
          lower: value - quantum / 2,
          upper: value + quantum / 2,
          lowerBounded: true,
          upperBounded: true,
        }
      : qualifier === "less-than"
        ? { lower: 0, upper: value, lowerBounded: false, upperBounded: true }
        : { lower: value, upper: 0, lowerBounded: true, upperBounded: false };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 4, qualifier: "less-than", quantum: 0.2 },
  output: { lower: 0, upper: 4, lowerBounded: false, upperBounded: true },
} satisfies ToolExample<Input, Output>;
export const renalAssayCensoredPrecisionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nephrology/renal-assay-censored-precision",
    title: "Renal Assay Censored Precision Tool",
    description:
      "Represent supplied assay qualifier bounds; unbounded endpoints use flagged zero placeholders and exact means nearest supplied quantum.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        qualifier: {
          type: "string",
          maxLength: 8192,
          enum: ["exact", "less-than", "greater-than"],
        },
        quantum: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["value", "qualifier", "quantum"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lower: { type: "number" },
        upper: { type: "number" },
        lowerBounded: { type: "boolean" },
        upperBounded: { type: "boolean" },
      },
      required: ["lower", "upper", "lowerBounded", "upperBounded"],
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
          id: "qualifier",
          label: "Qualifier",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "quantum",
          label: "Quantum",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "lower", label: "Lower", valueType: { type: "number" } },
        { id: "upper", label: "Upper", valueType: { type: "number" } },
        {
          id: "lowerBounded",
          label: "Lower Bounded",
          valueType: { type: "boolean" },
        },
        {
          id: "upperBounded",
          label: "Upper Bounded",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = renalAssayCensoredPrecisionTool.execute;
export default renalAssayCensoredPrecisionTool;
