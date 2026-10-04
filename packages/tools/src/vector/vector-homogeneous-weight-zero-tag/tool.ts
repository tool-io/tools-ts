import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly coordinates: readonly number[] };
export type Output = {
  readonly atInfinity: boolean;
  readonly euclidean: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coordinates: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["coordinates"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    atInfinity: { type: "boolean" },
    euclidean: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["atInfinity", "euclidean"],
} as const;
/** Compute vector homogeneous weight zero tag from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { coordinates } = input;
  const compute = (): Output => {
    domain(coordinates.length >= 2);
    const w = coordinates.at(-1)!;
    return {
      atInfinity: w === 0,
      euclidean: w === 0 ? [] : coordinates.slice(0, -1).map((x) => x / w),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { coordinates: [4, 6, 2] },
  output: { atInfinity: false, euclidean: [2, 3] },
} satisfies ToolExample<Input, Output>;
export const vectorHomogeneousWeightZeroTagTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "vector/vector-homogeneous-weight-zero-tag",
  title: "Vector Homogeneous Weight Zero Tag Tool",
  description:
    "Compute vector homogeneous weight zero tag from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "coordinates",
        label: "Coordinates",
        required: true,
        valueType: { type: "list", items: { type: "number" } },
      },
    ],
    outputs: [
      {
        id: "atInfinity",
        label: "At Infinity",
        valueType: { type: "boolean" },
      },
      {
        id: "euclidean",
        label: "Euclidean",
        valueType: { type: "list", items: { type: "number" } },
      },
    ],
  },
});
export const run = vectorHomogeneousWeightZeroTagTool.execute;
export default vectorHomogeneousWeightZeroTagTool;
