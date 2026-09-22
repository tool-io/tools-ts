import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly geometricVolume: number;
  readonly excludedVolume: number;
  readonly measuredWorkingVolume: number;
};
export type Output = {
  readonly expectedWorkingVolume: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    geometricVolume: { type: "number", minimum: 0 },
    excludedVolume: { type: "number", minimum: 0 },
    measuredWorkingVolume: { type: "number", minimum: 0 },
  },
  required: ["geometricVolume", "excludedVolume", "measuredWorkingVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedWorkingVolume: { type: "number" },
    residual: { type: "number" },
  },
  required: ["expectedWorkingVolume", "residual"],
} as const;
/** Calculate tank working volume gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { geometricVolume, excludedVolume, measuredWorkingVolume } = request;
  const compute = (): Output => {
    H.domain(
      geometricVolume >= 0 &&
        excludedVolume >= 0 &&
        excludedVolume <= geometricVolume &&
        measuredWorkingVolume >= 0,
    );
    return {
      expectedWorkingVolume: geometricVolume - excludedVolume,
      residual: measuredWorkingVolume - geometricVolume + excludedVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    geometricVolume: 100,
    excludedVolume: 20,
    measuredWorkingVolume: 75,
  },
  output: { expectedWorkingVolume: 80, residual: -5 },
} satisfies ToolExample<Input, Output>;
export const tankWorkingVolumeGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquaculture/tank-working-volume-gap",
    title: "Tank Working Volume Gap Tool",
    description:
      "Calculate tank working volume gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        geometricVolume: { type: "number", minimum: 0 },
        excludedVolume: { type: "number", minimum: 0 },
        measuredWorkingVolume: { type: "number", minimum: 0 },
      },
      required: ["geometricVolume", "excludedVolume", "measuredWorkingVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedWorkingVolume: { type: "number" },
        residual: { type: "number" },
      },
      required: ["expectedWorkingVolume", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "geometricVolume",
          label: "Geometric Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedVolume",
          label: "Excluded Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredWorkingVolume",
          label: "Measured Working Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "expectedWorkingVolume",
          label: "Expected Working Volume",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = tankWorkingVolumeGapTool.execute;
export default tankWorkingVolumeGapTool;
