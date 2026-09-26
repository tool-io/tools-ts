import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly currentDensity: number;
  readonly exchangeCurrentDensity: number;
  readonly slopeVoltsPerDecade: number;
};
export type Output = {
  readonly decades: number;
  readonly overpotential: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    currentDensity: { type: "number", exclusiveMinimum: 0 },
    exchangeCurrentDensity: { type: "number", exclusiveMinimum: 0 },
    slopeVoltsPerDecade: { type: "number" },
  },
  required: ["currentDensity", "exchangeCurrentDensity", "slopeVoltsPerDecade"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    decades: { type: "number" },
    overpotential: { type: "number" },
  },
  required: ["decades", "overpotential"],
} as const;
/** One Tafel branch using positive current magnitudes and an explicit signed volts-per-decade slope. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { currentDensity, exchangeCurrentDensity, slopeVoltsPerDecade } =
    request;
  const compute = (): Output => {
    H.positive(currentDensity);
    H.positive(exchangeCurrentDensity);
    return {
      decades: Math.log10(currentDensity / exchangeCurrentDensity),
      overpotential:
        slopeVoltsPerDecade *
        Math.log10(currentDensity / exchangeCurrentDensity),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    currentDensity: 100,
    exchangeCurrentDensity: 1,
    slopeVoltsPerDecade: 0.12,
  },
  output: { decades: 2, overpotential: 0.24 },
} satisfies ToolExample<Input, Output>;
export const tafelCurrentDecadeOverpotentialTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "electrochemistry/tafel-current-decade-overpotential-term",
      title: "Tafel Current Decade Overpotential Term Tool",
      description:
        "One Tafel branch using positive current magnitudes and an explicit signed volts-per-decade slope.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          currentDensity: { type: "number", exclusiveMinimum: 0 },
          exchangeCurrentDensity: { type: "number", exclusiveMinimum: 0 },
          slopeVoltsPerDecade: { type: "number" },
        },
        required: [
          "currentDensity",
          "exchangeCurrentDensity",
          "slopeVoltsPerDecade",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          decades: { type: "number" },
          overpotential: { type: "number" },
        },
        required: ["decades", "overpotential"],
      },
      ports: {
        inputs: [
          {
            id: "currentDensity",
            label: "Current Density",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "exchangeCurrentDensity",
            label: "Exchange Current Density",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "slopeVoltsPerDecade",
            label: "Slope Volts Per Decade",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "decades", label: "Decades", valueType: { type: "number" } },
          {
            id: "overpotential",
            label: "Overpotential",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = tafelCurrentDecadeOverpotentialTermTool.execute;
export default tafelCurrentDecadeOverpotentialTermTool;
