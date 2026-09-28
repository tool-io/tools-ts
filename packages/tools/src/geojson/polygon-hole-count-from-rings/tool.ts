import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly rings: number };
export type Output = {
  readonly holes: number;
  readonly exteriorPresent: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { rings: { type: "integer", minimum: 0 } },
  required: ["rings"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    holes: { type: "integer" },
    exteriorPresent: { type: "boolean" },
  },
  required: ["holes", "exteriorPresent"],
} as const;
/** Calculate polygon hole count from rings from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rings } = request;
  const compute = (): Output => {
    H.integer(rings, 0);
    return { holes: Math.max(0, rings - 1), exteriorPresent: rings > 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rings: 4 },
  output: { holes: 3, exteriorPresent: true },
} satisfies ToolExample<Input, Output>;
export const polygonHoleCountFromRingsTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geojson/polygon-hole-count-from-rings",
    title: "Polygon Hole Count From Rings Tool",
    description:
      "Calculate polygon hole count from rings from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { rings: { type: "integer", minimum: 0 } },
      required: ["rings"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        holes: { type: "integer" },
        exteriorPresent: { type: "boolean" },
      },
      required: ["holes", "exteriorPresent"],
    },
    ports: {
      inputs: [
        {
          id: "rings",
          label: "Rings",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "holes", label: "Holes", valueType: { type: "integer" } },
        {
          id: "exteriorPresent",
          label: "Exterior Present",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = polygonHoleCountFromRingsTool.execute;
export default polygonHoleCountFromRingsTool;
