import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bilateralExports: number;
  readonly homeExports: number;
  readonly partnerImports: number;
  readonly worldImports: number;
};
export type Output = {
  readonly partnerExportShare: number;
  readonly partnerImportShare: number;
  readonly intensity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bilateralExports: { type: "number", minimum: 0 },
    homeExports: { type: "number", exclusiveMinimum: 0 },
    partnerImports: { type: "number", exclusiveMinimum: 0 },
    worldImports: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "bilateralExports",
    "homeExports",
    "partnerImports",
    "worldImports",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    partnerExportShare: { type: "number" },
    partnerImportShare: { type: "number" },
    intensity: { type: "number" },
  },
  required: ["partnerExportShare", "partnerImportShare", "intensity"],
} as const;
/** Calculate trade intensity one partner share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bilateralExports, homeExports, partnerImports, worldImports } =
    request;
  const compute = (): Output => {
    H.positive(homeExports);
    H.positive(partnerImports);
    H.positive(worldImports);
    H.domain(
      bilateralExports >= 0 &&
        bilateralExports <= homeExports &&
        partnerImports <= worldImports,
    );
    return {
      partnerExportShare: bilateralExports / homeExports,
      partnerImportShare: partnerImports / worldImports,
      intensity:
        (bilateralExports * worldImports) / (homeExports * partnerImports),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    bilateralExports: 40,
    homeExports: 200,
    partnerImports: 100,
    worldImports: 1000,
  },
  output: { partnerExportShare: 0.2, partnerImportShare: 0.1, intensity: 2 },
} satisfies ToolExample<Input, Output>;
export const tradeIntensityOnePartnerShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-economics/trade-intensity-one-partner-share",
    title: "Trade Intensity One Partner Share Tool",
    description:
      "Calculate trade intensity one partner share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bilateralExports: { type: "number", minimum: 0 },
        homeExports: { type: "number", exclusiveMinimum: 0 },
        partnerImports: { type: "number", exclusiveMinimum: 0 },
        worldImports: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "bilateralExports",
        "homeExports",
        "partnerImports",
        "worldImports",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        partnerExportShare: { type: "number" },
        partnerImportShare: { type: "number" },
        intensity: { type: "number" },
      },
      required: ["partnerExportShare", "partnerImportShare", "intensity"],
    },
    ports: {
      inputs: [
        {
          id: "bilateralExports",
          label: "Bilateral Exports",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "homeExports",
          label: "Home Exports",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "partnerImports",
          label: "Partner Imports",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "worldImports",
          label: "World Imports",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "partnerExportShare",
          label: "Partner Export Share",
          valueType: { type: "number" },
        },
        {
          id: "partnerImportShare",
          label: "Partner Import Share",
          valueType: { type: "number" },
        },
        { id: "intensity", label: "Intensity", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = tradeIntensityOnePartnerShareTool.execute;
export default tradeIntensityOnePartnerShareTool;
