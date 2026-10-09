import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly activityId: string;
  readonly distanceText: string;
  readonly unitText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activityId: { type: "string", maxLength: 8192, minLength: 1 },
    distanceText: { type: "string", maxLength: 8192, minLength: 1 },
    unitText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["activityId", "distanceText", "unitText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit activity-distance text and unit without estimating activity intensity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { activityId, distanceText, unitText } = request;
  const compute = (): Output => {
    H.domain(activityId.length > 0, "activityId");
    H.domain(distanceText.length > 0, "distanceText");
    H.domain(unitText.length > 0, "unitText");
    return { token: JSON.stringify([activityId, distanceText, unitText]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { activityId: "A17", distanceText: "5.2", unitText: "km" },
  output: { token: '["A17","5.2","km"]' },
} satisfies ToolExample<Input, Output>;
export const activityDistanceUnitReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["health", "health and medicine"],
      keywords: ["health", "health and medicine"],
    },
    id: "health/activity-distance-unit-reference",
    title: "Activity Distance Unit Reference",
    description:
      "Preserve explicit activity-distance text and unit without estimating activity intensity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        activityId: { type: "string", maxLength: 8192, minLength: 1 },
        distanceText: { type: "string", maxLength: 8192, minLength: 1 },
        unitText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["activityId", "distanceText", "unitText"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "activityId",
          label: "Activity Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "distanceText",
          label: "Distance Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "unitText",
          label: "Unit Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = activityDistanceUnitReferenceTool.execute;
export default activityDistanceUnitReferenceTool;
