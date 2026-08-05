import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CircleInput = {
  readonly area?: number;
  readonly circumference?: number;
  readonly diameter?: number;
  readonly radius?: number;
};

export type CircleMeasurements = {
  readonly area: number;
  readonly circumference: number;
  readonly diameter: number;
  readonly radius: number;
};

export const calculateCircle = (
  input: CircleInput,
): CircleMeasurements | null => {
  const supplied = Object.entries(input).filter(
    ([, value]) => value !== undefined,
  );
  if (supplied.length !== 1) return null;
  const [kind, value] = supplied[0] as [keyof CircleInput, number];
  if (!Number.isFinite(value) || value < 0) return null;
  const radius = {
    area: Math.sqrt(value / Math.PI),
    circumference: value / (2 * Math.PI),
    diameter: value / 2,
    radius: value,
  }[kind];
  const result = {
    area: Math.PI * radius ** 2,
    circumference: 2 * Math.PI * radius,
    diameter: 2 * radius,
    radius,
  };
  return Object.values(result).every(Number.isFinite) ? result : null;
};

export const circleExample = {
  input: { radius: 5 },
  output: {
    area: 78.53981633974483,
    circumference: 31.41592653589793,
    diameter: 10,
    radius: 5,
  },
} satisfies ToolExample<CircleInput, CircleMeasurements>;

export const circleTool = createSimpleTool({
  id: "geometry/circle",
  title: "Circle Calculator",
  description:
    "Calculate a circle's radius, diameter, circumference, and area from one known measurement.",
  inputs: [
    {
      id: "radius",
      kind: "number",
      label: "Radius",
      minimum: 0,
      required: false,
    },
    {
      id: "diameter",
      kind: "number",
      label: "Diameter",
      minimum: 0,
      required: false,
    },
    {
      id: "circumference",
      kind: "number",
      label: "Circumference",
      minimum: 0,
      required: false,
    },
    { id: "area", kind: "number", label: "Area", minimum: 0, required: false },
  ],
  outputs: [
    { id: "radius", kind: "number", label: "Radius" },
    { id: "diameter", kind: "number", label: "Diameter" },
    { id: "circumference", kind: "number", label: "Circumference" },
    { id: "area", kind: "number", label: "Area" },
  ],
  calculate: (input) => {
    const result = calculateCircle(input as CircleInput);
    if (!result)
      simpleError("radius", "Enter exactly one nonnegative measurement.");
    return result;
  },
});

export const runCircle = circleTool.execute;
export default circleTool;
