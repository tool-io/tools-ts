import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly volumetricRate: number;
  readonly density: number;
};
export type Output = { readonly massSpecificRate: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    volumetricRate: { type: "number" },
    density: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["volumetricRate", "density"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { massSpecificRate: { type: "number" } },
  required: ["massSpecificRate"],
} as const;
/** Convert amount per volume per time to amount per mass per time using a consistent bulk density. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { volumetricRate, density } = request;
  const compute = (): Output => {
    H.positive(density);
    return { massSpecificRate: volumetricRate / density };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { volumetricRate: 120, density: 800 },
  output: { massSpecificRate: 0.15 },
} satisfies ToolExample<Input, Output>;
export const reactionRateVolumeMassBasisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "convert/reaction-rate-volume-mass-basis",
    title: "Reaction Rate Volume Mass Basis Tool",
    description:
      "Convert amount per volume per time to amount per mass per time using a consistent bulk density.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        volumetricRate: { type: "number" },
        density: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["volumetricRate", "density"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { massSpecificRate: { type: "number" } },
      required: ["massSpecificRate"],
    },
    ports: {
      inputs: [
        {
          id: "volumetricRate",
          label: "Volumetric Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "density",
          label: "Density",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "massSpecificRate",
          label: "Mass Specific Rate",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = reactionRateVolumeMassBasisTool.execute;
export default reactionRateVolumeMassBasisTool;
