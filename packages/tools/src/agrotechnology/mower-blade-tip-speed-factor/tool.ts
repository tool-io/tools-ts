import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly radiusMeters: number; readonly rpm: number };
export type Output = { readonly tipMetersPerSecond: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radiusMeters: { type: "number", minimum: 0 },
    rpm: { type: "number", minimum: 0 },
  },
  required: ["radiusMeters", "rpm"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tipMetersPerSecond: { type: "number" } },
  required: ["tipMetersPerSecond"],
} as const;
/** Calculate mower blade tip speed factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { radiusMeters, rpm } = request;
  const compute = (): Output => {
    H.domain(radiusMeters >= 0 && rpm >= 0);
    return { tipMetersPerSecond: (2 * Math.PI * radiusMeters * rpm) / 60 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { radiusMeters: 0.25, rpm: 3000 },
  output: { tipMetersPerSecond: 78.53981633974483 },
} satisfies ToolExample<Input, Output>;
export const mowerBladeTipSpeedFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrotechnology/mower-blade-tip-speed-factor",
    title: "Mower Blade Tip Speed Factor Tool",
    description:
      "Calculate mower blade tip speed factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        radiusMeters: { type: "number", minimum: 0 },
        rpm: { type: "number", minimum: 0 },
      },
      required: ["radiusMeters", "rpm"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { tipMetersPerSecond: { type: "number" } },
      required: ["tipMetersPerSecond"],
    },
    ports: {
      inputs: [
        {
          id: "radiusMeters",
          label: "Radius Meters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rpm",
          label: "Rpm",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "tipMetersPerSecond",
          label: "Tip Meters Per Second",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = mowerBladeTipSpeedFactorTool.execute;
export default mowerBladeTipSpeedFactorTool;
