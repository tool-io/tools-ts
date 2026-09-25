import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coordinate: number;
  readonly origin: number;
  readonly suppliedAxisSign: number;
};
export type Output = { readonly relativeCoordinate: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coordinate: { type: "number" },
    origin: { type: "number" },
    suppliedAxisSign: { type: "integer" },
  },
  required: ["coordinate", "origin", "suppliedAxisSign"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { relativeCoordinate: { type: "number" } },
  required: ["relativeCoordinate"],
} as const;
/** Coordinate bookkeeping using an explicitly annotated axis origin and direction; no developmental staging. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coordinate, origin, suppliedAxisSign } = request;
  const compute = (): Output => {
    H.domain([1, -1].includes(suppliedAxisSign));
    return { relativeCoordinate: (coordinate - origin) * suppliedAxisSign };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coordinate: 10, origin: 3, suppliedAxisSign: -1 },
  output: { relativeCoordinate: -7 },
} satisfies ToolExample<Input, Output>;
export const embryoAxisOriginReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-biology/embryo-axis-origin-reference",
    title: "Embryo Axis Origin Reference Tool",
    description:
      "Coordinate bookkeeping using an explicitly annotated axis origin and direction; no developmental staging.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coordinate: { type: "number" },
        origin: { type: "number" },
        suppliedAxisSign: { type: "integer" },
      },
      required: ["coordinate", "origin", "suppliedAxisSign"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { relativeCoordinate: { type: "number" } },
      required: ["relativeCoordinate"],
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
          id: "origin",
          label: "Origin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedAxisSign",
          label: "Supplied Axis Sign",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "relativeCoordinate",
          label: "Relative Coordinate",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = embryoAxisOriginReferenceTool.execute;
export default embryoAxisOriginReferenceTool;
