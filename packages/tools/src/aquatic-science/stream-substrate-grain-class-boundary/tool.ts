import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly diameter: number;
  readonly boundaries: readonly number[];
  readonly labels: readonly string[];
};
export type Output = { readonly index: number; readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    diameter: { type: "number" },
    boundaries: { type: "array", maxItems: 256, items: { type: "number" } },
    labels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["diameter", "boundaries", "labels"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    index: { type: "integer" },
    label: { type: "string", maxLength: 8192 },
  },
  required: ["index", "label"],
} as const;
/** Use caller-supplied increasing grain-size boundaries with lower-inclusive and upper-exclusive classes; no sediment taxonomy is selected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { diameter, boundaries, labels } = request;
  const compute = (): Output => {
    H.domain(
      diameter >= 0 &&
        labels.length === boundaries.length + 1 &&
        boundaries.every(
          (x, i) => x >= 0 && (i === 0 || x > boundaries[i - 1]),
        ),
    );
    const boundary = boundaries.findIndex((x) => diameter < x),
      index = boundary < 0 ? boundaries.length : boundary;
    return { index, label: labels[index] };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { diameter: 2, boundaries: [1, 2, 4], labels: ["a", "b", "c", "d"] },
  output: { index: 2, label: "c" },
} satisfies ToolExample<Input, Output>;
export const streamSubstrateGrainClassBoundaryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquatic-science/stream-substrate-grain-class-boundary",
    title: "Stream Substrate Grain Class Boundary Tool",
    description:
      "Use caller-supplied increasing grain-size boundaries with lower-inclusive and upper-exclusive classes; no sediment taxonomy is selected.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        diameter: { type: "number" },
        boundaries: { type: "array", maxItems: 256, items: { type: "number" } },
        labels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["diameter", "boundaries", "labels"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        index: { type: "integer" },
        label: { type: "string", maxLength: 8192 },
      },
      required: ["index", "label"],
    },
    ports: {
      inputs: [
        {
          id: "diameter",
          label: "Diameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "boundaries",
          label: "Boundaries",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "labels",
          label: "Labels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "index", label: "Index", valueType: { type: "integer" } },
        { id: "label", label: "Label", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = streamSubstrateGrainClassBoundaryTool.execute;
export default streamSubstrateGrainClassBoundaryTool;
