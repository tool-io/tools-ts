import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coreDiameter: number;
  readonly coreLength: number;
  readonly suppliedVolume: number;
  readonly geometryFactor: number;
};
export type Output = {
  readonly modelVolume: number;
  readonly volumeGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coreDiameter: { type: "number", minimum: 0 },
    coreLength: { type: "number", minimum: 0 },
    suppliedVolume: { type: "number", minimum: 0 },
    geometryFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["coreDiameter", "coreLength", "suppliedVolume", "geometryFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    modelVolume: { type: "number" },
    volumeGap: { type: "number" },
  },
  required: ["modelVolume", "volumeGap"],
} as const;
/** Compare explicit core dimensions with a supplied geometric factor and measured volume; no instrument calibration table. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coreDiameter, coreLength, suppliedVolume, geometryFactor } = request;
  const compute = (): Output => {
    H.domain(coreDiameter >= 0 && coreLength >= 0 && suppliedVolume >= 0);
    H.positive(geometryFactor);
    return (() => {
      const modelVolume =
        geometryFactor * coreDiameter * coreDiameter * coreLength;
      return { modelVolume, volumeGap: suppliedVolume - modelVolume };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    coreDiameter: 2,
    coreLength: 3,
    suppliedVolume: 10,
    geometryFactor: 1,
  },
  output: { modelVolume: 12, volumeGap: -2 },
} satisfies ToolExample<Input, Output>;
export const soilCoreScaleGapTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "agrophysics/soil-core-scale-gap",
    title: "Soil Core Scale Gap Tool",
    description:
      "Compare explicit core dimensions with a supplied geometric factor and measured volume; no instrument calibration table.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coreDiameter: { type: "number", minimum: 0 },
        coreLength: { type: "number", minimum: 0 },
        suppliedVolume: { type: "number", minimum: 0 },
        geometryFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "coreDiameter",
        "coreLength",
        "suppliedVolume",
        "geometryFactor",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        modelVolume: { type: "number" },
        volumeGap: { type: "number" },
      },
      required: ["modelVolume", "volumeGap"],
    },
    ports: {
      inputs: [
        {
          id: "coreDiameter",
          label: "Core Diameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "coreLength",
          label: "Core Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedVolume",
          label: "Supplied Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "geometryFactor",
          label: "Geometry Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "modelVolume",
          label: "Model Volume",
          valueType: { type: "number" },
        },
        { id: "volumeGap", label: "Volume Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = soilCoreScaleGapTool.execute;
export default soilCoreScaleGapTool;
