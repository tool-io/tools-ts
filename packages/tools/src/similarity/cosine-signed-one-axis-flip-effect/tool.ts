import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dot: number;
  readonly firstAxis: number;
  readonly secondAxis: number;
  readonly firstNorm: number;
  readonly secondNorm: number;
};
export type Output = {
  readonly newDot: number;
  readonly newCosine: number;
  readonly delta: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dot: { type: "number" },
    firstAxis: { type: "number" },
    secondAxis: { type: "number" },
    firstNorm: { type: "number", exclusiveMinimum: 0 },
    secondNorm: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["dot", "firstAxis", "secondAxis", "firstNorm", "secondNorm"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    newDot: { type: "number" },
    newCosine: { type: "number" },
    delta: { type: "number" },
  },
  required: ["newDot", "newCosine", "delta"],
} as const;
/** Calculate cosine signed one axis flip effect from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dot, firstAxis, secondAxis, firstNorm, secondNorm } = request;
  const compute = (): Output => {
    H.positive(firstNorm);
    H.positive(secondNorm);
    H.domain(
      Math.abs(firstAxis) <= firstNorm &&
        Math.abs(secondAxis) <= secondNorm &&
        Math.abs(dot) <= firstNorm * secondNorm,
    );
    const newDot = dot - 2 * firstAxis * secondAxis;
    H.domain(Math.abs(newDot) <= firstNorm * secondNorm + 1e-12);
    return {
      newDot,
      newCosine: newDot / (firstNorm * secondNorm),
      delta: (-2 * firstAxis * secondAxis) / (firstNorm * secondNorm),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dot: 5, firstAxis: 1, secondAxis: 2, firstNorm: 3, secondNorm: 4 },
  output: {
    newDot: 1,
    newCosine: 0.08333333333333333,
    delta: -0.3333333333333333,
  },
} satisfies ToolExample<Input, Output>;
export const cosineSignedOneAxisFlipEffectTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "similarity/cosine-signed-one-axis-flip-effect",
    title: "Cosine Signed One Axis Flip Effect Tool",
    description:
      "Calculate cosine signed one axis flip effect from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dot: { type: "number" },
        firstAxis: { type: "number" },
        secondAxis: { type: "number" },
        firstNorm: { type: "number", exclusiveMinimum: 0 },
        secondNorm: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["dot", "firstAxis", "secondAxis", "firstNorm", "secondNorm"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        newDot: { type: "number" },
        newCosine: { type: "number" },
        delta: { type: "number" },
      },
      required: ["newDot", "newCosine", "delta"],
    },
    ports: {
      inputs: [
        {
          id: "dot",
          label: "Dot",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstAxis",
          label: "First Axis",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondAxis",
          label: "Second Axis",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstNorm",
          label: "First Norm",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondNorm",
          label: "Second Norm",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "newDot", label: "New Dot", valueType: { type: "number" } },
        { id: "newCosine", label: "New Cosine", valueType: { type: "number" } },
        { id: "delta", label: "Delta", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cosineSignedOneAxisFlipEffectTool.execute;
export default cosineSignedOneAxisFlipEffectTool;
