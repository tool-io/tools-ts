import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstCoordinate: number;
  readonly secondCoordinate: number;
  readonly firstNorm: number;
  readonly secondNorm: number;
};
export type Output = { readonly contribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstCoordinate: { type: "number" },
    secondCoordinate: { type: "number" },
    firstNorm: { type: "number", exclusiveMinimum: 0 },
    secondNorm: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firstCoordinate", "secondCoordinate", "firstNorm", "secondNorm"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { contribution: { type: "number" } },
  required: ["contribution"],
} as const;
/** Return one coordinate's contribution to cosine similarity from supplied full-vector L2 norms. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstCoordinate, secondCoordinate, firstNorm, secondNorm } = request;
  const compute = (): Output => {
    (H.domain(firstNorm > 0, "firstNorm"), firstNorm);
    (H.domain(secondNorm > 0, "secondNorm"), secondNorm);
    H.domain(
      Math.abs(firstCoordinate) <= firstNorm &&
        Math.abs(secondCoordinate) <= secondNorm,
      "firstCoordinate",
    );
    return {
      contribution:
        (firstCoordinate / firstNorm) * (secondCoordinate / secondNorm),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstCoordinate: 3,
    secondCoordinate: 4,
    firstNorm: 5,
    secondNorm: 5,
  },
  output: { contribution: 0.48 },
} satisfies ToolExample<Input, Output>;
export const cosineCoordinateTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "similarity/cosine-coordinate-term",
    title: "Cosine Coordinate Term Tool",
    description:
      "Return one coordinate's contribution to cosine similarity from supplied full-vector L2 norms.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstCoordinate: { type: "number" },
        secondCoordinate: { type: "number" },
        firstNorm: { type: "number", exclusiveMinimum: 0 },
        secondNorm: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "firstCoordinate",
        "secondCoordinate",
        "firstNorm",
        "secondNorm",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { contribution: { type: "number" } },
      required: ["contribution"],
    },
    ports: {
      inputs: [
        {
          id: "firstCoordinate",
          label: "First Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondCoordinate",
          label: "Second Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstNorm",
          label: "First Norm",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondNorm",
          label: "Second Norm",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "contribution",
          label: "Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cosineCoordinateTermTool.execute;
export default cosineCoordinateTermTool;
