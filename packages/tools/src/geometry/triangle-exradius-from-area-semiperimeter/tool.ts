import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly area: number;
  readonly semiperimeter: number;
  readonly oppositeSide: number;
};
export type Output = { readonly exradius: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    area: { type: "number", exclusiveMinimum: 0 },
    semiperimeter: { type: "number" },
    oppositeSide: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["area", "semiperimeter", "oppositeSide"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { exradius: { type: "number" } },
  required: ["exradius"],
} as const;
/** Calculate triangle exradius from area semiperimeter from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { area, semiperimeter, oppositeSide } = input;
  const compute = (): Output => {
    H.positive(area);
    H.positive(oppositeSide);
    H.domain(semiperimeter > oppositeSide);
    return { exradius: area / (semiperimeter - oppositeSide) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { area: 6, semiperimeter: 6, oppositeSide: 3 },
  output: { exradius: 2 },
} satisfies ToolExample<Input, Output>;
export const triangleExradiusFromAreaSemiperimeterTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geometry/triangle-exradius-from-area-semiperimeter",
      title: "Triangle Exradius From Area Semiperimeter Tool",
      description:
        "Calculate triangle exradius from area semiperimeter from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          area: { type: "number", exclusiveMinimum: 0 },
          semiperimeter: { type: "number" },
          oppositeSide: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["area", "semiperimeter", "oppositeSide"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { exradius: { type: "number" } },
        required: ["exradius"],
      },
      ports: {
        inputs: [
          {
            id: "area",
            label: "Area",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "semiperimeter",
            label: "Semiperimeter",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "oppositeSide",
            label: "Opposite Side",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "exradius", label: "Exradius", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = triangleExradiusFromAreaSemiperimeterTool.execute;
export default triangleExradiusFromAreaSemiperimeterTool;
