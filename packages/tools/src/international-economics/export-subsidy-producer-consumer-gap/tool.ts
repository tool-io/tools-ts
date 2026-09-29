import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly worldPrice: number;
  readonly subsidyPerUnit: number;
  readonly production: number;
  readonly domesticConsumption: number;
};
export type Output = {
  readonly producerPrice: number;
  readonly exports: number;
  readonly fiscalCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    worldPrice: { type: "number" },
    subsidyPerUnit: { type: "number", minimum: 0 },
    production: { type: "number" },
    domesticConsumption: { type: "number", minimum: 0 },
  },
  required: [
    "worldPrice",
    "subsidyPerUnit",
    "production",
    "domesticConsumption",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    producerPrice: { type: "number" },
    exports: { type: "number" },
    fiscalCost: { type: "number" },
  },
  required: ["producerPrice", "exports", "fiscalCost"],
} as const;
/** Small-country unit export-subsidy accounting at supplied quantities, not endogenous supply/demand or welfare estimation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { worldPrice, subsidyPerUnit, production, domesticConsumption } =
    request;
  const compute = (): Output => {
    H.domain(
      subsidyPerUnit >= 0 &&
        domesticConsumption >= 0 &&
        production >= domesticConsumption,
    );
    return {
      producerPrice: worldPrice + subsidyPerUnit,
      exports: production - domesticConsumption,
      fiscalCost: (production - domesticConsumption) * subsidyPerUnit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    worldPrice: 100,
    subsidyPerUnit: 10,
    production: 1000,
    domesticConsumption: 600,
  },
  output: { producerPrice: 110, exports: 400, fiscalCost: 4000 },
} satisfies ToolExample<Input, Output>;
export const exportSubsidyProducerConsumerGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-economics/export-subsidy-producer-consumer-gap",
    title: "Export Subsidy Producer Consumer Gap Tool",
    description:
      "Small-country unit export-subsidy accounting at supplied quantities, not endogenous supply/demand or welfare estimation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        worldPrice: { type: "number" },
        subsidyPerUnit: { type: "number", minimum: 0 },
        production: { type: "number" },
        domesticConsumption: { type: "number", minimum: 0 },
      },
      required: [
        "worldPrice",
        "subsidyPerUnit",
        "production",
        "domesticConsumption",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        producerPrice: { type: "number" },
        exports: { type: "number" },
        fiscalCost: { type: "number" },
      },
      required: ["producerPrice", "exports", "fiscalCost"],
    },
    ports: {
      inputs: [
        {
          id: "worldPrice",
          label: "World Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "subsidyPerUnit",
          label: "Subsidy Per Unit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "production",
          label: "Production",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "domesticConsumption",
          label: "Domestic Consumption",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "producerPrice",
          label: "Producer Price",
          valueType: { type: "number" },
        },
        { id: "exports", label: "Exports", valueType: { type: "number" } },
        {
          id: "fiscalCost",
          label: "Fiscal Cost",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = exportSubsidyProducerConsumerGapTool.execute;
export default exportSubsidyProducerConsumerGapTool;
