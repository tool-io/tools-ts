import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rainfallMm: number;
  readonly runoffMm: number;
  readonly evapotranspirationMm: number;
  readonly storageChangeMm: number;
};
export type Output = {
  readonly balanceResidualMm: number;
  readonly runoffFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rainfallMm: { type: "number", exclusiveMinimum: 0 },
    runoffMm: { type: "number", minimum: 0 },
    evapotranspirationMm: { type: "number", minimum: 0 },
    storageChangeMm: { type: "number" },
  },
  required: [
    "rainfallMm",
    "runoffMm",
    "evapotranspirationMm",
    "storageChangeMm",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    balanceResidualMm: { type: "number" },
    runoffFraction: { type: "number" },
  },
  required: ["balanceResidualMm", "runoffFraction"],
} as const;
/** Simple precipitation-runoff-ET-storage residual; omitted groundwater exchange appears in the residual. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rainfallMm, runoffMm, evapotranspirationMm, storageChangeMm } =
    request;
  const compute = (): Output => {
    H.positive(rainfallMm);
    H.domain(runoffMm >= 0 && evapotranspirationMm >= 0);
    return {
      balanceResidualMm:
        rainfallMm - runoffMm - evapotranspirationMm - storageChangeMm,
      runoffFraction: runoffMm / rainfallMm,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    rainfallMm: 100,
    runoffMm: 30,
    evapotranspirationMm: 50,
    storageChangeMm: 10,
  },
  output: { balanceResidualMm: 10, runoffFraction: 0.3 },
} satisfies ToolExample<Input, Output>;
export const catchmentRainfallRunoffDepthResidualTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "hydrology/catchment-rainfall-runoff-depth-residual",
      title: "Catchment Rainfall Runoff Depth Residual Tool",
      description:
        "Simple precipitation-runoff-ET-storage residual; omitted groundwater exchange appears in the residual.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          rainfallMm: { type: "number", exclusiveMinimum: 0 },
          runoffMm: { type: "number", minimum: 0 },
          evapotranspirationMm: { type: "number", minimum: 0 },
          storageChangeMm: { type: "number" },
        },
        required: [
          "rainfallMm",
          "runoffMm",
          "evapotranspirationMm",
          "storageChangeMm",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          balanceResidualMm: { type: "number" },
          runoffFraction: { type: "number" },
        },
        required: ["balanceResidualMm", "runoffFraction"],
      },
      ports: {
        inputs: [
          {
            id: "rainfallMm",
            label: "Rainfall Mm",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "runoffMm",
            label: "Runoff Mm",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "evapotranspirationMm",
            label: "Evapotranspiration Mm",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "storageChangeMm",
            label: "Storage Change Mm",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "balanceResidualMm",
            label: "Balance Residual Mm",
            valueType: { type: "number" },
          },
          {
            id: "runoffFraction",
            label: "Runoff Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = catchmentRainfallRunoffDepthResidualTool.execute;
export default catchmentRainfallRunoffDepthResidualTool;
