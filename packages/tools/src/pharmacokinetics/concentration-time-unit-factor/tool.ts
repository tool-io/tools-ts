import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly concentrationTime: number;
  readonly concentrationUnitFactor: number;
  readonly timeUnitFactor: number;
};
export type Output = { readonly converted: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    concentrationTime: { type: "number" },
    concentrationUnitFactor: { type: "number", exclusiveMinimum: 0 },
    timeUnitFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["concentrationTime", "concentrationUnitFactor", "timeUnitFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { converted: { type: "number" } },
  required: ["converted"],
} as const;
/** Convert an already supplied nonclinical concentration-time quantity using explicit compatible unit factors. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { concentrationTime, concentrationUnitFactor, timeUnitFactor } =
    request;
  const compute = (): Output => {
    H.positive(concentrationUnitFactor);
    H.positive(timeUnitFactor);
    return {
      converted: concentrationTime * concentrationUnitFactor * timeUnitFactor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    concentrationTime: 60,
    concentrationUnitFactor: 2,
    timeUnitFactor: 0.016666666666666666,
  },
  output: { converted: 2 },
} satisfies ToolExample<Input, Output>;
export const concentrationTimeUnitFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacokinetics/concentration-time-unit-factor",
    title: "Concentration Time Unit Factor Tool",
    description:
      "Convert an already supplied nonclinical concentration-time quantity using explicit compatible unit factors.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        concentrationTime: { type: "number" },
        concentrationUnitFactor: { type: "number", exclusiveMinimum: 0 },
        timeUnitFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "concentrationTime",
        "concentrationUnitFactor",
        "timeUnitFactor",
      ],
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
          id: "concentrationTime",
          label: "Concentration Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "concentrationUnitFactor",
          label: "Concentration Unit Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "timeUnitFactor",
          label: "Time Unit Factor",
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
export const run = concentrationTimeUnitFactorTool.execute;
export default concentrationTimeUnitFactorTool;
