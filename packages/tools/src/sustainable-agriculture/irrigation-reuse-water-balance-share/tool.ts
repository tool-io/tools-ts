import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fresh: number;
  readonly recovered: number;
  readonly exported: number;
  readonly evaporation: number;
};
export type Output = {
  readonly netAvailable: number;
  readonly reusedShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fresh: { type: "number", minimum: 0 },
    recovered: { type: "number", minimum: 0 },
    exported: { type: "number", minimum: 0 },
    evaporation: { type: "number", minimum: 0 },
  },
  required: ["fresh", "recovered", "exported", "evaporation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netAvailable: { type: "number" },
    reusedShare: { type: "number" },
  },
  required: ["netAvailable", "reusedShare"],
} as const;
/** Calculate irrigation reuse water balance share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fresh, recovered, exported, evaporation } = request;
  const compute = (): Output => {
    H.domain(
      fresh >= 0 &&
        recovered >= 0 &&
        fresh + recovered > 0 &&
        exported >= 0 &&
        evaporation >= 0,
    );
    return {
      netAvailable: fresh + recovered - exported - evaporation,
      reusedShare: recovered / (fresh + recovered),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fresh: 100, recovered: 50, exported: 10, evaporation: 20 },
  output: { netAvailable: 120, reusedShare: 0.3333333333333333 },
} satisfies ToolExample<Input, Output>;
export const irrigationReuseWaterBalanceShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sustainable-agriculture/irrigation-reuse-water-balance-share",
    title: "Irrigation Reuse Water Balance Share Tool",
    description:
      "Calculate irrigation reuse water balance share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fresh: { type: "number", minimum: 0 },
        recovered: { type: "number", minimum: 0 },
        exported: { type: "number", minimum: 0 },
        evaporation: { type: "number", minimum: 0 },
      },
      required: ["fresh", "recovered", "exported", "evaporation"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netAvailable: { type: "number" },
        reusedShare: { type: "number" },
      },
      required: ["netAvailable", "reusedShare"],
    },
    ports: {
      inputs: [
        {
          id: "fresh",
          label: "Fresh",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recovered",
          label: "Recovered",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "exported",
          label: "Exported",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "evaporation",
          label: "Evaporation",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "netAvailable",
          label: "Net Available",
          valueType: { type: "number" },
        },
        {
          id: "reusedShare",
          label: "Reused Share",
          valueType: { type: "number", unit: "1" },
        },
      ],
    },
  },
  calculate,
});
export const run = irrigationReuseWaterBalanceShareTool.execute;
export default irrigationReuseWaterBalanceShareTool;
