import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly earliestEventCoordinate: number;
  readonly latestEventCoordinate: number;
  readonly birthCoordinate: number;
};
export type Output = {
  readonly youngestAge: number;
  readonly oldestAge: number;
  readonly width: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    earliestEventCoordinate: { type: "number" },
    latestEventCoordinate: { type: "number" },
    birthCoordinate: { type: "number" },
  },
  required: [
    "earliestEventCoordinate",
    "latestEventCoordinate",
    "birthCoordinate",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    youngestAge: { type: "number" },
    oldestAge: { type: "number" },
    width: { type: "number" },
  },
  required: ["youngestAge", "oldestAge", "width"],
} as const;
/** Calculate life event age interval width from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { earliestEventCoordinate, latestEventCoordinate, birthCoordinate } =
    request;
  const compute = (): Output => {
    H.domain(
      latestEventCoordinate >= earliestEventCoordinate &&
        earliestEventCoordinate >= birthCoordinate,
    );
    return {
      youngestAge: earliestEventCoordinate - birthCoordinate,
      oldestAge: latestEventCoordinate - birthCoordinate,
      width: latestEventCoordinate - earliestEventCoordinate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    earliestEventCoordinate: 1980,
    latestEventCoordinate: 1985,
    birthCoordinate: 1950,
  },
  output: { youngestAge: 30, oldestAge: 35, width: 5 },
} satisfies ToolExample<Input, Output>;
export const lifeEventAgeIntervalWidthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gerontology/life-event-age-interval-width",
    title: "Life Event Age Interval Width Tool",
    description:
      "Calculate life event age interval width from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        earliestEventCoordinate: { type: "number" },
        latestEventCoordinate: { type: "number" },
        birthCoordinate: { type: "number" },
      },
      required: [
        "earliestEventCoordinate",
        "latestEventCoordinate",
        "birthCoordinate",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        youngestAge: { type: "number" },
        oldestAge: { type: "number" },
        width: { type: "number" },
      },
      required: ["youngestAge", "oldestAge", "width"],
    },
    ports: {
      inputs: [
        {
          id: "earliestEventCoordinate",
          label: "Earliest Event Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "latestEventCoordinate",
          label: "Latest Event Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "birthCoordinate",
          label: "Birth Coordinate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "youngestAge",
          label: "Youngest Age",
          valueType: { type: "number" },
        },
        { id: "oldestAge", label: "Oldest Age", valueType: { type: "number" } },
        { id: "width", label: "Width", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = lifeEventAgeIntervalWidthTool.execute;
export default lifeEventAgeIntervalWidthTool;
