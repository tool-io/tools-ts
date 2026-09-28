import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstDegrees: number;
  readonly secondDegrees: number;
};
export type Output = {
  readonly shortArcDegrees: number;
  readonly longArcDegrees: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstDegrees: { type: "number", minimum: -180, maximum: 180 },
    secondDegrees: { type: "number", minimum: -180, maximum: 180 },
  },
  required: ["firstDegrees", "secondDegrees"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shortArcDegrees: { type: "number" },
    longArcDegrees: { type: "number" },
  },
  required: ["shortArcDegrees", "longArcDegrees"],
} as const;
/** Return complementary longitude arcs, with a 360-degree long arc for coincident meridians. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstDegrees, secondDegrees } = request;
  const compute = (): Output => {
    H.domain(
      firstDegrees >= -180 &&
        firstDegrees <= 180 &&
        secondDegrees >= -180 &&
        secondDegrees <= 180,
    );
    return {
      shortArcDegrees: Math.min(
        Math.abs(firstDegrees - secondDegrees),
        360 - Math.abs(firstDegrees - secondDegrees),
      ),
      longArcDegrees:
        360 -
        Math.min(
          Math.abs(firstDegrees - secondDegrees),
          360 - Math.abs(firstDegrees - secondDegrees),
        ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstDegrees: 170, secondDegrees: -170 },
  output: { shortArcDegrees: 20, longArcDegrees: 340 },
} satisfies ToolExample<Input, Output>;
export const longitudeArcComplementTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geography/longitude-arc-complement",
    title: "Longitude Arc Complement Tool",
    description:
      "Return complementary longitude arcs, with a 360-degree long arc for coincident meridians.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstDegrees: { type: "number", minimum: -180, maximum: 180 },
        secondDegrees: { type: "number", minimum: -180, maximum: 180 },
      },
      required: ["firstDegrees", "secondDegrees"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shortArcDegrees: { type: "number" },
        longArcDegrees: { type: "number" },
      },
      required: ["shortArcDegrees", "longArcDegrees"],
    },
    ports: {
      inputs: [
        {
          id: "firstDegrees",
          label: "First Degrees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondDegrees",
          label: "Second Degrees",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "shortArcDegrees",
          label: "Short Arc Degrees",
          valueType: { type: "number" },
        },
        {
          id: "longArcDegrees",
          label: "Long Arc Degrees",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = longitudeArcComplementTool.execute;
export default longitudeArcComplementTool;
