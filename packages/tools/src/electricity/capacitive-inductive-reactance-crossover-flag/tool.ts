import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inductiveReactanceOhms: number;
  readonly capacitiveReactanceMagnitudeOhms: number;
};
export type Output = {
  readonly netReactanceOhms: number;
  readonly regime: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inductiveReactanceOhms: { type: "number", minimum: 0 },
    capacitiveReactanceMagnitudeOhms: { type: "number", minimum: 0 },
  },
  required: ["inductiveReactanceOhms", "capacitiveReactanceMagnitudeOhms"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netReactanceOhms: { type: "number" },
    regime: { type: "string", maxLength: 8192 },
  },
  required: ["netReactanceOhms", "regime"],
} as const;
/** Compare explicit inductive and capacitive reactance magnitudes in a series reactive balance without estimating a crossover frequency. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inductiveReactanceOhms, capacitiveReactanceMagnitudeOhms } = request;
  const compute = (): Output => {
    H.domain(
      inductiveReactanceOhms >= 0 && capacitiveReactanceMagnitudeOhms >= 0,
      "inductiveReactanceOhms",
    );
    return {
      netReactanceOhms:
        inductiveReactanceOhms - capacitiveReactanceMagnitudeOhms,
      regime:
        inductiveReactanceOhms > capacitiveReactanceMagnitudeOhms
          ? "inductive"
          : inductiveReactanceOhms < capacitiveReactanceMagnitudeOhms
            ? "capacitive"
            : "balanced",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { inductiveReactanceOhms: 12, capacitiveReactanceMagnitudeOhms: 8 },
  output: { netReactanceOhms: 4, regime: "inductive" },
} satisfies ToolExample<Input, Output>;
export const capacitiveInductiveReactanceCrossoverFlagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["electricity", "engineering"],
        keywords: ["electricity", "engineering"],
      },
      id: "electricity/capacitive-inductive-reactance-crossover-flag",
      title: "Capacitive Inductive Reactance Crossover Flag",
      description:
        "Compare explicit inductive and capacitive reactance magnitudes in a series reactive balance without estimating a crossover frequency.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          inductiveReactanceOhms: { type: "number", minimum: 0 },
          capacitiveReactanceMagnitudeOhms: { type: "number", minimum: 0 },
        },
        required: [
          "inductiveReactanceOhms",
          "capacitiveReactanceMagnitudeOhms",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          netReactanceOhms: { type: "number" },
          regime: { type: "string", maxLength: 8192 },
        },
        required: ["netReactanceOhms", "regime"],
      },
      ports: {
        inputs: [
          {
            id: "inductiveReactanceOhms",
            label: "Inductive Reactance Ohms",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "capacitiveReactanceMagnitudeOhms",
            label: "Capacitive Reactance Magnitude Ohms",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "netReactanceOhms",
            label: "Net Reactance Ohms",
            valueType: { type: "number" },
          },
          { id: "regime", label: "Regime", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = capacitiveInductiveReactanceCrossoverFlagTool.execute;
export default capacitiveInductiveReactanceCrossoverFlagTool;
