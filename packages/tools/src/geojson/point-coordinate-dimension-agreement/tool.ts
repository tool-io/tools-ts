import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: readonly number[];
  readonly second: readonly number[];
};
export type Output = {
  readonly sameDimension: boolean;
  readonly firstDimension: number;
  readonly secondDimension: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "array", maxItems: 256, items: { type: "number" } },
    second: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["first", "second"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sameDimension: { type: "boolean" },
    firstDimension: { type: "integer" },
    secondDimension: { type: "integer" },
  },
  required: ["sameDimension", "firstDimension", "secondDimension"],
} as const;
/** Calculate point coordinate dimension agreement from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { first, second } = input;
  const compute = (): Output => {
    H.domain(first.length >= 2 && second.length >= 2);
    return {
      sameDimension: first.length === second.length,
      firstDimension: first.length,
      secondDimension: second.length,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { first: [1, 2], second: [1, 2, 3] },
  output: { sameDimension: false, firstDimension: 2, secondDimension: 3 },
} satisfies ToolExample<Input, Output>;
export const pointCoordinateDimensionAgreementTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geojson/point-coordinate-dimension-agreement",
    title: "Point Coordinate Dimension Agreement Tool",
    description:
      "Calculate point coordinate dimension agreement from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "array", maxItems: 256, items: { type: "number" } },
        second: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["first", "second"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sameDimension: { type: "boolean" },
        firstDimension: { type: "integer" },
        secondDimension: { type: "integer" },
      },
      required: ["sameDimension", "firstDimension", "secondDimension"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "sameDimension",
          label: "Same Dimension",
          valueType: { type: "boolean" },
        },
        {
          id: "firstDimension",
          label: "First Dimension",
          valueType: { type: "integer" },
        },
        {
          id: "secondDimension",
          label: "Second Dimension",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = pointCoordinateDimensionAgreementTool.execute;
export default pointCoordinateDimensionAgreementTool;
