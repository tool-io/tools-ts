import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly volumes: number;
  readonly averageWidth: number;
  readonly expansionFraction: number;
  readonly shelfLength: number;
};
export type Output = {
  readonly occupiedLength: number;
  readonly plannedLength: number;
  readonly shelves: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    volumes: { type: "integer", minimum: 0 },
    averageWidth: { type: "number", minimum: 0 },
    expansionFraction: { type: "number", minimum: 0 },
    shelfLength: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["volumes", "averageWidth", "expansionFraction", "shelfLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    occupiedLength: { type: "number" },
    plannedLength: { type: "number" },
    shelves: { type: "integer" },
  },
  required: ["occupiedLength", "plannedLength", "shelves"],
} as const;
/** Calculate shelf space volume width factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { volumes, averageWidth, expansionFraction, shelfLength } = request;
  const compute = (): Output => {
    H.integer(volumes, 0);
    H.domain(averageWidth >= 0 && expansionFraction >= 0);
    H.positive(shelfLength);
    return {
      occupiedLength: volumes * averageWidth,
      plannedLength: volumes * averageWidth * (1 + expansionFraction),
      shelves: Math.ceil(
        (volumes * averageWidth * (1 + expansionFraction)) / shelfLength,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    volumes: 100,
    averageWidth: 0.03,
    expansionFraction: 0.2,
    shelfLength: 1,
  },
  output: { occupiedLength: 3, plannedLength: 3.5999999999999996, shelves: 4 },
} satisfies ToolExample<Input, Output>;
export const shelfSpaceVolumeWidthFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "library-science/shelf-space-volume-width-factor",
    title: "Shelf Space Volume Width Factor Tool",
    description:
      "Calculate shelf space volume width factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        volumes: { type: "integer", minimum: 0 },
        averageWidth: { type: "number", minimum: 0 },
        expansionFraction: { type: "number", minimum: 0 },
        shelfLength: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["volumes", "averageWidth", "expansionFraction", "shelfLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        occupiedLength: { type: "number" },
        plannedLength: { type: "number" },
        shelves: { type: "integer" },
      },
      required: ["occupiedLength", "plannedLength", "shelves"],
    },
    ports: {
      inputs: [
        {
          id: "volumes",
          label: "Volumes",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "averageWidth",
          label: "Average Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "expansionFraction",
          label: "Expansion Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "shelfLength",
          label: "Shelf Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "occupiedLength",
          label: "Occupied Length",
          valueType: { type: "number" },
        },
        {
          id: "plannedLength",
          label: "Planned Length",
          valueType: { type: "number" },
        },
        { id: "shelves", label: "Shelves", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = shelfSpaceVolumeWidthFactorTool.execute;
export default shelfSpaceVolumeWidthFactorTool;
