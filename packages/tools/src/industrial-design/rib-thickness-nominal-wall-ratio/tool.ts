import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ribThickness: number;
  readonly wallThickness: number;
};
export type Output = { readonly ratio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ribThickness: { type: "number", minimum: 0 },
    wallThickness: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["ribThickness", "wallThickness"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ratio: { type: "number" } },
  required: ["ratio"],
} as const;
/** Calculate rib thickness nominal wall ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ribThickness, wallThickness } = request;
  const compute = (): Output => {
    H.domain(ribThickness >= 0);
    H.positive(wallThickness);
    return { ratio: ribThickness / wallThickness };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ribThickness: 1.2, wallThickness: 2 },
  output: { ratio: 0.6 },
} satisfies ToolExample<Input, Output>;
export const ribThicknessNominalWallRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-design/rib-thickness-nominal-wall-ratio",
    title: "Rib Thickness Nominal Wall Ratio Tool",
    description:
      "Calculate rib thickness nominal wall ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ribThickness: { type: "number", minimum: 0 },
        wallThickness: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["ribThickness", "wallThickness"],
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
          id: "ribThickness",
          label: "Rib Thickness",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wallThickness",
          label: "Wall Thickness",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "ratio", label: "Ratio", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = ribThicknessNominalWallRatioTool.execute;
export default ribThicknessNominalWallRatioTool;
