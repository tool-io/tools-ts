import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly distance: number;
  readonly suppliedAccessFrequency: number;
};
export type Output = { readonly weightedDistance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distance: { type: "number", minimum: 0 },
    suppliedAccessFrequency: { type: "number", minimum: 0 },
  },
  required: ["distance", "suppliedAccessFrequency"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { weightedDistance: { type: "number" } },
  required: ["weightedDistance"],
} as const;
/** Calculate zone access distance weight from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { distance, suppliedAccessFrequency } = request;
  const compute = (): Output => {
    H.domain(distance >= 0 && suppliedAccessFrequency >= 0);
    return { weightedDistance: distance * suppliedAccessFrequency };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { distance: 20, suppliedAccessFrequency: 3 },
  output: { weightedDistance: 60 },
} satisfies ToolExample<Input, Output>;
export const zoneAccessDistanceWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "permaculture/zone-access-distance-weight",
    title: "Zone Access Distance Weight Tool",
    description:
      "Calculate zone access distance weight from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distance: { type: "number", minimum: 0 },
        suppliedAccessFrequency: { type: "number", minimum: 0 },
      },
      required: ["distance", "suppliedAccessFrequency"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { weightedDistance: { type: "number" } },
      required: ["weightedDistance"],
    },
    ports: {
      inputs: [
        {
          id: "distance",
          label: "Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedAccessFrequency",
          label: "Supplied Access Frequency",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "weightedDistance",
          label: "Weighted Distance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = zoneAccessDistanceWeightTool.execute;
export default zoneAccessDistanceWeightTool;
