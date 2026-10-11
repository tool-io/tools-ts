import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly renewableEnergy: number;
  readonly totalEnergy: number;
};
export type Output = { readonly fraction: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    renewableEnergy: { type: "number", minimum: 0 },
    totalEnergy: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["renewableEnergy", "totalEnergy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, remainder: { type: "number" } },
  required: ["fraction", "remainder"],
} as const;
/** Normalize explicitly recorded renewable farm energy to total energy on the same unit basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { renewableEnergy, totalEnergy } = request;
  const compute = (): Output => {
    (H.domain(totalEnergy > 0, "totalEnergy"), totalEnergy);
    H.domain(
      renewableEnergy >= 0 && renewableEnergy <= totalEnergy,
      "renewableEnergy",
    );
    return {
      fraction: renewableEnergy / totalEnergy,
      remainder: totalEnergy - renewableEnergy,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { renewableEnergy: 30, totalEnergy: 120 },
  output: { fraction: 0.25, remainder: 90 },
} satisfies ToolExample<Input, Output>;
export const farmEnergyRenewableShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "sustainable-agriculture",
        "sustainable agriculture",
        "agriculture",
      ],
      keywords: ["sustainable agriculture", "agriculture"],
    },
    id: "sustainable-agriculture/farm-energy-renewable-share",
    title: "Farm Energy Renewable Share",
    description:
      "Normalize explicitly recorded renewable farm energy to total energy on the same unit basis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        renewableEnergy: { type: "number", minimum: 0 },
        totalEnergy: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["renewableEnergy", "totalEnergy"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        remainder: { type: "number" },
      },
      required: ["fraction", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "renewableEnergy",
          label: "Renewable Energy",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalEnergy",
          label: "Total Energy",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        { id: "remainder", label: "Remainder", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = farmEnergyRenewableShareTool.execute;
export default farmEnergyRenewableShareTool;
