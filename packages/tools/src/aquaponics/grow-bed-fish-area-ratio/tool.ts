import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly growBedArea: number;
  readonly suppliedFishArea: number;
};
export type Output = { readonly ratio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    growBedArea: { type: "number", minimum: 0 },
    suppliedFishArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["growBedArea", "suppliedFishArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ratio: { type: "number" } },
  required: ["ratio"],
} as const;
/** Compare explicitly supplied area measures without prescribing a stocking or design ratio. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { growBedArea, suppliedFishArea } = request;
  const compute = (): Output => {
    H.domain(growBedArea >= 0);
    H.positive(suppliedFishArea);
    return { ratio: growBedArea / suppliedFishArea };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { growBedArea: 12, suppliedFishArea: 3 },
  output: { ratio: 4 },
} satisfies ToolExample<Input, Output>;
export const growBedFishAreaRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquaponics/grow-bed-fish-area-ratio",
    title: "Grow BED Fish Area Ratio Tool",
    description:
      "Compare explicitly supplied area measures without prescribing a stocking or design ratio.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        growBedArea: { type: "number", minimum: 0 },
        suppliedFishArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["growBedArea", "suppliedFishArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { ratio: { type: "number" } },
      required: ["ratio"],
    },
    ports: {
      inputs: [
        {
          id: "growBedArea",
          label: "Grow Bed Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedFishArea",
          label: "Supplied Fish Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "ratio", label: "Ratio", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = growBedFishAreaRatioTool.execute;
export default growBedFishAreaRatioTool;
