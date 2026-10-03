import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly interiorPopulation: number;
  readonly boundaryPopulation: number;
  readonly coveredInterior: number;
  readonly coveredBoundary: number;
  readonly boundaryWeight: number;
};
export type Output = {
  readonly weightedPopulation: number;
  readonly weightedCovered: number;
  readonly coverage: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    interiorPopulation: { type: "number", minimum: 0 },
    boundaryPopulation: { type: "number", minimum: 0 },
    coveredInterior: { type: "number", minimum: 0 },
    coveredBoundary: { type: "number", minimum: 0 },
    boundaryWeight: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "interiorPopulation",
    "boundaryPopulation",
    "coveredInterior",
    "coveredBoundary",
    "boundaryWeight",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weightedPopulation: { type: "number" },
    weightedCovered: { type: "number" },
    coverage: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["weightedPopulation", "weightedCovered", "coverage", "defined"],
} as const;
/** Calculate service coverage boundary weight term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    interiorPopulation,
    boundaryPopulation,
    coveredInterior,
    coveredBoundary,
    boundaryWeight,
  } = request;
  const compute = (): Output => {
    H.probability(boundaryWeight);
    H.domain(
      interiorPopulation >= 0 &&
        boundaryPopulation >= 0 &&
        coveredInterior >= 0 &&
        coveredInterior <= interiorPopulation &&
        coveredBoundary >= 0 &&
        coveredBoundary <= boundaryPopulation,
    );
    return {
      weightedPopulation:
        interiorPopulation + boundaryPopulation * boundaryWeight,
      weightedCovered: coveredInterior + coveredBoundary * boundaryWeight,
      coverage:
        interiorPopulation + boundaryPopulation * boundaryWeight > 0
          ? (coveredInterior + coveredBoundary * boundaryWeight) /
            (interiorPopulation + boundaryPopulation * boundaryWeight)
          : 0,
      defined: interiorPopulation + boundaryPopulation * boundaryWeight > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    interiorPopulation: 80,
    boundaryPopulation: 20,
    coveredInterior: 40,
    coveredBoundary: 10,
    boundaryWeight: 0.5,
  },
  output: {
    weightedPopulation: 90,
    weightedCovered: 45,
    coverage: 0.5,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const serviceCoverageBoundaryWeightTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-health/service-coverage-boundary-weight-term",
    title: "Service Coverage Boundary Weight Term Tool",
    description:
      "Calculate service coverage boundary weight term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        interiorPopulation: { type: "number", minimum: 0 },
        boundaryPopulation: { type: "number", minimum: 0 },
        coveredInterior: { type: "number", minimum: 0 },
        coveredBoundary: { type: "number", minimum: 0 },
        boundaryWeight: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "interiorPopulation",
        "boundaryPopulation",
        "coveredInterior",
        "coveredBoundary",
        "boundaryWeight",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weightedPopulation: { type: "number" },
        weightedCovered: { type: "number" },
        coverage: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "weightedPopulation",
        "weightedCovered",
        "coverage",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "interiorPopulation",
          label: "Interior Population",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "boundaryPopulation",
          label: "Boundary Population",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "coveredInterior",
          label: "Covered Interior",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "coveredBoundary",
          label: "Covered Boundary",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "boundaryWeight",
          label: "Boundary Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "weightedPopulation",
          label: "Weighted Population",
          valueType: { type: "number" },
        },
        {
          id: "weightedCovered",
          label: "Weighted Covered",
          valueType: { type: "number" },
        },
        { id: "coverage", label: "Coverage", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = serviceCoverageBoundaryWeightTermTool.execute;
export default serviceCoverageBoundaryWeightTermTool;
