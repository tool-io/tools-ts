import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly flow: number;
  readonly area: number;
  readonly activeFraction: number;
};
export type Output = { readonly activeArea: number; readonly loading: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    flow: { type: "number", minimum: 0 },
    area: { type: "number", exclusiveMinimum: 0 },
    activeFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: ["flow", "area", "activeFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { activeArea: { type: "number" }, loading: { type: "number" } },
  required: ["activeArea", "loading"],
} as const;
/** Calculate wastewater hydraulic loading area term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { flow, area, activeFraction } = request;
  const compute = (): Output => {
    H.domain(flow >= 0 && activeFraction > 0 && activeFraction <= 1);
    H.positive(area);
    return {
      activeArea: area * activeFraction,
      loading: flow / (area * activeFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { flow: 1000, area: 200, activeFraction: 0.8 },
  output: { activeArea: 160, loading: 6.25 },
} satisfies ToolExample<Input, Output>;
export const wastewaterHydraulicLoadingAreaTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-engineering/wastewater-hydraulic-loading-area-term",
    title: "Wastewater Hydraulic Loading Area Term Tool",
    description:
      "Calculate wastewater hydraulic loading area term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        flow: { type: "number", minimum: 0 },
        area: { type: "number", exclusiveMinimum: 0 },
        activeFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
      },
      required: ["flow", "area", "activeFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        activeArea: { type: "number" },
        loading: { type: "number" },
      },
      required: ["activeArea", "loading"],
    },
    ports: {
      inputs: [
        {
          id: "flow",
          label: "Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "area",
          label: "Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "activeFraction",
          label: "Active Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "activeArea",
          label: "Active Area",
          valueType: { type: "number" },
        },
        { id: "loading", label: "Loading", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = wastewaterHydraulicLoadingAreaTermTool.execute;
export default wastewaterHydraulicLoadingAreaTermTool;
