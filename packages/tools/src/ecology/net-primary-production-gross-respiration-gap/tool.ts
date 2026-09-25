import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossProduction: number;
  readonly autotrophicRespiration: number;
  readonly heterotrophicRespiration: number;
};
export type Output = {
  readonly npp: number;
  readonly netEcosystemProduction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossProduction: { type: "number", minimum: 0 },
    autotrophicRespiration: { type: "number", minimum: 0 },
    heterotrophicRespiration: { type: "number", minimum: 0 },
  },
  required: [
    "grossProduction",
    "autotrophicRespiration",
    "heterotrophicRespiration",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    npp: { type: "number" },
    netEcosystemProduction: { type: "number" },
  },
  required: ["npp", "netEcosystemProduction"],
} as const;
/** NPP and ecosystem production with respiration treated as nonnegative outgoing carbon flux, all on matched area/time bases. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossProduction, autotrophicRespiration, heterotrophicRespiration } =
    request;
  const compute = (): Output => {
    H.domain(
      grossProduction >= 0 &&
        autotrophicRespiration >= 0 &&
        heterotrophicRespiration >= 0,
    );
    return {
      npp: grossProduction - autotrophicRespiration,
      netEcosystemProduction:
        grossProduction - autotrophicRespiration - heterotrophicRespiration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    grossProduction: 100,
    autotrophicRespiration: 30,
    heterotrophicRespiration: 40,
  },
  output: { npp: 70, netEcosystemProduction: 30 },
} satisfies ToolExample<Input, Output>;
export const netPrimaryProductionGrossRespirationGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "ecology/net-primary-production-gross-respiration-gap",
      title: "Net Primary Production Gross Respiration Gap Tool",
      description:
        "NPP and ecosystem production with respiration treated as nonnegative outgoing carbon flux, all on matched area/time bases.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          grossProduction: { type: "number", minimum: 0 },
          autotrophicRespiration: { type: "number", minimum: 0 },
          heterotrophicRespiration: { type: "number", minimum: 0 },
        },
        required: [
          "grossProduction",
          "autotrophicRespiration",
          "heterotrophicRespiration",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          npp: { type: "number" },
          netEcosystemProduction: { type: "number" },
        },
        required: ["npp", "netEcosystemProduction"],
      },
      ports: {
        inputs: [
          {
            id: "grossProduction",
            label: "Gross Production",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "autotrophicRespiration",
            label: "Autotrophic Respiration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "heterotrophicRespiration",
            label: "Heterotrophic Respiration",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "npp", label: "Npp", valueType: { type: "number" } },
          {
            id: "netEcosystemProduction",
            label: "Net Ecosystem Production",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = netPrimaryProductionGrossRespirationGapTool.execute;
export default netPrimaryProductionGrossRespirationGapTool;
