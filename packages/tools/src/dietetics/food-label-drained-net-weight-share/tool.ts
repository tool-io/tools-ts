import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly drainedMass: number; readonly netMass: number };
export type Output = { readonly fraction: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    drainedMass: { type: "number", minimum: 0 },
    netMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["drainedMass", "netMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, remainder: { type: "number" } },
  required: ["fraction", "remainder"],
} as const;
/** Calculate explicitly labeled drained-to-net food mass fraction and remaining mass without inferring nutrients. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { drainedMass, netMass } = request;
  const compute = (): Output => {
    (H.domain(Number.isFinite(netMass) && netMass > 0, "netMass"), netMass);
    H.domain(drainedMass >= 0 && drainedMass <= netMass, "drainedMass");
    return {
      fraction: drainedMass / netMass,
      remainder: netMass - drainedMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { drainedMass: 30, netMass: 120 },
  output: { fraction: 0.25, remainder: 90 },
} satisfies ToolExample<Input, Output>;
export const foodLabelDrainedNetWeightShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dietetics/food-label-drained-net-weight-share",
    title: "Food Label Drained Net Weight Share Tool",
    description:
      "Calculate explicitly labeled drained-to-net food mass fraction and remaining mass without inferring nutrients.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        drainedMass: { type: "number", minimum: 0 },
        netMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["drainedMass", "netMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        remainder: { type: "number" },
      },
      required: ["fraction", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "drainedMass",
          label: "Drained Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "netMass",
          label: "Net Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        { id: "remainder", label: "Remainder", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = foodLabelDrainedNetWeightShareTool.execute;
export default foodLabelDrainedNetWeightShareTool;
