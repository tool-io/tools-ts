import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly returnDistance: number; readonly trips: number };
export type Output = { readonly totalEmptyDistance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    returnDistance: { type: "number", minimum: 0 },
    trips: { type: "integer", minimum: 0 },
  },
  required: ["returnDistance", "trips"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { totalEmptyDistance: { type: "number" } },
  required: ["totalEmptyDistance"],
} as const;
/** Multiply supplied empty return distance by explicit trip count without routing or estimating energy use. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { returnDistance, trips } = request;
  const compute = (): Output => {
    H.domain(returnDistance >= 0, "returnDistance");
    (H.domain(
      Number.isSafeInteger(trips) &&
        trips >= 0 &&
        trips <= Number.MAX_SAFE_INTEGER,
      "trips",
    ),
      trips);
    return { totalEmptyDistance: returnDistance * trips };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { returnDistance: 100, trips: 4 },
  output: { totalEmptyDistance: 400 },
} satisfies ToolExample<Input, Output>;
export const materialHandlingEmptyReturnDistanceTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "industrial-engineering/material-handling-empty-return-distance-term",
      title: "Material Handling Empty Return Distance Term Tool",
      description:
        "Multiply supplied empty return distance by explicit trip count without routing or estimating energy use.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          returnDistance: { type: "number", minimum: 0 },
          trips: { type: "integer", minimum: 0 },
        },
        required: ["returnDistance", "trips"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { totalEmptyDistance: { type: "number" } },
        required: ["totalEmptyDistance"],
      },
      ports: {
        inputs: [
          {
            id: "returnDistance",
            label: "Return Distance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "trips",
            label: "Trips",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "totalEmptyDistance",
            label: "Total Empty Distance",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = materialHandlingEmptyReturnDistanceTermTool.execute;
export default materialHandlingEmptyReturnDistanceTermTool;
