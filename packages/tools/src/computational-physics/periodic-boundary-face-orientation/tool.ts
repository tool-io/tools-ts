import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly flux: number;
  readonly sourceNormal: number;
  readonly targetNormal: number;
};
export type Output = {
  readonly mappedFlux: number;
  readonly orientationFlips: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    flux: { type: "number" },
    sourceNormal: { type: "integer" },
    targetNormal: { type: "integer" },
  },
  required: ["flux", "sourceNormal", "targetNormal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mappedFlux: { type: "number" },
    orientationFlips: { type: "boolean" },
  },
  required: ["mappedFlux", "orientationFlips"],
} as const;
/** Calculate periodic boundary face orientation from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { flux, sourceNormal, targetNormal } = request;
  const compute = (): Output => {
    H.domain([1, -1].includes(sourceNormal) && [1, -1].includes(targetNormal));
    return {
      mappedFlux: flux * sourceNormal * targetNormal,
      orientationFlips: sourceNormal !== targetNormal,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { flux: 5, sourceNormal: 1, targetNormal: -1 },
  output: { mappedFlux: -5, orientationFlips: true },
} satisfies ToolExample<Input, Output>;
export const periodicBoundaryFaceOrientationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-physics/periodic-boundary-face-orientation",
    title: "Periodic Boundary Face Orientation Tool",
    description:
      "Calculate periodic boundary face orientation from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        flux: { type: "number" },
        sourceNormal: { type: "integer" },
        targetNormal: { type: "integer" },
      },
      required: ["flux", "sourceNormal", "targetNormal"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mappedFlux: { type: "number" },
        orientationFlips: { type: "boolean" },
      },
      required: ["mappedFlux", "orientationFlips"],
    },
    ports: {
      inputs: [
        {
          id: "flux",
          label: "Flux",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceNormal",
          label: "Source Normal",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "targetNormal",
          label: "Target Normal",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "mappedFlux",
          label: "Mapped Flux",
          valueType: { type: "number" },
        },
        {
          id: "orientationFlips",
          label: "Orientation Flips",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = periodicBoundaryFaceOrientationTool.execute;
export default periodicBoundaryFaceOrientationTool;
