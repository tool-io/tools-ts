import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly interactionStart: number;
  readonly interactionEnd: number;
};
export type Output = { readonly observedDuration: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    interactionStart: { type: "number" },
    interactionEnd: { type: "number" },
  },
  required: ["interactionStart", "interactionEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { observedDuration: { type: "number" } },
  required: ["observedDuration"],
} as const;
/** Measure one explicitly supplied ordered species-interaction observation duration without identifying species or inferring interaction effects. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { interactionStart, interactionEnd } = request;
  const compute = (): Output => {
    H.domain(interactionEnd >= interactionStart, "interactionEnd");
    return { observedDuration: interactionEnd - interactionStart };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { interactionStart: 12, interactionEnd: 17 },
  output: { observedDuration: 5 },
} satisfies ToolExample<Input, Output>;
export const speciesInteractionObservationDurationTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "ecology/species-interaction-observation-duration",
      title: "Species Interaction Observation Duration Tool",
      description:
        "Measure one explicitly supplied ordered species-interaction observation duration without identifying species or inferring interaction effects.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          interactionStart: { type: "number" },
          interactionEnd: { type: "number" },
        },
        required: ["interactionStart", "interactionEnd"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { observedDuration: { type: "number" } },
        required: ["observedDuration"],
      },
      ports: {
        inputs: [
          {
            id: "interactionStart",
            label: "Interaction Start",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "interactionEnd",
            label: "Interaction End",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "observedDuration",
            label: "Observed Duration",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = speciesInteractionObservationDurationTool.execute;
export default speciesInteractionObservationDurationTool;
