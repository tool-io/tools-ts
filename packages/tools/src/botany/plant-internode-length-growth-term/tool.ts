import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstLength: number;
  readonly secondLength: number;
  readonly elapsedDays: number;
  readonly initialNodeCount: number;
  readonly newNodeCount: number;
};
export type Output = {
  readonly lengthIncrement: number;
  readonly elongationPerDay: number;
  readonly nodesAdded: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstLength: { type: "number", minimum: 0 },
    secondLength: { type: "number", minimum: 0 },
    elapsedDays: { type: "number", exclusiveMinimum: 0 },
    initialNodeCount: { type: "integer", minimum: 0 },
    newNodeCount: { type: "integer", minimum: 0 },
  },
  required: [
    "firstLength",
    "secondLength",
    "elapsedDays",
    "initialNodeCount",
    "newNodeCount",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lengthIncrement: { type: "number" },
    elongationPerDay: { type: "number" },
    nodesAdded: { type: "integer" },
  },
  required: ["lengthIncrement", "elongationPerDay", "nodesAdded"],
} as const;
/** Calculate plant internode length growth term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstLength,
    secondLength,
    elapsedDays,
    initialNodeCount,
    newNodeCount,
  } = request;
  const compute = (): Output => {
    H.domain(firstLength >= 0 && secondLength >= 0);
    H.positive(elapsedDays);
    H.integer(initialNodeCount, 0);
    H.integer(newNodeCount, 0);
    return {
      lengthIncrement: secondLength - firstLength,
      elongationPerDay: (secondLength - firstLength) / elapsedDays,
      nodesAdded: newNodeCount - initialNodeCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstLength: 10,
    secondLength: 16,
    elapsedDays: 3,
    initialNodeCount: 4,
    newNodeCount: 6,
  },
  output: { lengthIncrement: 6, elongationPerDay: 2, nodesAdded: 2 },
} satisfies ToolExample<Input, Output>;
export const plantInternodeLengthGrowthTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "botany/plant-internode-length-growth-term",
    title: "Plant Internode Length Growth Term Tool",
    description:
      "Calculate plant internode length growth term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstLength: { type: "number", minimum: 0 },
        secondLength: { type: "number", minimum: 0 },
        elapsedDays: { type: "number", exclusiveMinimum: 0 },
        initialNodeCount: { type: "integer", minimum: 0 },
        newNodeCount: { type: "integer", minimum: 0 },
      },
      required: [
        "firstLength",
        "secondLength",
        "elapsedDays",
        "initialNodeCount",
        "newNodeCount",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lengthIncrement: { type: "number" },
        elongationPerDay: { type: "number" },
        nodesAdded: { type: "integer" },
      },
      required: ["lengthIncrement", "elongationPerDay", "nodesAdded"],
    },
    ports: {
      inputs: [
        {
          id: "firstLength",
          label: "First Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondLength",
          label: "Second Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "elapsedDays",
          label: "Elapsed Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "initialNodeCount",
          label: "Initial Node Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "newNodeCount",
          label: "New Node Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "lengthIncrement",
          label: "Length Increment",
          valueType: { type: "number" },
        },
        {
          id: "elongationPerDay",
          label: "Elongation Per Day",
          valueType: { type: "number" },
        },
        {
          id: "nodesAdded",
          label: "Nodes Added",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = plantInternodeLengthGrowthTermTool.execute;
export default plantInternodeLengthGrowthTermTool;
