import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly evaporationDepth: number;
  readonly meanSurfaceArea: number;
};
export type Output = { readonly volumeLoss: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    evaporationDepth: { type: "number", minimum: 0 },
    meanSurfaceArea: { type: "number", minimum: 0 },
  },
  required: ["evaporationDepth", "meanSurfaceArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { volumeLoss: { type: "number" } },
  required: ["volumeLoss"],
} as const;
/** Calculate reservoir evaporation level area term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { evaporationDepth, meanSurfaceArea } = request;
  const compute = (): Output => {
    H.domain(evaporationDepth >= 0 && meanSurfaceArea >= 0);
    return { volumeLoss: evaporationDepth * meanSurfaceArea };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { evaporationDepth: 0.01, meanSurfaceArea: 20000 },
  output: { volumeLoss: 200 },
} satisfies ToolExample<Input, Output>;
export const reservoirEvaporationLevelAreaTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrology/reservoir-evaporation-level-area-term",
    title: "Reservoir Evaporation Level Area Term Tool",
    description:
      "Calculate reservoir evaporation level area term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        evaporationDepth: { type: "number", minimum: 0 },
        meanSurfaceArea: { type: "number", minimum: 0 },
      },
      required: ["evaporationDepth", "meanSurfaceArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { volumeLoss: { type: "number" } },
      required: ["volumeLoss"],
    },
    ports: {
      inputs: [
        {
          id: "evaporationDepth",
          label: "Evaporation Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "meanSurfaceArea",
          label: "Mean Surface Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "volumeLoss",
          label: "Volume Loss",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = reservoirEvaporationLevelAreaTermTool.execute;
export default reservoirEvaporationLevelAreaTermTool;
