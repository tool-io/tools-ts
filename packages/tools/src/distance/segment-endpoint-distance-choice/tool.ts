import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstEndpointDistance: number;
  readonly secondEndpointDistance: number;
  readonly chooseFarthest: boolean;
};
export type Output = {
  readonly selectedDistance: number;
  readonly firstEndpointChosen: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstEndpointDistance: { type: "number", minimum: 0 },
    secondEndpointDistance: { type: "number", minimum: 0 },
    chooseFarthest: { type: "boolean" },
  },
  required: [
    "firstEndpointDistance",
    "secondEndpointDistance",
    "chooseFarthest",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    selectedDistance: { type: "number" },
    firstEndpointChosen: { type: "boolean" },
  },
  required: ["selectedDistance", "firstEndpointChosen"],
} as const;
/** Choose the nearest or farthest explicit endpoint distance, resolving exact ties to the first endpoint. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstEndpointDistance, secondEndpointDistance, chooseFarthest } =
    request;
  const compute = (): Output => {
    H.domain(
      firstEndpointDistance >= 0 && secondEndpointDistance >= 0,
      "firstEndpointDistance",
    );
    return {
      selectedDistance: chooseFarthest
        ? Math.max(firstEndpointDistance, secondEndpointDistance)
        : Math.min(firstEndpointDistance, secondEndpointDistance),
      firstEndpointChosen: chooseFarthest
        ? firstEndpointDistance >= secondEndpointDistance
        : firstEndpointDistance <= secondEndpointDistance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstEndpointDistance: 3,
    secondEndpointDistance: 5,
    chooseFarthest: false,
  },
  output: { selectedDistance: 3, firstEndpointChosen: true },
} satisfies ToolExample<Input, Output>;
export const segmentEndpointDistanceChoiceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["distance", "mathematics"],
      keywords: ["distance", "mathematics"],
    },
    id: "distance/segment-endpoint-distance-choice",
    title: "Segment Endpoint Distance Choice",
    description:
      "Choose the nearest or farthest explicit endpoint distance, resolving exact ties to the first endpoint.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstEndpointDistance: { type: "number", minimum: 0 },
        secondEndpointDistance: { type: "number", minimum: 0 },
        chooseFarthest: { type: "boolean" },
      },
      required: [
        "firstEndpointDistance",
        "secondEndpointDistance",
        "chooseFarthest",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        selectedDistance: { type: "number" },
        firstEndpointChosen: { type: "boolean" },
      },
      required: ["selectedDistance", "firstEndpointChosen"],
    },
    ports: {
      inputs: [
        {
          id: "firstEndpointDistance",
          label: "First Endpoint Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondEndpointDistance",
          label: "Second Endpoint Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "chooseFarthest",
          label: "Choose Farthest",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "selectedDistance",
          label: "Selected Distance",
          valueType: { type: "number" },
        },
        {
          id: "firstEndpointChosen",
          label: "First Endpoint Chosen",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = segmentEndpointDistanceChoiceTool.execute;
export default segmentEndpointDistanceChoiceTool;
