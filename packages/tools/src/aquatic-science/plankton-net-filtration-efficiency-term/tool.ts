import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly mouthArea: number;
  readonly towDistance: number;
  readonly efficiency: number;
  readonly organisms: number;
};
export type Output = {
  readonly filteredVolume: number;
  readonly density: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mouthArea: { type: "number", exclusiveMinimum: 0 },
    towDistance: { type: "number", exclusiveMinimum: 0 },
    efficiency: { type: "number", exclusiveMinimum: 0, maximum: 1 },
    organisms: { type: "integer", minimum: 0 },
  },
  required: ["mouthArea", "towDistance", "efficiency", "organisms"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    filteredVolume: { type: "number" },
    density: { type: "number" },
  },
  required: ["filteredVolume", "density"],
} as const;
/** Calculate plankton net filtration efficiency term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { mouthArea, towDistance, efficiency, organisms } = request;
  const compute = (): Output => {
    H.positive(mouthArea);
    H.positive(towDistance);
    H.domain(efficiency > 0 && efficiency <= 1);
    H.integer(organisms, 0);
    return {
      filteredVolume: mouthArea * towDistance * efficiency,
      density: organisms / (mouthArea * towDistance * efficiency),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { mouthArea: 0.5, towDistance: 100, efficiency: 0.8, organisms: 400 },
  output: { filteredVolume: 40, density: 10 },
} satisfies ToolExample<Input, Output>;
export const planktonNetFiltrationEfficiencyTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "aquatic-science/plankton-net-filtration-efficiency-term",
      title: "Plankton Net Filtration Efficiency Term Tool",
      description:
        "Calculate plankton net filtration efficiency term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          mouthArea: { type: "number", exclusiveMinimum: 0 },
          towDistance: { type: "number", exclusiveMinimum: 0 },
          efficiency: { type: "number", exclusiveMinimum: 0, maximum: 1 },
          organisms: { type: "integer", minimum: 0 },
        },
        required: ["mouthArea", "towDistance", "efficiency", "organisms"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          filteredVolume: { type: "number" },
          density: { type: "number" },
        },
        required: ["filteredVolume", "density"],
      },
      ports: {
        inputs: [
          {
            id: "mouthArea",
            label: "Mouth Area",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "towDistance",
            label: "Tow Distance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "efficiency",
            label: "Efficiency",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "organisms",
            label: "Organisms",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "filteredVolume",
            label: "Filtered Volume",
            valueType: { type: "number" },
          },
          { id: "density", label: "Density", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = planktonNetFiltrationEfficiencyTermTool.execute;
export default planktonNetFiltrationEfficiencyTermTool;
