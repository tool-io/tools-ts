import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly instrumentCode: string;
  readonly populationSource: string;
  readonly tariffVersion: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    instrumentCode: { type: "string", maxLength: 8192, minLength: 1 },
    populationSource: { type: "string", maxLength: 8192, minLength: 1 },
    tariffVersion: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["instrumentCode", "populationSource", "tariffVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicitly selected utility tariff reference without supplying utility weights or instrument validation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { instrumentCode, populationSource, tariffVersion } = request;
  const compute = (): Output => {
    H.domain(instrumentCode.length > 0, "instrumentCode");
    H.domain(populationSource.length > 0, "populationSource");
    H.domain(tariffVersion.length > 0, "tariffVersion");
    return {
      token: JSON.stringify([instrumentCode, populationSource, tariffVersion]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    instrumentCode: "EQ-A",
    populationSource: "Population B",
    tariffVersion: "2026",
  },
  output: { token: '["EQ-A","Population B","2026"]' },
} satisfies ToolExample<Input, Output>;
export const utilityTariffSourceKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["health-economics", "health economics", "economics"],
      keywords: ["health economics", "economics"],
    },
    id: "health-economics/utility-tariff-source-key",
    title: "Utility Tariff Source Key",
    description:
      "Qualify an explicitly selected utility tariff reference without supplying utility weights or instrument validation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        instrumentCode: { type: "string", maxLength: 8192, minLength: 1 },
        populationSource: { type: "string", maxLength: 8192, minLength: 1 },
        tariffVersion: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["instrumentCode", "populationSource", "tariffVersion"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "instrumentCode",
          label: "Instrument Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "populationSource",
          label: "Population Source",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "tariffVersion",
          label: "Tariff Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = utilityTariffSourceKeyTool.execute;
export default utilityTariffSourceKeyTool;
