import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly normalIlluminance: number;
  readonly angleFromNormal: number;
};
export type Output = {
  readonly cosineFactor: number;
  readonly illuminance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalIlluminance: { type: "number", minimum: 0 },
    angleFromNormal: { type: "number", minimum: 0 },
  },
  required: ["normalIlluminance", "angleFromNormal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cosineFactor: { type: "number" },
    illuminance: { type: "number" },
  },
  required: ["cosineFactor", "illuminance"],
} as const;
/** Calculate studio light canvas incidence factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { normalIlluminance, angleFromNormal } = request;
  const compute = (): Output => {
    H.domain(
      normalIlluminance >= 0 &&
        angleFromNormal >= 0 &&
        angleFromNormal <= Math.PI / 2,
    );
    return {
      cosineFactor: Math.cos(angleFromNormal),
      illuminance: normalIlluminance * Math.cos(angleFromNormal),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { normalIlluminance: 100, angleFromNormal: 1.0471975511965976 },
  output: { cosineFactor: 0.5000000000000001, illuminance: 50.000000000000014 },
} satisfies ToolExample<Input, Output>;
export const studioLightCanvasIncidenceFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "visual-arts/studio-light-canvas-incidence-factor",
    title: "Studio Light Canvas Incidence Factor Tool",
    description:
      "Calculate studio light canvas incidence factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        normalIlluminance: { type: "number", minimum: 0 },
        angleFromNormal: { type: "number", minimum: 0 },
      },
      required: ["normalIlluminance", "angleFromNormal"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cosineFactor: { type: "number" },
        illuminance: { type: "number" },
      },
      required: ["cosineFactor", "illuminance"],
    },
    ports: {
      inputs: [
        {
          id: "normalIlluminance",
          label: "Normal Illuminance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "angleFromNormal",
          label: "Angle From Normal",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "cosineFactor",
          label: "Cosine Factor",
          valueType: { type: "number" },
        },
        {
          id: "illuminance",
          label: "Illuminance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = studioLightCanvasIncidenceFactorTool.execute;
export default studioLightCanvasIncidenceFactorTool;
