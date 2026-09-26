import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly rippleRms: number; readonly esr: number };
export type Output = { readonly power: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rippleRms: { type: "number", minimum: 0 },
    esr: { type: "number", minimum: 0 },
  },
  required: ["rippleRms", "esr"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { power: { type: "number" } },
  required: ["power"],
} as const;
/** Calculate capacitor ripple current heating term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rippleRms, esr } = request;
  const compute = (): Output => {
    H.domain(rippleRms >= 0 && esr >= 0);
    return { power: rippleRms * rippleRms * esr };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rippleRms: 2, esr: 0.05 },
  output: { power: 0.2 },
} satisfies ToolExample<Input, Output>;
export const capacitorRippleCurrentHeatingTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electricity/capacitor-ripple-current-heating-term",
    title: "Capacitor Ripple Current Heating Term Tool",
    description:
      "Calculate capacitor ripple current heating term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rippleRms: { type: "number", minimum: 0 },
        esr: { type: "number", minimum: 0 },
      },
      required: ["rippleRms", "esr"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { power: { type: "number" } },
      required: ["power"],
    },
    ports: {
      inputs: [
        {
          id: "rippleRms",
          label: "Ripple Rms",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "esr",
          label: "Esr",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "power", label: "Power", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = capacitorRippleCurrentHeatingTermTool.execute;
export default capacitorRippleCurrentHeatingTermTool;
