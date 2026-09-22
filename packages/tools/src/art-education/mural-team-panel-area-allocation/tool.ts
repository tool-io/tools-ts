import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalArea: number;
  readonly weights: readonly number[];
  readonly team: number;
  readonly wasteFraction: number;
};
export type Output = {
  readonly finishedArea: number;
  readonly materialArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalArea: { type: "number", minimum: 0 },
    weights: { type: "array", maxItems: 256, items: { type: "number" } },
    team: { type: "integer", minimum: 0 },
    wasteFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
  },
  required: ["totalArea", "weights", "team", "wasteFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    finishedArea: { type: "number" },
    materialArea: { type: "number" },
  },
  required: ["finishedArea", "materialArea"],
} as const;
/** Calculate mural team panel area allocation from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalArea, weights, team, wasteFraction } = request;
  const compute = (): Output => {
    H.domain(
      totalArea >= 0 &&
        weights.every((x) => x >= 0) &&
        weights.some((x) => x > 0) &&
        wasteFraction >= 0 &&
        wasteFraction < 1,
    );
    H.integer(team, 0, weights.length - 1);
    return {
      finishedArea:
        (totalArea * weights[team]) / weights.reduce((a, b) => a + b, 0),
      materialArea:
        (totalArea * weights[team]) /
        (weights.reduce((a, b) => a + b, 0) * (1 - wasteFraction)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalArea: 100, weights: [1, 2, 1], team: 1, wasteFraction: 0.2 },
  output: { finishedArea: 50, materialArea: 62.5 },
} satisfies ToolExample<Input, Output>;
export const muralTeamPanelAreaAllocationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-education/mural-team-panel-area-allocation",
    title: "Mural Team Panel Area Allocation Tool",
    description:
      "Calculate mural team panel area allocation from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalArea: { type: "number", minimum: 0 },
        weights: { type: "array", maxItems: 256, items: { type: "number" } },
        team: { type: "integer", minimum: 0 },
        wasteFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
      },
      required: ["totalArea", "weights", "team", "wasteFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        finishedArea: { type: "number" },
        materialArea: { type: "number" },
      },
      required: ["finishedArea", "materialArea"],
    },
    ports: {
      inputs: [
        {
          id: "totalArea",
          label: "Total Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "weights",
          label: "Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "team",
          label: "Team",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "wasteFraction",
          label: "Waste Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "finishedArea",
          label: "Finished Area",
          valueType: { type: "number" },
        },
        {
          id: "materialArea",
          label: "Material Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = muralTeamPanelAreaAllocationTool.execute;
export default muralTeamPanelAreaAllocationTool;
