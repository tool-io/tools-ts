import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly temperature: number;
  readonly base: number;
  readonly hours: number;
  readonly upperCap: number;
};
export type Output = { readonly degreeHours: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    temperature: { type: "number" },
    base: { type: "number" },
    hours: { type: "number", minimum: 0 },
    upperCap: { type: "number" },
  },
  required: ["temperature", "base", "hours", "upperCap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { degreeHours: { type: "number" } },
  required: ["degreeHours"],
} as const;
/** Calculate seedbed thermal degreehour term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { temperature, base, hours, upperCap } = request;
  const compute = (): Output => {
    H.domain(hours >= 0 && upperCap >= base);
    return {
      degreeHours: Math.max(0, Math.min(temperature, upperCap) - base) * hours,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { temperature: 20, base: 10, hours: 6, upperCap: 30 },
  output: { degreeHours: 60 },
} satisfies ToolExample<Input, Output>;
export const seedbedThermalDegreehourTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrophysics/seedbed-thermal-degreehour-term",
    title: "Seedbed Thermal Degreehour Term Tool",
    description:
      "Calculate seedbed thermal degreehour term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        temperature: { type: "number" },
        base: { type: "number" },
        hours: { type: "number", minimum: 0 },
        upperCap: { type: "number" },
      },
      required: ["temperature", "base", "hours", "upperCap"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { degreeHours: { type: "number" } },
      required: ["degreeHours"],
    },
    ports: {
      inputs: [
        {
          id: "temperature",
          label: "Temperature",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "base",
          label: "Base",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "hours",
          label: "Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperCap",
          label: "Upper Cap",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "degreeHours",
          label: "Degree Hours",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = seedbedThermalDegreehourTermTool.execute;
export default seedbedThermalDegreehourTermTool;
