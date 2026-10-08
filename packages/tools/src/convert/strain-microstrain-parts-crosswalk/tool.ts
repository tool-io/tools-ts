import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly strain: number };
export type Output = {
  readonly microstrain: number;
  readonly partsPerMillion: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { strain: { type: "number" } },
  required: ["strain"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    microstrain: { type: "number" },
    partsPerMillion: { type: "number" },
  },
  required: ["microstrain", "partsPerMillion"],
} as const;
/** Convert an explicit signed dimensionless strain to microstrain and equivalent parts per million. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { strain } = request;
  const compute = (): Output => {
    return { microstrain: strain * 1e6, partsPerMillion: strain * 1e6 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { strain: 0.00025 },
  output: { microstrain: 250, partsPerMillion: 250 },
} satisfies ToolExample<Input, Output>;
export const strainMicrostrainPartsCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["encode-decode"],
      fields: ["convert", "unit conversion", "computer science"],
      keywords: ["unit conversion", "computer science"],
    },
    id: "convert/strain-microstrain-parts-crosswalk",
    title: "Strain Microstrain Parts Crosswalk",
    description:
      "Convert an explicit signed dimensionless strain to microstrain and equivalent parts per million.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { strain: { type: "number" } },
      required: ["strain"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        microstrain: { type: "number" },
        partsPerMillion: { type: "number" },
      },
      required: ["microstrain", "partsPerMillion"],
    },
    ports: {
      inputs: [
        {
          id: "strain",
          label: "Strain",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "microstrain",
          label: "Microstrain",
          valueType: { type: "number" },
        },
        {
          id: "partsPerMillion",
          label: "Parts Per Million",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = strainMicrostrainPartsCrosswalkTool.execute;
export default strainMicrostrainPartsCrosswalkTool;
