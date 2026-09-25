import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly intersection: number;
  readonly union: number;
  readonly intersectionDelta: number;
  readonly unionDelta: number;
};
export type Output = { readonly distance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    intersection: { type: "integer", minimum: 0 },
    union: { type: "integer", minimum: 1 },
    intersectionDelta: { type: "integer" },
    unionDelta: { type: "integer" },
  },
  required: ["intersection", "union", "intersectionDelta", "unionDelta"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { distance: { type: "number" } },
  required: ["distance"],
} as const;
/** Calculate jaccard distance one intersection update from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { intersection, union, intersectionDelta, unionDelta } = request;
  const compute = (): Output => {
    H.integer(union, 1);
    H.integer(intersection, 0, union);
    const i = intersection + intersectionDelta,
      u = union + unionDelta;
    H.integer(u, 1);
    H.integer(i, 0, u);
    return { distance: 1 - i / u };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { intersection: 2, union: 5, intersectionDelta: 1, unionDelta: 0 },
  output: { distance: 0.4 },
} satisfies ToolExample<Input, Output>;
export const jaccardDistanceOneIntersectionUpdateTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "distance/jaccard-distance-one-intersection-update",
      title: "Jaccard Distance One Intersection Update Tool",
      description:
        "Calculate jaccard distance one intersection update from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          intersection: { type: "integer", minimum: 0 },
          union: { type: "integer", minimum: 1 },
          intersectionDelta: { type: "integer" },
          unionDelta: { type: "integer" },
        },
        required: ["intersection", "union", "intersectionDelta", "unionDelta"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { distance: { type: "number" } },
        required: ["distance"],
      },
      ports: {
        inputs: [
          {
            id: "intersection",
            label: "Intersection",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "union",
            label: "Union",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "intersectionDelta",
            label: "Intersection Delta",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "unionDelta",
            label: "Union Delta",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "distance", label: "Distance", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = jaccardDistanceOneIntersectionUpdateTool.execute;
export default jaccardDistanceOneIntersectionUpdateTool;
