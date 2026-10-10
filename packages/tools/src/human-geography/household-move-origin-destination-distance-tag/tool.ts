import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly moveId: string;
  readonly originZone: string;
  readonly destinationZone: string;
  readonly suppliedDistanceText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    moveId: { type: "string", maxLength: 8192, minLength: 1 },
    originZone: { type: "string", maxLength: 8192, minLength: 1 },
    destinationZone: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedDistanceText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["moveId", "originZone", "destinationZone", "suppliedDistanceText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit household move zone and distance metadata without geocoding addresses or reconstructing locations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { moveId, originZone, destinationZone, suppliedDistanceText } = request;
  const compute = (): Output => {
    H.domain(moveId.length > 0, "moveId");
    H.domain(originZone.length > 0, "originZone");
    H.domain(destinationZone.length > 0, "destinationZone");
    H.domain(suppliedDistanceText.length > 0, "suppliedDistanceText");
    return {
      token: JSON.stringify([
        moveId,
        originZone,
        destinationZone,
        suppliedDistanceText,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    moveId: "M17",
    originZone: "Z4",
    destinationZone: "Z5",
    suppliedDistanceText: "12 km",
  },
  output: { token: '["M17","Z4","Z5","12 km"]' },
} satisfies ToolExample<Input, Output>;
export const householdMoveOriginDestinationDistanceTagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "human-geography/household-move-origin-destination-distance-tag",
      title: "Household Move Origin Destination Distance Tag Tool",
      description:
        "Preserve explicit household move zone and distance metadata without geocoding addresses or reconstructing locations.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          moveId: { type: "string", maxLength: 8192, minLength: 1 },
          originZone: { type: "string", maxLength: 8192, minLength: 1 },
          destinationZone: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedDistanceText: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
        },
        required: [
          "moveId",
          "originZone",
          "destinationZone",
          "suppliedDistanceText",
        ],
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
            id: "moveId",
            label: "Move Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "originZone",
            label: "Origin Zone",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "destinationZone",
            label: "Destination Zone",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedDistanceText",
            label: "Supplied Distance Text",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = householdMoveOriginDestinationDistanceTagTool.execute;
export default householdMoveOriginDestinationDistanceTagTool;
