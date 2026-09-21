import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coordinate: number;
  readonly oldOriginInGlobal: number;
  readonly newOriginInGlobal: number;
};
export type Output = {
  readonly relabelled: number;
  readonly globalCoordinate: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coordinate: { type: "number" },
    oldOriginInGlobal: { type: "number" },
    newOriginInGlobal: { type: "number" },
  },
  required: ["coordinate", "oldOriginInGlobal", "newOriginInGlobal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    relabelled: { type: "number" },
    globalCoordinate: { type: "number" },
  },
  required: ["relabelled", "globalCoordinate"],
} as const;
/** Translate specimen coordinates between origins sharing the same axis and length unit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coordinate, oldOriginInGlobal, newOriginInGlobal } = request;
  const compute = (): Output => {
    return {
      relabelled: coordinate + oldOriginInGlobal - newOriginInGlobal,
      globalCoordinate: coordinate + oldOriginInGlobal,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coordinate: 4, oldOriginInGlobal: 10, newOriginInGlobal: 7 },
  output: { relabelled: 7, globalCoordinate: 14 },
} satisfies ToolExample<Input, Output>;
export const specimenOriginRelabelOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anatomy/specimen-origin-relabel-offset",
    title: "Specimen Origin Relabel Offset Tool",
    description:
      "Translate specimen coordinates between origins sharing the same axis and length unit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coordinate: { type: "number" },
        oldOriginInGlobal: { type: "number" },
        newOriginInGlobal: { type: "number" },
      },
      required: ["coordinate", "oldOriginInGlobal", "newOriginInGlobal"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        relabelled: { type: "number" },
        globalCoordinate: { type: "number" },
      },
      required: ["relabelled", "globalCoordinate"],
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
          id: "oldOriginInGlobal",
          label: "Old Origin In Global",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "newOriginInGlobal",
          label: "New Origin In Global",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "relabelled",
          label: "Relabelled",
          valueType: { type: "number" },
        },
        {
          id: "globalCoordinate",
          label: "Global Coordinate",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = specimenOriginRelabelOffsetTool.execute;
export default specimenOriginRelabelOffsetTool;
