import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ratePerHour: number;
  readonly elapsedHours: number;
};
export type Output = { readonly remainingFraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ratePerHour: { type: "number", minimum: 0 },
    elapsedHours: { type: "number", minimum: 0 },
  },
  required: ["ratePerHour", "elapsedHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { remainingFraction: { type: "number" } },
  required: ["remainingFraction"],
} as const;
/** Evaluate an explicit nonnegative first-order terminal decay rate over an explicit elapsed interval without fitting pharmacokinetic parameters. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ratePerHour, elapsedHours } = request;
  const compute = (): Output => {
    H.domain(ratePerHour >= 0 && elapsedHours >= 0, "ratePerHour");
    return { remainingFraction: Math.exp(-ratePerHour * elapsedHours) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ratePerHour: 0.5, elapsedHours: 2 },
  output: { remainingFraction: 0.36787944117144233 },
} satisfies ToolExample<Input, Output>;
export const pkTerminalDecayFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pharmacokinetics", "pharmacy"],
      keywords: ["pharmacokinetics", "pharmacy"],
    },
    id: "pharmacokinetics/pk-terminal-decay-factor",
    title: "PK Terminal Decay Factor",
    description:
      "Evaluate an explicit nonnegative first-order terminal decay rate over an explicit elapsed interval without fitting pharmacokinetic parameters.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ratePerHour: { type: "number", minimum: 0 },
        elapsedHours: { type: "number", minimum: 0 },
      },
      required: ["ratePerHour", "elapsedHours"],
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
          id: "ratePerHour",
          label: "Rate Per Hour",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "elapsedHours",
          label: "Elapsed Hours",
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
export const run = pkTerminalDecayFactorTool.execute;
export default pkTerminalDecayFactorTool;
