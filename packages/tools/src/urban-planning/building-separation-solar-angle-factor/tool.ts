import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly obstructionHeight: number;
  readonly protectedHeight: number;
  readonly sunAltitude: number;
};
export type Output = { readonly separation: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    obstructionHeight: { type: "number", minimum: 0 },
    protectedHeight: { type: "number", minimum: 0 },
    sunAltitude: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["obstructionHeight", "protectedHeight", "sunAltitude"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { separation: { type: "number" } },
  required: ["separation"],
} as const;
/** Planar solar section with aligned solar azimuth and level ground. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { obstructionHeight, protectedHeight, sunAltitude } = request;
  const compute = (): Output => {
    H.domain(
      obstructionHeight >= 0 &&
        protectedHeight >= 0 &&
        sunAltitude > 0 &&
        sunAltitude <= Math.PI / 2,
    );
    return {
      separation:
        Math.max(0, obstructionHeight - protectedHeight) /
        Math.tan(sunAltitude),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    obstructionHeight: 20,
    protectedHeight: 5,
    sunAltitude: 0.7853981633974483,
  },
  output: { separation: 15.000000000000002 },
} satisfies ToolExample<Input, Output>;
export const buildingSeparationSolarAngleFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-planning/building-separation-solar-angle-factor",
    title: "Building Separation Solar Angle Factor Tool",
    description:
      "Planar solar section with aligned solar azimuth and level ground.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        obstructionHeight: { type: "number", minimum: 0 },
        protectedHeight: { type: "number", minimum: 0 },
        sunAltitude: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["obstructionHeight", "protectedHeight", "sunAltitude"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { separation: { type: "number" } },
      required: ["separation"],
    },
    ports: {
      inputs: [
        {
          id: "obstructionHeight",
          label: "Obstruction Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "protectedHeight",
          label: "Protected Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sunAltitude",
          label: "Sun Altitude",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "separation",
          label: "Separation",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = buildingSeparationSolarAngleFactorTool.execute;
export default buildingSeparationSolarAngleFactorTool;
