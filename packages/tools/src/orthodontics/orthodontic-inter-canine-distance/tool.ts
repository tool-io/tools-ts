import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstCaninePoint: readonly number[];
  readonly secondCaninePoint: readonly number[];
};
export type Output = { readonly distance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstCaninePoint: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    secondCaninePoint: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["firstCaninePoint", "secondCaninePoint"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { distance: { type: "number" } },
  required: ["distance"],
} as const;
/** Measure an explicit planar intercanine landmark distance in supplied compatible coordinates without evaluating arch form. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstCaninePoint, secondCaninePoint } = request;
  const compute = (): Output => {
    H.domain(firstCaninePoint.length === 2, "firstCaninePoint");
    H.domain(secondCaninePoint.length === 2, "secondCaninePoint");
    return {
      distance: Math.hypot(
        ...firstCaninePoint.map((x, i) => secondCaninePoint[i] - x),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstCaninePoint: [0, 0], secondCaninePoint: [3, 4] },
  output: { distance: 5 },
} satisfies ToolExample<Input, Output>;
export const orthodonticInterCanineDistanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["orthodontics", "health and medicine"],
      keywords: ["orthodontics", "health and medicine"],
    },
    id: "orthodontics/orthodontic-inter-canine-distance",
    title: "Orthodontic Inter Canine Distance",
    description:
      "Measure an explicit planar intercanine landmark distance in supplied compatible coordinates without evaluating arch form.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstCaninePoint: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        secondCaninePoint: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["firstCaninePoint", "secondCaninePoint"],
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
          id: "firstCaninePoint",
          label: "First Canine Point",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "secondCaninePoint",
          label: "Second Canine Point",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        { id: "distance", label: "Distance", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = orthodonticInterCanineDistanceTool.execute;
export default orthodonticInterCanineDistanceTool;
