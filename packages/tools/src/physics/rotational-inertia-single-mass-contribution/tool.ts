import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly mass: number;
  readonly axis: readonly number[];
  readonly position: readonly number[];
};
export type Output = {
  readonly perpendicularSquared: number;
  readonly inertia: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mass: { type: "number", minimum: 0 },
    axis: { type: "array", maxItems: 256, items: { type: "number" } },
    position: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["mass", "axis", "position"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    perpendicularSquared: { type: "number" },
    inertia: { type: "number" },
  },
  required: ["perpendicularSquared", "inertia"],
} as const;
/** Return the point-mass inertia contribution about a supplied nonzero axis through the origin. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { mass, axis, position } = input;
  const compute = (): Output => {
    H.domain(mass >= 0 && axis.length === 3 && position.length === 3);
    const norm = H.dot(axis, axis);
    H.positive(norm);
    const perpendicularSquared = Math.max(
      0,
      H.dot(position, position) - H.dot(position, axis) ** 2 / norm,
    );
    return { perpendicularSquared, inertia: mass * perpendicularSquared };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { mass: 2, axis: [0, 0, 1], position: [3, 4, 5] },
  output: { perpendicularSquared: 25, inertia: 50 },
} satisfies ToolExample<Input, Output>;
export const rotationalInertiaSingleMassContributionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "physics/rotational-inertia-single-mass-contribution",
      title: "Rotational Inertia Single Mass Contribution Tool",
      description:
        "Return the point-mass inertia contribution about a supplied nonzero axis through the origin.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          mass: { type: "number", minimum: 0 },
          axis: { type: "array", maxItems: 256, items: { type: "number" } },
          position: { type: "array", maxItems: 256, items: { type: "number" } },
        },
        required: ["mass", "axis", "position"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          perpendicularSquared: { type: "number" },
          inertia: { type: "number" },
        },
        required: ["perpendicularSquared", "inertia"],
      },
      ports: {
        inputs: [
          {
            id: "mass",
            label: "Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "axis",
            label: "Axis",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "position",
            label: "Position",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
        outputs: [
          {
            id: "perpendicularSquared",
            label: "Perpendicular Squared",
            valueType: { type: "number" },
          },
          { id: "inertia", label: "Inertia", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = rotationalInertiaSingleMassContributionTool.execute;
export default rotationalInertiaSingleMassContributionTool;
