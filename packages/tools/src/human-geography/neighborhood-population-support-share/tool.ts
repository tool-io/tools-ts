import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly populations: readonly number[];
  readonly boundaryMatched: readonly boolean[];
  readonly periodMatched: readonly boolean[];
};
export type Output = {
  readonly populationTotal: number;
  readonly supportedPopulation: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    populations: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    boundaryMatched: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    periodMatched: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["populations", "boundaryMatched", "periodMatched"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    populationTotal: { type: "number" },
    supportedPopulation: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["populationTotal", "supportedPopulation", "share", "defined"],
} as const;
/** Calculate neighborhood population support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { populations, boundaryMatched, periodMatched } = request;
  const compute = (): Output => {
    H.sameLength(populations, boundaryMatched);
    H.sameLength(populations, periodMatched);
    H.domain(populations.every((x) => x >= 0));
    return (() => {
      const populationTotal = populations.reduce((a, b) => a + b, 0),
        supportedPopulation = populations.reduce(
          (s, x, i) => s + (boundaryMatched[i] && periodMatched[i] ? x : 0),
          0,
        );
      return {
        populationTotal,
        supportedPopulation,
        share: populationTotal > 0 ? supportedPopulation / populationTotal : 0,
        defined: populationTotal > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    populations: [10, 20, 30],
    boundaryMatched: [true, true, false],
    periodMatched: [true, false, true],
  },
  output: {
    populationTotal: 60,
    supportedPopulation: 10,
    share: 0.16666666666666666,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const neighborhoodPopulationSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "human-geography/neighborhood-population-support-share",
    title: "Neighborhood Population Support Share Tool",
    description:
      "Calculate neighborhood population support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        populations: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        boundaryMatched: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        periodMatched: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["populations", "boundaryMatched", "periodMatched"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        populationTotal: { type: "number" },
        supportedPopulation: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["populationTotal", "supportedPopulation", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "populations",
          label: "Populations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "boundaryMatched",
          label: "Boundary Matched",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "periodMatched",
          label: "Period Matched",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "populationTotal",
          label: "Population Total",
          valueType: { type: "number" },
        },
        {
          id: "supportedPopulation",
          label: "Supported Population",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = neighborhoodPopulationSupportShareTool.execute;
export default neighborhoodPopulationSupportShareTool;
