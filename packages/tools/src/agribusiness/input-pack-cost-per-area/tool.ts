import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly packPrice: number;
  readonly areaPerPack: number;
};
export type Output = { readonly costPerArea: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    packPrice: { type: "number", minimum: 0 },
    areaPerPack: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["packPrice", "areaPerPack"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { costPerArea: { type: "number" } },
  required: ["costPerArea"],
} as const;
/** Calculate input pack cost per area from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { packPrice, areaPerPack } = request;
  const compute = (): Output => {
    H.domain(packPrice >= 0);
    H.positive(areaPerPack);
    return { costPerArea: packPrice / areaPerPack };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { packPrice: 80, areaPerPack: 4 },
  output: { costPerArea: 20 },
} satisfies ToolExample<Input, Output>;
export const inputPackCostPerAreaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agribusiness/input-pack-cost-per-area",
    title: "Input Pack Cost Per Area Tool",
    description:
      "Calculate input pack cost per area from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        packPrice: { type: "number", minimum: 0 },
        areaPerPack: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["packPrice", "areaPerPack"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { costPerArea: { type: "number" } },
      required: ["costPerArea"],
    },
    ports: {
      inputs: [
        {
          id: "packPrice",
          label: "Pack Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "areaPerPack",
          label: "Area Per Pack",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "costPerArea",
          label: "Cost Per Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = inputPackCostPerAreaTool.execute;
export default inputPackCostPerAreaTool;
