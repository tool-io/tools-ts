import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly leftDistance: number;
  readonly rightDistance: number;
};
export type Output = {
  readonly oppositeParity: boolean;
  readonly oddCycleWitness: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftDistance: { type: "integer", minimum: 0 },
    rightDistance: { type: "integer", minimum: 0 },
  },
  required: ["leftDistance", "rightDistance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oppositeParity: { type: "boolean" },
    oddCycleWitness: { type: "boolean" },
  },
  required: ["oppositeParity", "oddCycleWitness"],
} as const;
/** Compute graph distance parity edge flip from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { leftDistance, rightDistance } = input;
  const compute = (): Output => {
    integer(leftDistance);
    integer(rightDistance);
    domain(Math.abs(leftDistance - rightDistance) <= 1);
    const oppositeParity = leftDistance % 2 !== rightDistance % 2;
    return { oppositeParity, oddCycleWitness: !oppositeParity };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { leftDistance: 2, rightDistance: 3 },
  output: { oppositeParity: true, oddCycleWitness: false },
} satisfies ToolExample<Input, Output>;
export const graphDistanceParityEdgeFlipTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "graph/graph-distance-parity-edge-flip",
  title: "Graph Distance Parity Edge Flip Tool",
  description:
    "Compute graph distance parity edge flip from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "leftDistance",
        label: "Left Distance",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "rightDistance",
        label: "Right Distance",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      {
        id: "oppositeParity",
        label: "Opposite Parity",
        valueType: { type: "boolean" },
      },
      {
        id: "oddCycleWitness",
        label: "Odd Cycle Witness",
        valueType: { type: "boolean" },
      },
    ],
  },
});
export const run = graphDistanceParityEdgeFlipTool.execute;
export default graphDistanceParityEdgeFlipTool;
