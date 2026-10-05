import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly coordinates: readonly number[] };
export type Output = {
  readonly defined: boolean;
  readonly direction: readonly number[];
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
    defined: { type: "boolean" },
    direction: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["defined", "direction"],
} as const;
/** Normalize a finite vector using scaled norm arithmetic; a zero or empty vector returns defined=false and zero coordinates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coordinates } = request;
  const compute = (): Output => {
    const scale = Math.max(0, ...coordinates.map(Math.abs));
    if (scale === 0)
      return { defined: false, direction: coordinates.map(() => 0) };
    const scaled = coordinates.map((v) => v / scale),
      norm = Math.hypot(...scaled);
    return { defined: true, direction: scaled.map((v) => v / norm) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coordinates: [3, 4] },
  output: { defined: true, direction: [0.6, 0.8] },
} satisfies ToolExample<Input, Output>;
export const vectorUnitDirectionZeroPolicyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vector/vector-unit-direction-zero-policy",
    title: "Vector Unit Direction Zero Policy Tool",
    description:
      "Normalize a finite vector using scaled norm arithmetic; a zero or empty vector returns defined=false and zero coordinates.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coordinates: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["coordinates"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        defined: { type: "boolean" },
        direction: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["defined", "direction"],
    },
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
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
        {
          id: "direction",
          label: "Direction",
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
    },
  },
  calculate,
});
export const run = vectorUnitDirectionZeroPolicyTool.execute;
export default vectorUnitDirectionZeroPolicyTool;
