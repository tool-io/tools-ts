import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly wetMass: number; readonly dryMass: number };
export type Output = {
  readonly waterMass: number;
  readonly dryBasis: number;
  readonly wetBasis: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetMass: { type: "number" },
    dryMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["wetMass", "dryMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    waterMass: { type: "number" },
    dryBasis: { type: "number" },
    wetBasis: { type: "number" },
  },
  required: ["waterMass", "dryBasis", "wetBasis"],
} as const;
/** Calculate soil moisture wet dry basis pair from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wetMass, dryMass } = request;
  const compute = (): Output => {
    H.positive(dryMass);
    H.domain(wetMass >= dryMass);
    return {
      waterMass: wetMass - dryMass,
      dryBasis: (wetMass - dryMass) / dryMass,
      wetBasis: (wetMass - dryMass) / wetMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wetMass: 120, dryMass: 100 },
  output: { waterMass: 20, dryBasis: 0.2, wetBasis: 0.16666666666666666 },
} satisfies ToolExample<Input, Output>;
export const soilMoistureWetDryBasisPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-science/soil-moisture-wet-dry-basis-pair",
    title: "Soil Moisture Wet Dry Basis Pair Tool",
    description:
      "Calculate soil moisture wet dry basis pair from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wetMass: { type: "number" },
        dryMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["wetMass", "dryMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        waterMass: { type: "number" },
        dryBasis: { type: "number" },
        wetBasis: { type: "number" },
      },
      required: ["waterMass", "dryBasis", "wetBasis"],
    },
    ports: {
      inputs: [
        {
          id: "wetMass",
          label: "Wet Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dryMass",
          label: "Dry Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "waterMass", label: "Water Mass", valueType: { type: "number" } },
        { id: "dryBasis", label: "Dry Basis", valueType: { type: "number" } },
        { id: "wetBasis", label: "Wet Basis", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = soilMoistureWetDryBasisPairTool.execute;
export default soilMoistureWetDryBasisPairTool;
