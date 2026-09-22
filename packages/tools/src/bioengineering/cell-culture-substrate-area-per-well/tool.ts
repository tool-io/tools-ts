import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly diameter: number;
  readonly wellCount: number;
  readonly excludedAreaPerWell: number;
};
export type Output = {
  readonly areaPerWell: number;
  readonly totalArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    diameter: { type: "number", minimum: 0 },
    wellCount: { type: "integer", minimum: 0 },
    excludedAreaPerWell: { type: "number", minimum: 0 },
  },
  required: ["diameter", "wellCount", "excludedAreaPerWell"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    areaPerWell: { type: "number" },
    totalArea: { type: "number" },
  },
  required: ["areaPerWell", "totalArea"],
} as const;
/** Calculate cell culture substrate area per well from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { diameter, wellCount, excludedAreaPerWell } = request;
  const compute = (): Output => {
    H.domain(
      diameter >= 0 &&
        excludedAreaPerWell >= 0 &&
        excludedAreaPerWell <= (Math.PI * diameter ** 2) / 4,
    );
    H.integer(wellCount, 0);
    return {
      areaPerWell: (Math.PI * diameter ** 2) / 4 - excludedAreaPerWell,
      totalArea:
        ((Math.PI * diameter ** 2) / 4 - excludedAreaPerWell) * wellCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { diameter: 2, wellCount: 6, excludedAreaPerWell: 0 },
  output: { areaPerWell: 3.141592653589793, totalArea: 18.84955592153876 },
} satisfies ToolExample<Input, Output>;
export const cellCultureSubstrateAreaPerWellTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioengineering/cell-culture-substrate-area-per-well",
    title: "Cell Culture Substrate Area Per Well Tool",
    description:
      "Calculate cell culture substrate area per well from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        diameter: { type: "number", minimum: 0 },
        wellCount: { type: "integer", minimum: 0 },
        excludedAreaPerWell: { type: "number", minimum: 0 },
      },
      required: ["diameter", "wellCount", "excludedAreaPerWell"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        areaPerWell: { type: "number" },
        totalArea: { type: "number" },
      },
      required: ["areaPerWell", "totalArea"],
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
          id: "wellCount",
          label: "Well Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excludedAreaPerWell",
          label: "Excluded Area Per Well",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "areaPerWell",
          label: "Area Per Well",
          valueType: { type: "number" },
        },
        { id: "totalArea", label: "Total Area", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cellCultureSubstrateAreaPerWellTool.execute;
export default cellCultureSubstrateAreaPerWellTool;
