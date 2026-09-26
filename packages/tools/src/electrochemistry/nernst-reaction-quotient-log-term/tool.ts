import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly temperatureK: number;
  readonly electronCount: number;
  readonly reactionQuotient: number;
  readonly gasConstant: number;
  readonly faradayConstant: number;
};
export type Output = { readonly potentialCorrection: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    temperatureK: { type: "number", exclusiveMinimum: 0 },
    electronCount: { type: "integer", minimum: 1 },
    reactionQuotient: { type: "number", exclusiveMinimum: 0 },
    gasConstant: { type: "number", exclusiveMinimum: 0 },
    faradayConstant: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "temperatureK",
    "electronCount",
    "reactionQuotient",
    "gasConstant",
    "faradayConstant",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { potentialCorrection: { type: "number" } },
  required: ["potentialCorrection"],
} as const;
/** Nernst correction E-E0 = -RT ln(Q)/(nF), dimensionless activity quotient and caller-supplied constants. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    temperatureK,
    electronCount,
    reactionQuotient,
    gasConstant,
    faradayConstant,
  } = request;
  const compute = (): Output => {
    H.positive(temperatureK);
    H.integer(electronCount, 1);
    H.positive(reactionQuotient);
    H.positive(gasConstant);
    H.positive(faradayConstant);
    return {
      potentialCorrection:
        (-gasConstant * temperatureK * Math.log(reactionQuotient)) /
        (electronCount * faradayConstant),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    temperatureK: 298.15,
    electronCount: 2,
    reactionQuotient: 10,
    gasConstant: 8.31446261815324,
    faradayConstant: 96485.33212331001,
  },
  output: { potentialCorrection: -0.029579674842391164 },
} satisfies ToolExample<Input, Output>;
export const nernstReactionQuotientLogTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electrochemistry/nernst-reaction-quotient-log-term",
    title: "Nernst Reaction Quotient Log Term Tool",
    description:
      "Nernst correction E-E0 = -RT ln(Q)/(nF), dimensionless activity quotient and caller-supplied constants.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        temperatureK: { type: "number", exclusiveMinimum: 0 },
        electronCount: { type: "integer", minimum: 1 },
        reactionQuotient: { type: "number", exclusiveMinimum: 0 },
        gasConstant: { type: "number", exclusiveMinimum: 0 },
        faradayConstant: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "temperatureK",
        "electronCount",
        "reactionQuotient",
        "gasConstant",
        "faradayConstant",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { potentialCorrection: { type: "number" } },
      required: ["potentialCorrection"],
    },
    ports: {
      inputs: [
        {
          id: "temperatureK",
          label: "Temperature K",
          required: true,
          valueType: { type: "number", unit: "K" },
        },
        {
          id: "electronCount",
          label: "Electron Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "reactionQuotient",
          label: "Reaction Quotient",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gasConstant",
          label: "Gas Constant",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "faradayConstant",
          label: "Faraday Constant",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "potentialCorrection",
          label: "Potential Correction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = nernstReactionQuotientLogTermTool.execute;
export default nernstReactionQuotientLogTermTool;
