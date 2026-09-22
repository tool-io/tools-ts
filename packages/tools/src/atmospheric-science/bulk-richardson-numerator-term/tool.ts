import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly gravity: number;
  readonly referenceTheta: number;
  readonly thetaDifference: number;
  readonly heightDifference: number;
};
export type Output = { readonly numerator: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gravity: { type: "number", exclusiveMinimum: 0 },
    referenceTheta: { type: "number", exclusiveMinimum: 0 },
    thetaDifference: { type: "number" },
    heightDifference: { type: "number" },
  },
  required: [
    "gravity",
    "referenceTheta",
    "thetaDifference",
    "heightDifference",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { numerator: { type: "number" } },
  required: ["numerator"],
} as const;
/** Return the buoyancy numerator before division by squared horizontal velocity change. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { gravity, referenceTheta, thetaDifference, heightDifference } =
    request;
  const compute = (): Output => {
    H.positive(gravity);
    H.positive(referenceTheta);
    return {
      numerator:
        (gravity * thetaDifference * heightDifference) / referenceTheta,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    gravity: 9.81,
    referenceTheta: 300,
    thetaDifference: 3,
    heightDifference: 100,
  },
  output: { numerator: 9.81 },
} satisfies ToolExample<Input, Output>;
export const bulkRichardsonNumeratorTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-science/bulk-richardson-numerator-term",
    title: "Bulk Richardson Numerator Term Tool",
    description:
      "Return the buoyancy numerator before division by squared horizontal velocity change.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gravity: { type: "number", exclusiveMinimum: 0 },
        referenceTheta: { type: "number", exclusiveMinimum: 0 },
        thetaDifference: { type: "number" },
        heightDifference: { type: "number" },
      },
      required: [
        "gravity",
        "referenceTheta",
        "thetaDifference",
        "heightDifference",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { numerator: { type: "number" } },
      required: ["numerator"],
    },
    ports: {
      inputs: [
        {
          id: "gravity",
          label: "Gravity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceTheta",
          label: "Reference Theta",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "thetaDifference",
          label: "Theta Difference",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "heightDifference",
          label: "Height Difference",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "numerator", label: "Numerator", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = bulkRichardsonNumeratorTermTool.execute;
export default bulkRichardsonNumeratorTermTool;
