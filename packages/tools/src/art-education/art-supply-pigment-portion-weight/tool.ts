import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalPigmentMass: number;
  readonly portionFraction: number;
};
export type Output = { readonly portionMass: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalPigmentMass: { type: "number", minimum: 0 },
    portionFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["totalPigmentMass", "portionFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { portionMass: { type: "number" } },
  required: ["portionMass"],
} as const;
/** Apply an explicitly supplied fraction to pigment mass without selecting a recipe or handling procedure. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalPigmentMass, portionFraction } = request;
  const compute = (): Output => {
    H.domain(totalPigmentMass >= 0, "totalPigmentMass");
    (H.domain(portionFraction >= 0 && portionFraction <= 1, "portionFraction"),
      portionFraction);
    return { portionMass: totalPigmentMass * portionFraction };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalPigmentMass: 80, portionFraction: 0.25 },
  output: { portionMass: 20 },
} satisfies ToolExample<Input, Output>;
export const artSupplyPigmentPortionWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["art-education", "art education", "education"],
      keywords: ["art education", "education"],
    },
    id: "art-education/art-supply-pigment-portion-weight",
    title: "Art Supply Pigment Portion Weight",
    description:
      "Apply an explicitly supplied fraction to pigment mass without selecting a recipe or handling procedure.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalPigmentMass: { type: "number", minimum: 0 },
        portionFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["totalPigmentMass", "portionFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { portionMass: { type: "number" } },
      required: ["portionMass"],
    },
    ports: {
      inputs: [
        {
          id: "totalPigmentMass",
          label: "Total Pigment Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "portionFraction",
          label: "Portion Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "portionMass",
          label: "Portion Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = artSupplyPigmentPortionWeightTool.execute;
export default artSupplyPigmentPortionWeightTool;
