import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingAreas: readonly number[];
  readonly transparency: readonly number[];
  readonly totalArea: number;
};
export type Output = {
  readonly weightedOpenArea: number;
  readonly weightedPorosity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingAreas: { type: "array", maxItems: 256, items: { type: "number" } },
    transparency: { type: "array", maxItems: 256, items: { type: "number" } },
    totalArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["openingAreas", "transparency", "totalArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weightedOpenArea: { type: "number" },
    weightedPorosity: { type: "number" },
  },
  required: ["weightedOpenArea", "weightedPorosity"],
} as const;
/** Calculate shelterbelt porosity one opening weight from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingAreas, transparency, totalArea } = request;
  const compute = (): Output => {
    H.sameLength(openingAreas, transparency);
    H.positive(totalArea);
    H.domain(
      openingAreas.every((x) => x >= 0) &&
        transparency.every((x) => x >= 0 && x <= 1) &&
        openingAreas.reduce((a, b) => a + b, 0) <= totalArea,
    );
    return {
      weightedOpenArea: H.dot(openingAreas, transparency),
      weightedPorosity: H.dot(openingAreas, transparency) / totalArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { openingAreas: [10, 20], transparency: [1, 0.5], totalArea: 100 },
  output: { weightedOpenArea: 20, weightedPorosity: 0.2 },
} satisfies ToolExample<Input, Output>;
export const shelterbeltPorosityOneOpeningWeightTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agroforestry/shelterbelt-porosity-one-opening-weight",
      title: "Shelterbelt Porosity One Opening Weight Tool",
      description:
        "Calculate shelterbelt porosity one opening weight from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          openingAreas: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          transparency: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          totalArea: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["openingAreas", "transparency", "totalArea"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          weightedOpenArea: { type: "number" },
          weightedPorosity: { type: "number" },
        },
        required: ["weightedOpenArea", "weightedPorosity"],
      },
      ports: {
        inputs: [
          {
            id: "openingAreas",
            label: "Opening Areas",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "transparency",
            label: "Transparency",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "totalArea",
            label: "Total Area",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "weightedOpenArea",
            label: "Weighted Open Area",
            valueType: { type: "number" },
          },
          {
            id: "weightedPorosity",
            label: "Weighted Porosity",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = shelterbeltPorosityOneOpeningWeightTool.execute;
export default shelterbeltPorosityOneOpeningWeightTool;
