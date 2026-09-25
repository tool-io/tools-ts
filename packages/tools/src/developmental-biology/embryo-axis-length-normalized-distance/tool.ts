import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coordinate: number;
  readonly anterior: number;
  readonly posterior: number;
};
export type Output = {
  readonly fraction: number;
  readonly distanceFromAnterior: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coordinate: { type: "number" },
    anterior: { type: "number" },
    posterior: { type: "number" },
  },
  required: ["coordinate", "anterior", "posterior"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fraction: { type: "number" },
    distanceFromAnterior: { type: "number" },
  },
  required: ["fraction", "distanceFromAnterior"],
} as const;
/** Signed coordinate along an explicitly oriented axis; values outside the anchor segment remain visible. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coordinate, anterior, posterior } = request;
  const compute = (): Output => {
    H.domain(posterior > anterior);
    return {
      fraction: (coordinate - anterior) / (posterior - anterior),
      distanceFromAnterior: coordinate - anterior,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coordinate: 3, anterior: 1, posterior: 9 },
  output: { fraction: 0.25, distanceFromAnterior: 2 },
} satisfies ToolExample<Input, Output>;
export const embryoAxisLengthNormalizedDistanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-biology/embryo-axis-length-normalized-distance",
    title: "Embryo Axis Length Normalized Distance Tool",
    description:
      "Signed coordinate along an explicitly oriented axis; values outside the anchor segment remain visible.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coordinate: { type: "number" },
        anterior: { type: "number" },
        posterior: { type: "number" },
      },
      required: ["coordinate", "anterior", "posterior"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        distanceFromAnterior: { type: "number" },
      },
      required: ["fraction", "distanceFromAnterior"],
    },
    ports: {
      inputs: [
        {
          id: "coordinate",
          label: "Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "anterior",
          label: "Anterior",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "posterior",
          label: "Posterior",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        {
          id: "distanceFromAnterior",
          label: "Distance From Anterior",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = embryoAxisLengthNormalizedDistanceTool.execute;
export default embryoAxisLengthNormalizedDistanceTool;
