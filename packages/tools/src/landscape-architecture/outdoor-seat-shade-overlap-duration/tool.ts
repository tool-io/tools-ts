import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly occupancyStart: number;
  readonly occupancyEnd: number;
  readonly shadeStart: number;
  readonly shadeEnd: number;
};
export type Output = { readonly shadedDuration: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    occupancyStart: { type: "number" },
    occupancyEnd: { type: "number" },
    shadeStart: { type: "number" },
    shadeEnd: { type: "number" },
  },
  required: ["occupancyStart", "occupancyEnd", "shadeStart", "shadeEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { shadedDuration: { type: "number" } },
  required: ["shadedDuration"],
} as const;
/** Intersect one occupied seating interval with one observed shade interval in a shared time unit; no solar model is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { occupancyStart, occupancyEnd, shadeStart, shadeEnd } = request;
  const compute = (): Output => {
    H.domain(
      occupancyEnd >= occupancyStart && shadeEnd >= shadeStart,
      "occupancyEnd",
    );
    return {
      shadedDuration: Math.max(
        0,
        Math.min(occupancyEnd, shadeEnd) - Math.max(occupancyStart, shadeStart),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    occupancyStart: 60,
    occupancyEnd: 120,
    shadeStart: 90,
    shadeEnd: 150,
  },
  output: { shadedDuration: 30 },
} satisfies ToolExample<Input, Output>;
export const outdoorSeatShadeOverlapDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "landscape-architecture/outdoor-seat-shade-overlap-duration",
    title: "Outdoor Seat Shade Overlap Duration Tool",
    description:
      "Intersect one occupied seating interval with one observed shade interval in a shared time unit; no solar model is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        occupancyStart: { type: "number" },
        occupancyEnd: { type: "number" },
        shadeStart: { type: "number" },
        shadeEnd: { type: "number" },
      },
      required: ["occupancyStart", "occupancyEnd", "shadeStart", "shadeEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { shadedDuration: { type: "number" } },
      required: ["shadedDuration"],
    },
    ports: {
      inputs: [
        {
          id: "occupancyStart",
          label: "Occupancy Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "occupancyEnd",
          label: "Occupancy End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "shadeStart",
          label: "Shade Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "shadeEnd",
          label: "Shade End",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "shadedDuration",
          label: "Shaded Duration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = outdoorSeatShadeOverlapDurationTool.execute;
export default outdoorSeatShadeOverlapDurationTool;
