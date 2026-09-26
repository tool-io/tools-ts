import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly resistivity: number;
  readonly oneWayLength: number;
  readonly area: number;
};
export type Output = { readonly loopResistance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resistivity: { type: "number", minimum: 0 },
    oneWayLength: { type: "number", minimum: 0 },
    area: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["resistivity", "oneWayLength", "area"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { loopResistance: { type: "number" } },
  required: ["loopResistance"],
} as const;
/** Calculate cable resistance two wire loop factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { resistivity, oneWayLength, area } = request;
  const compute = (): Output => {
    H.domain(resistivity >= 0 && oneWayLength >= 0);
    H.positive(area);
    return { loopResistance: (2 * resistivity * oneWayLength) / area };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { resistivity: 1.72e-8, oneWayLength: 10, area: 0.000001 },
  output: { loopResistance: 0.344 },
} satisfies ToolExample<Input, Output>;
export const cableResistanceTwoWireLoopFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electricity/cable-resistance-two-wire-loop-factor",
    title: "Cable Resistance Two Wire Loop Factor Tool",
    description:
      "Calculate cable resistance two wire loop factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        resistivity: { type: "number", minimum: 0 },
        oneWayLength: { type: "number", minimum: 0 },
        area: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["resistivity", "oneWayLength", "area"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { loopResistance: { type: "number" } },
      required: ["loopResistance"],
    },
    ports: {
      inputs: [
        {
          id: "resistivity",
          label: "Resistivity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "oneWayLength",
          label: "One Way Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "area",
          label: "Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "loopResistance",
          label: "Loop Resistance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cableResistanceTwoWireLoopFactorTool.execute;
export default cableResistanceTwoWireLoopFactorTool;
