import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recycledNutrient: number;
  readonly importedNutrient: number;
  readonly otherNutrient: number;
};
export type Output = {
  readonly total: number;
  readonly recycledFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recycledNutrient: { type: "number", minimum: 0 },
    importedNutrient: { type: "number", minimum: 0 },
    otherNutrient: { type: "number", minimum: 0 },
  },
  required: ["recycledNutrient", "importedNutrient", "otherNutrient"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    total: { type: "number" },
    recycledFraction: { type: "number" },
  },
  required: ["total", "recycledFraction"],
} as const;
/** Calculate farm nutrient recycled input share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recycledNutrient, importedNutrient, otherNutrient } = request;
  const compute = (): Output => {
    H.domain(
      recycledNutrient >= 0 &&
        importedNutrient >= 0 &&
        otherNutrient >= 0 &&
        recycledNutrient + importedNutrient + otherNutrient > 0,
    );
    return {
      total: recycledNutrient + importedNutrient + otherNutrient,
      recycledFraction:
        recycledNutrient /
        (recycledNutrient + importedNutrient + otherNutrient),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recycledNutrient: 30, importedNutrient: 50, otherNutrient: 20 },
  output: { total: 100, recycledFraction: 0.3 },
} satisfies ToolExample<Input, Output>;
export const farmNutrientRecycledInputShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroecology/farm-nutrient-recycled-input-share",
    title: "Farm Nutrient Recycled Input Share Tool",
    description:
      "Calculate farm nutrient recycled input share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recycledNutrient: { type: "number", minimum: 0 },
        importedNutrient: { type: "number", minimum: 0 },
        otherNutrient: { type: "number", minimum: 0 },
      },
      required: ["recycledNutrient", "importedNutrient", "otherNutrient"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        total: { type: "number" },
        recycledFraction: { type: "number" },
      },
      required: ["total", "recycledFraction"],
    },
    ports: {
      inputs: [
        {
          id: "recycledNutrient",
          label: "Recycled Nutrient",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "importedNutrient",
          label: "Imported Nutrient",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "otherNutrient",
          label: "Other Nutrient",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "total", label: "Total", valueType: { type: "number" } },
        {
          id: "recycledFraction",
          label: "Recycled Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = farmNutrientRecycledInputShareTool.execute;
export default farmNutrientRecycledInputShareTool;
