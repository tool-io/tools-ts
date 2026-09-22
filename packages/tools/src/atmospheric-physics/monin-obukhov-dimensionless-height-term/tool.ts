import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly height: number;
  readonly displacement: number;
  readonly obukhovLength: number;
};
export type Output = {
  readonly effectiveHeight: number;
  readonly zeta: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    height: { type: "number" },
    displacement: { type: "number", minimum: 0 },
    obukhovLength: { type: "number" },
  },
  required: ["height", "displacement", "obukhovLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { effectiveHeight: { type: "number" }, zeta: { type: "number" } },
  required: ["effectiveHeight", "zeta"],
} as const;
/** Calculate monin obukhov dimensionless height term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { height, displacement, obukhovLength } = request;
  const compute = (): Output => {
    H.domain(
      height >= displacement && displacement >= 0 && obukhovLength !== 0,
    );
    return {
      effectiveHeight: height - displacement,
      zeta: (height - displacement) / obukhovLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { height: 10, displacement: 2, obukhovLength: -40 },
  output: { effectiveHeight: 8, zeta: -0.2 },
} satisfies ToolExample<Input, Output>;
export const moninObukhovDimensionlessHeightTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "atmospheric-physics/monin-obukhov-dimensionless-height-term",
      title: "Monin Obukhov Dimensionless Height Term Tool",
      description:
        "Calculate monin obukhov dimensionless height term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          height: { type: "number" },
          displacement: { type: "number", minimum: 0 },
          obukhovLength: { type: "number" },
        },
        required: ["height", "displacement", "obukhovLength"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          effectiveHeight: { type: "number" },
          zeta: { type: "number" },
        },
        required: ["effectiveHeight", "zeta"],
      },
      ports: {
        inputs: [
          {
            id: "height",
            label: "Height",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "displacement",
            label: "Displacement",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "obukhovLength",
            label: "Obukhov Length",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "effectiveHeight",
            label: "Effective Height",
            valueType: { type: "number" },
          },
          { id: "zeta", label: "Zeta", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = moninObukhovDimensionlessHeightTermTool.execute;
export default moninObukhovDimensionlessHeightTermTool;
