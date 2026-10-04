import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recorded: number;
  readonly unitFactor: number;
  readonly zeroOffset: number;
};
export type Output = { readonly converted: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recorded: { type: "number" },
    unitFactor: { type: "number", exclusiveMinimum: 0 },
    zeroOffset: { type: "number" },
  },
  required: ["recorded", "unitFactor", "zeroOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { converted: { type: "number" } },
  required: ["converted"],
} as const;
/** Apply an explicit bench pressure unit and zero-reference transform. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recorded, unitFactor, zeroOffset } = request;
  const compute = (): Output => {
    H.positive(unitFactor);
    return { converted: (recorded - zeroOffset) * unitFactor };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recorded: 12, unitFactor: 0.5, zeroOffset: 2 },
  output: { converted: 5 },
} satisfies ToolExample<Input, Output>;
export const pressureReferenceUnitFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urology/pressure-reference-unit-factor",
    title: "Pressure Reference Unit Factor Tool",
    description:
      "Apply an explicit bench pressure unit and zero-reference transform.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recorded: { type: "number" },
        unitFactor: { type: "number", exclusiveMinimum: 0 },
        zeroOffset: { type: "number" },
      },
      required: ["recorded", "unitFactor", "zeroOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { converted: { type: "number" } },
      required: ["converted"],
    },
    ports: {
      inputs: [
        {
          id: "recorded",
          label: "Recorded",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unitFactor",
          label: "Unit Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "zeroOffset",
          label: "Zero Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "converted", label: "Converted", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = pressureReferenceUnitFactorTool.execute;
export default pressureReferenceUnitFactorTool;
