import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly gaugeId: string;
  readonly pressureText: string;
  readonly suppliedUnit: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gaugeId: { type: "string", maxLength: 8192, minLength: 1 },
    pressureText: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedUnit: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["gaugeId", "pressureText", "suppliedUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit cryostat gauge pressure transcription and unit without assuming gauge gas calibration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { gaugeId, pressureText, suppliedUnit } = request;
  const compute = (): Output => {
    H.domain(gaugeId.length > 0, "gaugeId");
    H.domain(pressureText.length > 0, "pressureText");
    H.domain(suppliedUnit.length > 0, "suppliedUnit");
    return { token: JSON.stringify([gaugeId, pressureText, suppliedUnit]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { gaugeId: "G17", pressureText: "1e-5", suppliedUnit: "mbar" },
  output: { token: '["G17","1e-5","mbar"]' },
} satisfies ToolExample<Input, Output>;
export const cryostatVacuumGaugeUnitLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["cryogenics", "physics"],
      keywords: ["cryogenics", "physics"],
    },
    id: "cryogenics/cryostat-vacuum-gauge-unit-label",
    title: "Cryostat Vacuum Gauge Unit Label",
    description:
      "Preserve an explicit cryostat gauge pressure transcription and unit without assuming gauge gas calibration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gaugeId: { type: "string", maxLength: 8192, minLength: 1 },
        pressureText: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedUnit: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["gaugeId", "pressureText", "suppliedUnit"],
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
          id: "gaugeId",
          label: "Gauge Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "pressureText",
          label: "Pressure Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedUnit",
          label: "Supplied Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = cryostatVacuumGaugeUnitLabelTool.execute;
export default cryostatVacuumGaugeUnitLabelTool;
