import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly shadedArea: number;
  readonly totalPlotArea: number;
  readonly understoryArea: number;
  readonly useUnderstory: boolean;
};
export type Output = {
  readonly shadeFraction: number;
  readonly denominator: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shadedArea: { type: "number", minimum: 0 },
    totalPlotArea: { type: "number", exclusiveMinimum: 0 },
    understoryArea: { type: "number", exclusiveMinimum: 0 },
    useUnderstory: { type: "boolean" },
  },
  required: ["shadedArea", "totalPlotArea", "understoryArea", "useUnderstory"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shadeFraction: { type: "number" },
    denominator: { type: "number" },
  },
  required: ["shadeFraction", "denominator"],
} as const;
/** Calculate understory shade base flag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { shadedArea, totalPlotArea, understoryArea, useUnderstory } = request;
  const compute = (): Output => {
    H.positive(totalPlotArea);
    H.positive(understoryArea);
    H.domain(
      shadedArea >= 0 &&
        shadedArea <= understoryArea &&
        understoryArea <= totalPlotArea,
    );
    return {
      shadeFraction:
        shadedArea / (useUnderstory ? understoryArea : totalPlotArea),
      denominator: useUnderstory ? understoryArea : totalPlotArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    shadedArea: 20,
    totalPlotArea: 100,
    understoryArea: 40,
    useUnderstory: true,
  },
  output: { shadeFraction: 0.5, denominator: 40 },
} satisfies ToolExample<Input, Output>;
export const understoryShadeBaseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroforestry/understory-shade-base-flag",
    title: "Understory Shade Base Flag Tool",
    description:
      "Calculate understory shade base flag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shadedArea: { type: "number", minimum: 0 },
        totalPlotArea: { type: "number", exclusiveMinimum: 0 },
        understoryArea: { type: "number", exclusiveMinimum: 0 },
        useUnderstory: { type: "boolean" },
      },
      required: [
        "shadedArea",
        "totalPlotArea",
        "understoryArea",
        "useUnderstory",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shadeFraction: { type: "number" },
        denominator: { type: "number" },
      },
      required: ["shadeFraction", "denominator"],
    },
    ports: {
      inputs: [
        {
          id: "shadedArea",
          label: "Shaded Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalPlotArea",
          label: "Total Plot Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "understoryArea",
          label: "Understory Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "useUnderstory",
          label: "Use Understory",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "shadeFraction",
          label: "Shade Fraction",
          valueType: { type: "number" },
        },
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = understoryShadeBaseFlagTool.execute;
export default understoryShadeBaseFlagTool;
