import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observation: number;
  readonly groupMean: number;
  readonly grandMean: number;
};
export type Output = { readonly centeredObservation: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observation: { type: "number" },
    groupMean: { type: "number" },
    grandMean: { type: "number" },
  },
  required: ["observation", "groupMean", "grandMean"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { centeredObservation: { type: "number" } },
  required: ["centeredObservation"],
} as const;
/** Apply the explicit one-way group demeaning convention that adds back the supplied grand mean. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observation, groupMean, grandMean } = request;
  const compute = (): Output => {
    return { centeredObservation: observation - groupMean + grandMean };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observation: 12, groupMean: 10, grandMean: 5 },
  output: { centeredObservation: 7 },
} satisfies ToolExample<Input, Output>;
export const fixedEffectAbsorptionGrandmeanTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "econometrics/fixed-effect-absorption-grandmean-term",
    title: "Fixed Effect Absorption Grandmean Term Tool",
    description:
      "Apply the explicit one-way group demeaning convention that adds back the supplied grand mean.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observation: { type: "number" },
        groupMean: { type: "number" },
        grandMean: { type: "number" },
      },
      required: ["observation", "groupMean", "grandMean"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { centeredObservation: { type: "number" } },
      required: ["centeredObservation"],
    },
    ports: {
      inputs: [
        {
          id: "observation",
          label: "Observation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "groupMean",
          label: "Group Mean",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "grandMean",
          label: "Grand Mean",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "centeredObservation",
          label: "Centered Observation",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fixedEffectAbsorptionGrandmeanTermTool.execute;
export default fixedEffectAbsorptionGrandmeanTermTool;
