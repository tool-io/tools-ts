import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly activity: number;
  readonly footprintFactor: number;
  readonly equivalenceFactor: number;
};
export type Output = { readonly footprint: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activity: { type: "number", minimum: 0 },
    footprintFactor: { type: "number", minimum: 0 },
    equivalenceFactor: { type: "number", minimum: 0 },
  },
  required: ["activity", "footprintFactor", "equivalenceFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { footprint: { type: "number" } },
  required: ["footprint"],
} as const;
/** Apply supplied footprint and equivalence factors; no geographic yield data or indicator standard is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { activity, footprintFactor, equivalenceFactor } = request;
  const compute = (): Output => {
    H.domain(activity >= 0 && footprintFactor >= 0 && equivalenceFactor >= 0);
    return { footprint: activity * footprintFactor * equivalenceFactor };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { activity: 10, footprintFactor: 2, equivalenceFactor: 1.5 },
  output: { footprint: 30 },
} satisfies ToolExample<Input, Output>;
export const ecologicalFootprintExplicitFactorTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "environmental-science/ecological-footprint-explicit-factor-term",
      title: "Ecological Footprint Explicit Factor Term Tool",
      description:
        "Apply supplied footprint and equivalence factors; no geographic yield data or indicator standard is inferred.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          activity: { type: "number", minimum: 0 },
          footprintFactor: { type: "number", minimum: 0 },
          equivalenceFactor: { type: "number", minimum: 0 },
        },
        required: ["activity", "footprintFactor", "equivalenceFactor"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { footprint: { type: "number" } },
        required: ["footprint"],
      },
      ports: {
        inputs: [
          {
            id: "activity",
            label: "Activity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "footprintFactor",
            label: "Footprint Factor",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "equivalenceFactor",
            label: "Equivalence Factor",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "footprint",
            label: "Footprint",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = ecologicalFootprintExplicitFactorTermTool.execute;
export default ecologicalFootprintExplicitFactorTermTool;
