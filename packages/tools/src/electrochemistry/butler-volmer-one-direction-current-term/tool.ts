import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly exchangeCurrent: number;
  readonly transferCoefficient: number;
  readonly electronCount: number;
  readonly faradayConstant: number;
  readonly overpotential: number;
  readonly gasConstant: number;
  readonly temperatureK: number;
  readonly anodic: boolean;
};
export type Output = { readonly partialCurrent: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exchangeCurrent: { type: "number", minimum: 0 },
    transferCoefficient: { type: "number", minimum: 0, maximum: 1 },
    electronCount: { type: "integer", minimum: 1 },
    faradayConstant: { type: "number", exclusiveMinimum: 0 },
    overpotential: { type: "number" },
    gasConstant: { type: "number", exclusiveMinimum: 0 },
    temperatureK: { type: "number", exclusiveMinimum: 0 },
    anodic: { type: "boolean" },
  },
  required: [
    "exchangeCurrent",
    "transferCoefficient",
    "electronCount",
    "faradayConstant",
    "overpotential",
    "gasConstant",
    "temperatureK",
    "anodic",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { partialCurrent: { type: "number" } },
  required: ["partialCurrent"],
} as const;
/** One signed Butler-Volmer partial current under the anodic-positive convention, excluding mass-transfer limits. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    exchangeCurrent,
    transferCoefficient,
    electronCount,
    faradayConstant,
    overpotential,
    gasConstant,
    temperatureK,
    anodic,
  } = request;
  const compute = (): Output => {
    H.domain(exchangeCurrent >= 0);
    H.probability(transferCoefficient);
    H.integer(electronCount, 1);
    H.positive(faradayConstant);
    H.positive(gasConstant);
    H.positive(temperatureK);
    return {
      partialCurrent:
        (anodic ? 1 : -1) *
        exchangeCurrent *
        Math.exp(
          ((anodic ? transferCoefficient : -(1 - transferCoefficient)) *
            electronCount *
            faradayConstant *
            overpotential) /
            (gasConstant * temperatureK),
        ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    exchangeCurrent: 0.01,
    transferCoefficient: 0.5,
    electronCount: 1,
    faradayConstant: 96485.33212331001,
    overpotential: 0.05,
    gasConstant: 8.31446261815324,
    temperatureK: 298.15,
    anodic: true,
  },
  output: { partialCurrent: 0.02645985570641708 },
} satisfies ToolExample<Input, Output>;
export const butlerVolmerOneDirectionCurrentTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "electrochemistry/butler-volmer-one-direction-current-term",
      title: "Butler Volmer One Direction Current Term Tool",
      description:
        "One signed Butler-Volmer partial current under the anodic-positive convention, excluding mass-transfer limits.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          exchangeCurrent: { type: "number", minimum: 0 },
          transferCoefficient: { type: "number", minimum: 0, maximum: 1 },
          electronCount: { type: "integer", minimum: 1 },
          faradayConstant: { type: "number", exclusiveMinimum: 0 },
          overpotential: { type: "number" },
          gasConstant: { type: "number", exclusiveMinimum: 0 },
          temperatureK: { type: "number", exclusiveMinimum: 0 },
          anodic: { type: "boolean" },
        },
        required: [
          "exchangeCurrent",
          "transferCoefficient",
          "electronCount",
          "faradayConstant",
          "overpotential",
          "gasConstant",
          "temperatureK",
          "anodic",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { partialCurrent: { type: "number" } },
        required: ["partialCurrent"],
      },
      ports: {
        inputs: [
          {
            id: "exchangeCurrent",
            label: "Exchange Current",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "transferCoefficient",
            label: "Transfer Coefficient",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "electronCount",
            label: "Electron Count",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "faradayConstant",
            label: "Faraday Constant",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "overpotential",
            label: "Overpotential",
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
            id: "temperatureK",
            label: "Temperature K",
            required: true,
            valueType: { type: "number", unit: "K" },
          },
          {
            id: "anodic",
            label: "Anodic",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "partialCurrent",
            label: "Partial Current",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = butlerVolmerOneDirectionCurrentTermTool.execute;
export default butlerVolmerOneDirectionCurrentTermTool;
