import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly apertureWidthMeters: number;
  readonly depthMeters: number;
  readonly occupiedDistanceFromVertexMeters: number;
  readonly focusZoneRadiusMeters: number;
}>;
export type Output = Readonly<{
  readonly focalDistanceFromVertexMeters: number;
  readonly distanceFromFocusMeters: number;
  readonly occupiedLocationInFocusZone: boolean;
}>;

export const calculate = (input: Input): Output => {
  for (const [field, value] of Object.entries(input))
    if (!Number.isFinite(value) || value < 0)
      simpleError(
        field,
        "Dimensions must be finite and nonnegative.",
        "invalid_dimension",
      );
  if (input.apertureWidthMeters <= 0 || input.depthMeters <= 0)
    simpleError(
      "apertureWidthMeters",
      "Aperture width and depth must be positive.",
      "invalid_parabola",
    );
  const directFocalDistance =
    input.apertureWidthMeters ** 2 / (16 * input.depthMeters);
  const focalDistanceFromVertexMeters =
    Number.isFinite(directFocalDistance) && directFocalDistance > 0
      ? directFocalDistance
      : Math.exp(
          2 * Math.log(input.apertureWidthMeters) -
            Math.log(16) -
            Math.log(input.depthMeters),
        );
  if (
    !Number.isFinite(focalDistanceFromVertexMeters) ||
    focalDistanceFromVertexMeters <= 0
  )
    simpleError(
      "apertureWidthMeters",
      "Parabolic dimensions produce an out-of-range focal distance.",
      "numeric_overflow",
    );
  const distanceFromFocusMeters = Math.abs(
    input.occupiedDistanceFromVertexMeters - focalDistanceFromVertexMeters,
  );
  if (!Number.isFinite(distanceFromFocusMeters))
    simpleError(
      "occupiedDistanceFromVertexMeters",
      "Distance from focus is out of range.",
      "numeric_overflow",
    );
  return {
    focalDistanceFromVertexMeters,
    distanceFromFocusMeters,
    occupiedLocationInFocusZone:
      distanceFromFocusMeters <= input.focusZoneRadiusMeters,
  };
};

export const example = {
  input: {
    apertureWidthMeters: 8,
    depthMeters: 2,
    occupiedDistanceFromVertexMeters: 2.1,
    focusZoneRadiusMeters: 0.2,
  },
  output: {
    focalDistanceFromVertexMeters: 2,
    distanceFromFocusMeters: 0.10000000000000009,
    occupiedLocationInFocusZone: true,
  },
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  input: {
    apertureWidthMeters: 4,
    depthMeters: 1,
    occupiedDistanceFromVertexMeters: 3,
    focusZoneRadiusMeters: 0.5,
  },
  output: {
    focalDistanceFromVertexMeters: 1,
    distanceFromFocusMeters: 2,
    occupiedLocationInFocusZone: false,
  },
} satisfies { readonly input: Input; readonly output: Output };

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      apertureWidthMeters: input.apertureWidthMeters as number,
      depthMeters: input.depthMeters as number,
      occupiedDistanceFromVertexMeters:
        input.occupiedDistanceFromVertexMeters as number,
      focusZoneRadiusMeters: input.focusZoneRadiusMeters as number,
    }),
  description:
    "Calculate the focal distance of a parabolic section from aperture width and depth and screen an occupied location against an explicit focus-zone radius.",
  id: "acoustics/parabolic-focus-screen",
  inputs: [
    {
      id: "apertureWidthMeters",
      kind: "number",
      label: "Parabolic aperture width",
      minimum: 0,
      unit: "m",
    },
    {
      id: "depthMeters",
      kind: "number",
      label: "Parabolic depth",
      minimum: 0,
      unit: "m",
    },
    {
      id: "occupiedDistanceFromVertexMeters",
      kind: "number",
      label: "Occupied distance from vertex",
      minimum: 0,
      unit: "m",
    },
    {
      id: "focusZoneRadiusMeters",
      kind: "number",
      label: "Focus-zone radius",
      minimum: 0,
      unit: "m",
    },
  ],
  outputs: [
    {
      id: "focalDistanceFromVertexMeters",
      kind: "number",
      label: "Focal distance from vertex",
      minimum: 0,
      unit: "m",
    },
    {
      id: "distanceFromFocusMeters",
      kind: "number",
      label: "Distance from focus",
      minimum: 0,
      unit: "m",
    },
    {
      id: "occupiedLocationInFocusZone",
      kind: "boolean",
      label: "Occupied location in focus zone",
    },
  ],
  title: "Parabolic Focus Screen",
});

export const run = tool.execute;
export default tool;
