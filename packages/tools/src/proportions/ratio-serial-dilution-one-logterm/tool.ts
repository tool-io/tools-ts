import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly retainedFraction: number };
export type Output = {
  readonly logRetention: number;
  readonly decimalDilution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retainedFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: ["retainedFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    logRetention: { type: "number" },
    decimalDilution: { type: "number" },
  },
  required: ["logRetention", "decimalDilution"],
} as const;
/** Calculate ratio serial dilution one logterm from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { retainedFraction } = request;
  const compute = (): Output => {
    H.domain(retainedFraction > 0 && retainedFraction <= 1);
    return {
      logRetention: Math.log(retainedFraction),
      decimalDilution: -Math.log10(retainedFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { retainedFraction: 0.01 },
  output: { logRetention: -4.605170185988091, decimalDilution: 2 },
} satisfies ToolExample<Input, Output>;
export const ratioSerialDilutionOneLogtermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "proportions/ratio-serial-dilution-one-logterm",
    title: "Ratio Serial Dilution One Logterm Tool",
    description:
      "Calculate ratio serial dilution one logterm from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        retainedFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
      },
      required: ["retainedFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        logRetention: { type: "number" },
        decimalDilution: { type: "number" },
      },
      required: ["logRetention", "decimalDilution"],
    },
    ports: {
      inputs: [
        {
          id: "retainedFraction",
          label: "Retained Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "logRetention",
          label: "Log Retention",
          valueType: { type: "number" },
        },
        {
          id: "decimalDilution",
          label: "Decimal Dilution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = ratioSerialDilutionOneLogtermTool.execute;
export default ratioSerialDilutionOneLogtermTool;
