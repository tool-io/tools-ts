import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly northComponent: number;
  readonly eastComponent: number;
};
export type Output = {
  readonly azimuthDegrees: number;
  readonly magnitude: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    northComponent: { type: "number" },
    eastComponent: { type: "number" },
  },
  required: ["northComponent", "eastComponent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    azimuthDegrees: { type: "number" },
    magnitude: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["azimuthDegrees", "magnitude", "defined"],
} as const;
/** Return a component-vector azimuth clockwise from north, identifying the undefined zero-vector direction explicitly. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { northComponent, eastComponent } = request;
  const compute = (): Output => {
    return (() => {
      const magnitude = Math.hypot(northComponent, eastComponent);
      const raw = (Math.atan2(eastComponent, northComponent) * 180) / Math.PI;
      return {
        azimuthDegrees: magnitude === 0 ? 0 : raw < 0 ? raw + 360 : raw,
        magnitude,
        defined: magnitude > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { northComponent: 0, eastComponent: 2 },
  output: { azimuthDegrees: 90, magnitude: 2, defined: true },
} satisfies ToolExample<Input, Output>;
export const polarizationComponentAzimuthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["geophysics", "physics"],
      keywords: ["geophysics", "physics"],
    },
    id: "geophysics/polarization-component-azimuth",
    title: "Polarization Component Azimuth",
    description:
      "Return a component-vector azimuth clockwise from north, identifying the undefined zero-vector direction explicitly.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        northComponent: { type: "number" },
        eastComponent: { type: "number" },
      },
      required: ["northComponent", "eastComponent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        azimuthDegrees: { type: "number" },
        magnitude: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["azimuthDegrees", "magnitude", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "northComponent",
          label: "North Component",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "eastComponent",
          label: "East Component",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "azimuthDegrees",
          label: "Azimuth Degrees",
          valueType: { type: "number" },
        },
        { id: "magnitude", label: "Magnitude", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = polarizationComponentAzimuthTool.execute;
export default polarizationComponentAzimuthTool;
