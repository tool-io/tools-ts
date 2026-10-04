import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly powerWatts: number;
  readonly efficiencyMicromolesPerJoule: number;
  readonly utilizedFraction: number;
  readonly areaM2: number;
};
export type Output = { readonly photonFlow: number; readonly meanPpfd: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    powerWatts: { type: "number", minimum: 0 },
    efficiencyMicromolesPerJoule: { type: "number", minimum: 0 },
    utilizedFraction: { type: "number", minimum: 0, maximum: 1 },
    areaM2: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "powerWatts",
    "efficiencyMicromolesPerJoule",
    "utilizedFraction",
    "areaM2",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { photonFlow: { type: "number" }, meanPpfd: { type: "number" } },
  required: ["photonFlow", "meanPpfd"],
} as const;
/** Calculate led photon efficiency power factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { powerWatts, efficiencyMicromolesPerJoule, utilizedFraction, areaM2 } =
    request;
  const compute = (): Output => {
    H.domain(powerWatts >= 0 && efficiencyMicromolesPerJoule >= 0);
    H.probability(utilizedFraction);
    H.positive(areaM2);
    return {
      photonFlow: powerWatts * efficiencyMicromolesPerJoule,
      meanPpfd:
        (powerWatts * efficiencyMicromolesPerJoule * utilizedFraction) / areaM2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    powerWatts: 100,
    efficiencyMicromolesPerJoule: 2.5,
    utilizedFraction: 0.8,
    areaM2: 2,
  },
  output: { photonFlow: 250, meanPpfd: 100 },
} satisfies ToolExample<Input, Output>;
export const ledPhotonEfficiencyPowerFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vertical-farming/led-photon-efficiency-power-factor",
    title: "Led Photon Efficiency Power Factor Tool",
    description:
      "Calculate led photon efficiency power factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        powerWatts: { type: "number", minimum: 0 },
        efficiencyMicromolesPerJoule: { type: "number", minimum: 0 },
        utilizedFraction: { type: "number", minimum: 0, maximum: 1 },
        areaM2: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "powerWatts",
        "efficiencyMicromolesPerJoule",
        "utilizedFraction",
        "areaM2",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        photonFlow: { type: "number" },
        meanPpfd: { type: "number" },
      },
      required: ["photonFlow", "meanPpfd"],
    },
    ports: {
      inputs: [
        {
          id: "powerWatts",
          label: "Power Watts",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "efficiencyMicromolesPerJoule",
          label: "Efficiency Micromoles Per Joule",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "utilizedFraction",
          label: "Utilized Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "areaM2",
          label: "Area M2",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "photonFlow",
          label: "Photon Flow",
          valueType: { type: "number" },
        },
        { id: "meanPpfd", label: "Mean Ppfd", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = ledPhotonEfficiencyPowerFactorTool.execute;
export default ledPhotonEfficiencyPowerFactorTool;
