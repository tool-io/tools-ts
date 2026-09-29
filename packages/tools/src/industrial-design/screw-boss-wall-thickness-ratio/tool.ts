import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly outerDiameter: number;
  readonly innerDiameter: number;
  readonly nominalWall: number;
};
export type Output = {
  readonly radialThickness: number;
  readonly ratio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outerDiameter: { type: "number" },
    innerDiameter: { type: "number", minimum: 0 },
    nominalWall: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["outerDiameter", "innerDiameter", "nominalWall"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radialThickness: { type: "number" },
    ratio: { type: "number" },
  },
  required: ["radialThickness", "ratio"],
} as const;
/** Calculate screw boss wall thickness ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outerDiameter, innerDiameter, nominalWall } = request;
  const compute = (): Output => {
    H.domain(innerDiameter >= 0 && outerDiameter >= innerDiameter);
    H.positive(nominalWall);
    return {
      radialThickness: (outerDiameter - innerDiameter) / 2,
      ratio: (outerDiameter - innerDiameter) / (2 * nominalWall),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { outerDiameter: 10, innerDiameter: 6, nominalWall: 2 },
  output: { radialThickness: 2, ratio: 1 },
} satisfies ToolExample<Input, Output>;
export const screwBossWallThicknessRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-design/screw-boss-wall-thickness-ratio",
    title: "Screw Boss Wall Thickness Ratio Tool",
    description:
      "Calculate screw boss wall thickness ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outerDiameter: { type: "number" },
        innerDiameter: { type: "number", minimum: 0 },
        nominalWall: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["outerDiameter", "innerDiameter", "nominalWall"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        radialThickness: { type: "number" },
        ratio: { type: "number" },
      },
      required: ["radialThickness", "ratio"],
    },
    ports: {
      inputs: [
        {
          id: "outerDiameter",
          label: "Outer Diameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "innerDiameter",
          label: "Inner Diameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nominalWall",
          label: "Nominal Wall",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "radialThickness",
          label: "Radial Thickness",
          valueType: { type: "number" },
        },
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = screwBossWallThicknessRatioTool.execute;
export default screwBossWallThicknessRatioTool;
