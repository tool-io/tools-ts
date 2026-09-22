import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly habitatPerimeter: number;
  readonly totalWettedPerimeter: number;
  readonly reachLength: number;
};
export type Output = {
  readonly fraction: number;
  readonly wettedSurfaceProxy: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    habitatPerimeter: { type: "number", minimum: 0 },
    totalWettedPerimeter: { type: "number", exclusiveMinimum: 0 },
    reachLength: { type: "number", minimum: 0 },
  },
  required: ["habitatPerimeter", "totalWettedPerimeter", "reachLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fraction: { type: "number" },
    wettedSurfaceProxy: { type: "number" },
  },
  required: ["fraction", "wettedSurfaceProxy"],
} as const;
/** Calculate aquatic habitat wetted perimeter share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { habitatPerimeter, totalWettedPerimeter, reachLength } = request;
  const compute = (): Output => {
    H.positive(totalWettedPerimeter);
    H.domain(
      habitatPerimeter >= 0 &&
        habitatPerimeter <= totalWettedPerimeter &&
        reachLength >= 0,
    );
    return {
      fraction: habitatPerimeter / totalWettedPerimeter,
      wettedSurfaceProxy: habitatPerimeter * reachLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { habitatPerimeter: 4, totalWettedPerimeter: 10, reachLength: 100 },
  output: { fraction: 0.4, wettedSurfaceProxy: 400 },
} satisfies ToolExample<Input, Output>;
export const aquaticHabitatWettedPerimeterShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquatic-science/aquatic-habitat-wetted-perimeter-share",
    title: "Aquatic Habitat Wetted Perimeter Share Tool",
    description:
      "Calculate aquatic habitat wetted perimeter share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        habitatPerimeter: { type: "number", minimum: 0 },
        totalWettedPerimeter: { type: "number", exclusiveMinimum: 0 },
        reachLength: { type: "number", minimum: 0 },
      },
      required: ["habitatPerimeter", "totalWettedPerimeter", "reachLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        wettedSurfaceProxy: { type: "number" },
      },
      required: ["fraction", "wettedSurfaceProxy"],
    },
    ports: {
      inputs: [
        {
          id: "habitatPerimeter",
          label: "Habitat Perimeter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalWettedPerimeter",
          label: "Total Wetted Perimeter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reachLength",
          label: "Reach Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        {
          id: "wettedSurfaceProxy",
          label: "Wetted Surface Proxy",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = aquaticHabitatWettedPerimeterShareTool.execute;
export default aquaticHabitatWettedPerimeterShareTool;
