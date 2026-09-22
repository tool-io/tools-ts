import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly places: readonly number[];
  readonly participants: number;
};
export type Output = { readonly capacity: number; readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    places: {
      type: "array",
      maxItems: 256,
      items: { type: "integer", minimum: 0 },
    },
    participants: { type: "integer", minimum: 0 },
  },
  required: ["places", "participants"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { capacity: { type: "integer" }, gap: { type: "integer" } },
  required: ["capacity", "gap"],
} as const;
/** Calculate activity station capacity gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { places, participants } = request;
  const compute = (): Output => {
    H.integer(participants, 0);
    H.domain(places.every((x) => x >= 0));
    return {
      capacity: places.reduce((a, b) => a + b, 0),
      gap: places.reduce((a, b) => a + b, 0) - participants,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { places: [4, 6], participants: 12 },
  output: { capacity: 10, gap: -2 },
} satisfies ToolExample<Input, Output>;
export const activityStationCapacityGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-education/activity-station-capacity-gap",
    title: "Activity Station Capacity Gap Tool",
    description:
      "Calculate activity station capacity gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        places: {
          type: "array",
          maxItems: 256,
          items: { type: "integer", minimum: 0 },
        },
        participants: { type: "integer", minimum: 0 },
      },
      required: ["places", "participants"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { capacity: { type: "integer" }, gap: { type: "integer" } },
      required: ["capacity", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "places",
          label: "Places",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "participants",
          label: "Participants",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "capacity", label: "Capacity", valueType: { type: "integer" } },
        { id: "gap", label: "Gap", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = activityStationCapacityGapTool.execute;
export default activityStationCapacityGapTool;
