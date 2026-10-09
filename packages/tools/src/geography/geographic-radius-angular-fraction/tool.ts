import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly arcLength: number;
  readonly suppliedRadius: number;
};
export type Output = {
  readonly centralAngleRadians: number;
  readonly turns: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    arcLength: { type: "number" },
    suppliedRadius: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["arcLength", "suppliedRadius"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    centralAngleRadians: { type: "number" },
    turns: { type: "number" },
  },
  required: ["centralAngleRadians", "turns"],
} as const;
/** Convert explicit signed spherical arc length to central angle using a supplied compatible radius without assuming an Earth model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { arcLength, suppliedRadius } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(suppliedRadius) && suppliedRadius > 0,
      "suppliedRadius",
    ),
      suppliedRadius);
    return {
      centralAngleRadians: arcLength / suppliedRadius,
      turns: arcLength / suppliedRadius / (2 * Math.PI),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { arcLength: 10, suppliedRadius: 5 },
  output: { centralAngleRadians: 2, turns: 0.3183098861837907 },
} satisfies ToolExample<Input, Output>;
export const geographicRadiusAngularFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["geography", "earth and environmental sciences"],
      keywords: ["geography", "earth and environmental sciences"],
    },
    id: "geography/geographic-radius-angular-fraction",
    title: "Geographic Radius Angular Fraction",
    description:
      "Convert explicit signed spherical arc length to central angle using a supplied compatible radius without assuming an Earth model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        arcLength: { type: "number" },
        suppliedRadius: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["arcLength", "suppliedRadius"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        centralAngleRadians: { type: "number" },
        turns: { type: "number" },
      },
      required: ["centralAngleRadians", "turns"],
    },
    ports: {
      inputs: [
        {
          id: "arcLength",
          label: "Arc Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedRadius",
          label: "Supplied Radius",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "centralAngleRadians",
          label: "Central Angle Radians",
          valueType: { type: "number" },
        },
        { id: "turns", label: "Turns", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = geographicRadiusAngularFractionTool.execute;
export default geographicRadiusAngularFractionTool;
