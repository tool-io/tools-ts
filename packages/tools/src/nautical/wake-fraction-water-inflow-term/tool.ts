import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly shipSpeed: number;
  readonly inflowSpeed: number;
};
export type Output = { readonly wakeFraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shipSpeed: { type: "number", exclusiveMinimum: 0 },
    inflowSpeed: { type: "number", minimum: 0 },
  },
  required: ["shipSpeed", "inflowSpeed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { wakeFraction: { type: "number" } },
  required: ["wakeFraction"],
} as const;
/** Calculate wake fraction water inflow term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { shipSpeed, inflowSpeed } = request;
  const compute = (): Output => {
    H.positive(shipSpeed);
    H.domain(inflowSpeed >= 0);
    return { wakeFraction: 1 - inflowSpeed / shipSpeed };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { shipSpeed: 10, inflowSpeed: 8 },
  output: { wakeFraction: 0.19999999999999996 },
} satisfies ToolExample<Input, Output>;
export const wakeFractionWaterInflowTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nautical/wake-fraction-water-inflow-term",
    title: "Wake Fraction Water Inflow Term Tool",
    description:
      "Calculate wake fraction water inflow term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shipSpeed: { type: "number", exclusiveMinimum: 0 },
        inflowSpeed: { type: "number", minimum: 0 },
      },
      required: ["shipSpeed", "inflowSpeed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { wakeFraction: { type: "number" } },
      required: ["wakeFraction"],
    },
    ports: {
      inputs: [
        {
          id: "shipSpeed",
          label: "Ship Speed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inflowSpeed",
          label: "Inflow Speed",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "wakeFraction",
          label: "Wake Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = wakeFractionWaterInflowTermTool.execute;
export default wakeFractionWaterInflowTermTool;
