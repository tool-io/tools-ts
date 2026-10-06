import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly elapsedTime: number;
  readonly residenceTime: number;
};
export type Output = { readonly remainingFraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsedTime: { type: "number", minimum: 0 },
    residenceTime: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["elapsedTime", "residenceTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { remainingFraction: { type: "number" } },
  required: ["remainingFraction"],
} as const;
/** Calculate a first-order tracer remaining fraction from explicit elapsed time and positive e-folding residence time in matching units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { elapsedTime, residenceTime } = request;
  const compute = (): Output => {
    H.domain(elapsedTime >= 0, "elapsedTime");
    (H.domain(
      Number.isFinite(residenceTime) && residenceTime > 0,
      "residenceTime",
    ),
      residenceTime);
    return { remainingFraction: Math.exp(-elapsedTime / residenceTime) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { elapsedTime: 10, residenceTime: 10 },
  output: { remainingFraction: 0.36787944117144233 },
} satisfies ToolExample<Input, Output>;
export const tracegasResidenceDecayfactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["atmospheric-chemistry", "atmospheric chemistry", "chemistry"],
      keywords: ["atmospheric chemistry", "chemistry"],
    },
    id: "atmospheric-chemistry/trace-gas-residence-decay-factor",
    title: "Trace Gas Residence Decay Factor",
    description:
      "Calculate a first-order tracer remaining fraction from explicit elapsed time and positive e-folding residence time in matching units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsedTime: { type: "number", minimum: 0 },
        residenceTime: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["elapsedTime", "residenceTime"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { remainingFraction: { type: "number" } },
      required: ["remainingFraction"],
    },
    ports: {
      inputs: [
        {
          id: "elapsedTime",
          label: "Elapsed Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "residenceTime",
          label: "Residence Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "remainingFraction",
          label: "Remaining Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = tracegasResidenceDecayfactorTool.execute;
export default tracegasResidenceDecayfactorTool;
