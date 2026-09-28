import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly diameter: number;
  readonly boundary: number;
  readonly equalityToCoarser: boolean;
};
export type Output = { readonly side: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    diameter: { type: "number", minimum: 0 },
    boundary: { type: "number", minimum: 0 },
    equalityToCoarser: { type: "boolean" },
  },
  required: ["diameter", "boundary", "equalityToCoarser"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { side: { type: "string", maxLength: 8192 } },
  required: ["side"],
} as const;
/** Resolve one caller-supplied grain-size boundary without selecting a classification scale. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { diameter, boundary, equalityToCoarser } = request;
  const compute = (): Output => {
    H.domain(diameter >= 0 && boundary >= 0);
    return {
      side:
        diameter > boundary || (diameter === boundary && equalityToCoarser)
          ? "coarser"
          : "finer",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { diameter: 2, boundary: 2, equalityToCoarser: true },
  output: { side: "coarser" },
} satisfies ToolExample<Input, Output>;
export const grainClassBoundaryClosureTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geomorphology/grain-class-boundary-closure-token",
    title: "Grain Class Boundary Closure Token Tool",
    description:
      "Resolve one caller-supplied grain-size boundary without selecting a classification scale.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        diameter: { type: "number", minimum: 0 },
        boundary: { type: "number", minimum: 0 },
        equalityToCoarser: { type: "boolean" },
      },
      required: ["diameter", "boundary", "equalityToCoarser"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { side: { type: "string", maxLength: 8192 } },
      required: ["side"],
    },
    ports: {
      inputs: [
        {
          id: "diameter",
          label: "Diameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "boundary",
          label: "Boundary",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "equalityToCoarser",
          label: "Equality To Coarser",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "side", label: "Side", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = grainClassBoundaryClosureTokenTool.execute;
export default grainClassBoundaryClosureTokenTool;
