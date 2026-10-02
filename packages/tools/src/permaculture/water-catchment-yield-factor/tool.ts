import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rainDepth: number;
  readonly catchmentArea: number;
  readonly suppliedRunoffFraction: number;
  readonly suppliedVolumeScale: number;
};
export type Output = { readonly capturedVolume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rainDepth: { type: "number", minimum: 0 },
    catchmentArea: { type: "number", minimum: 0 },
    suppliedRunoffFraction: { type: "number", minimum: 0, maximum: 1 },
    suppliedVolumeScale: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "rainDepth",
    "catchmentArea",
    "suppliedRunoffFraction",
    "suppliedVolumeScale",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { capturedVolume: { type: "number" } },
  required: ["capturedVolume"],
} as const;
/** Ideal supplied rainfall-area capture equivalent with an explicit runoff fraction and compatible volume conversion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    rainDepth,
    catchmentArea,
    suppliedRunoffFraction,
    suppliedVolumeScale,
  } = request;
  const compute = (): Output => {
    H.domain(rainDepth >= 0 && catchmentArea >= 0);
    H.probability(suppliedRunoffFraction);
    H.positive(suppliedVolumeScale);
    return {
      capturedVolume:
        rainDepth *
        catchmentArea *
        suppliedRunoffFraction *
        suppliedVolumeScale,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    rainDepth: 10,
    catchmentArea: 100,
    suppliedRunoffFraction: 0.5,
    suppliedVolumeScale: 0.001,
  },
  output: { capturedVolume: 0.5 },
} satisfies ToolExample<Input, Output>;
export const waterCatchmentYieldFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "permaculture/water-catchment-yield-factor",
    title: "Water Catchment Yield Factor Tool",
    description:
      "Ideal supplied rainfall-area capture equivalent with an explicit runoff fraction and compatible volume conversion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rainDepth: { type: "number", minimum: 0 },
        catchmentArea: { type: "number", minimum: 0 },
        suppliedRunoffFraction: { type: "number", minimum: 0, maximum: 1 },
        suppliedVolumeScale: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "rainDepth",
        "catchmentArea",
        "suppliedRunoffFraction",
        "suppliedVolumeScale",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { capturedVolume: { type: "number" } },
      required: ["capturedVolume"],
    },
    ports: {
      inputs: [
        {
          id: "rainDepth",
          label: "Rain Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "catchmentArea",
          label: "Catchment Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedRunoffFraction",
          label: "Supplied Runoff Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedVolumeScale",
          label: "Supplied Volume Scale",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "capturedVolume",
          label: "Captured Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = waterCatchmentYieldFactorTool.execute;
export default waterCatchmentYieldFactorTool;
