import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const distanceToNextPowerOfTwoTool = createSimpleTool({
  id: "arithmetic/distance-to-next-power-of-two",
  title: "Distance to Next Power of Two Calculator",
  description:
    "Calculate how far a nonnegative integer is from the next power of two that is greater than or equal to it.",
  inputs: [{ id: "value", label: "Integer", kind: "integer", minimum: 0 }],
  outputs: [{ id: "distance", label: "Distance", kind: "integer" }],
  calculate: (input) => {
    const value = input.value as number;
    let power = 1;
    while (power < value) power *= 2;
    return { distance: power - value };
  },
});
export const runDistanceToNextPowerOfTwo = distanceToNextPowerOfTwoTool.execute;
export default distanceToNextPowerOfTwoTool;

export type DistanceToNextPowerOfTwoInput = {
  readonly value: number;
};

export type DistanceToNextPowerOfTwoOutput = {
  readonly distance: number;
};

export const distanceToNextPowerOfTwoExample = {
  input: {
    value: 1,
  },
  output: {
    distance: 0,
  },
} satisfies ToolExample<
  DistanceToNextPowerOfTwoInput,
  DistanceToNextPowerOfTwoOutput
>;
