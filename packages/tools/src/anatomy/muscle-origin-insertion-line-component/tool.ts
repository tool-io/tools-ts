import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly origin: readonly number[];
  readonly insertion: readonly number[];
  readonly force: number;
  readonly axis: readonly number[];
};
export type Output = {
  readonly lineLength: number;
  readonly axisForce: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    origin: { type: "array", maxItems: 256, items: { type: "number" } },
    insertion: { type: "array", maxItems: 256, items: { type: "number" } },
    force: { type: "number" },
    axis: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["origin", "insertion", "force", "axis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lineLength: { type: "number" }, axisForce: { type: "number" } },
  required: ["lineLength", "axisForce"],
} as const;
/** Ideal line-of-action force projection in explicit model coordinates; does not infer physiological force or joint mechanics. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { origin, insertion, force, axis } = request;
  const compute = (): Output => {
    H.domain(
      origin.length === 3 &&
        insertion.length === 3 &&
        axis.length === 3 &&
        Math.hypot(...axis) > 0 &&
        Math.hypot(...insertion.map((x, i) => x - origin[i])) > 0,
    );
    return {
      lineLength: Math.hypot(...insertion.map((x, i) => x - origin[i])),
      axisForce:
        (force *
          H.dot(
            insertion.map((x, i) => x - origin[i]),
            axis,
          )) /
        (Math.hypot(...insertion.map((x, i) => x - origin[i])) *
          Math.hypot(...axis)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    origin: [0, 0, 0],
    insertion: [3, 4, 0],
    force: 10,
    axis: [1, 0, 0],
  },
  output: { lineLength: 5, axisForce: 6 },
} satisfies ToolExample<Input, Output>;
export const muscleOriginInsertionLineComponentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anatomy/muscle-origin-insertion-line-component",
    title: "Muscle Origin Insertion Line Component Tool",
    description:
      "Ideal line-of-action force projection in explicit model coordinates; does not infer physiological force or joint mechanics.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        origin: { type: "array", maxItems: 256, items: { type: "number" } },
        insertion: { type: "array", maxItems: 256, items: { type: "number" } },
        force: { type: "number" },
        axis: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["origin", "insertion", "force", "axis"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lineLength: { type: "number" },
        axisForce: { type: "number" },
      },
      required: ["lineLength", "axisForce"],
    },
    ports: {
      inputs: [
        {
          id: "origin",
          label: "Origin",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "insertion",
          label: "Insertion",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "force",
          label: "Force",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "axis",
          label: "Axis",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "lineLength",
          label: "Line Length",
          valueType: { type: "number" },
        },
        { id: "axisForce", label: "Axis Force", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = muscleOriginInsertionLineComponentTool.execute;
export default muscleOriginInsertionLineComponentTool;
