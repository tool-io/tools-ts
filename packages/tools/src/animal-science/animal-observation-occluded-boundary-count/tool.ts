import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly occluded: readonly boolean[] };
export type Output = {
  readonly transitions: number;
  readonly starts: number;
  readonly ends: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    occluded: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["occluded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    transitions: { type: "integer" },
    starts: { type: "integer" },
    ends: { type: "integer" },
  },
  required: ["transitions", "starts", "ends"],
} as const;
/** Count observed transitions inside a sampled occlusion mask without inventing transitions outside the record. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { occluded } = request;
  const compute = (): Output => {
    let starts = 0,
      ends = 0;
    for (let i = 1; i < occluded.length; i++)
      if (occluded[i] !== occluded[i - 1]) occluded[i] ? starts++ : ends++;
    return { transitions: starts + ends, starts, ends };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { occluded: [false, true, true, false, true] },
  output: { transitions: 3, starts: 2, ends: 1 },
} satisfies ToolExample<Input, Output>;
export const animalObservationOccludedBoundaryCountTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "animal-science/animal-observation-occluded-boundary-count",
      title: "Animal Observation Occluded Boundary Count Tool",
      description:
        "Count observed transitions inside a sampled occlusion mask without inventing transitions outside the record.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          occluded: {
            type: "array",
            maxItems: 256,
            items: { type: "boolean" },
          },
        },
        required: ["occluded"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          transitions: { type: "integer" },
          starts: { type: "integer" },
          ends: { type: "integer" },
        },
        required: ["transitions", "starts", "ends"],
      },
      ports: {
        inputs: [
          {
            id: "occluded",
            label: "Occluded",
            required: true,
            valueType: { type: "list", items: { type: "boolean" } },
          },
        ],
        outputs: [
          {
            id: "transitions",
            label: "Transitions",
            valueType: { type: "integer" },
          },
          { id: "starts", label: "Starts", valueType: { type: "integer" } },
          { id: "ends", label: "Ends", valueType: { type: "integer" } },
        ],
      },
    },
    calculate,
  });
export const run = animalObservationOccludedBoundaryCountTool.execute;
export default animalObservationOccludedBoundaryCountTool;
