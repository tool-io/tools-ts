import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly collisionProbability: number;
  readonly support: number;
};
export type Output = {
  readonly entropyBits: number;
  readonly maximumBits: number;
  readonly gapBits: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    collisionProbability: { type: "number", exclusiveMinimum: 0, maximum: 1 },
    support: { type: "integer", minimum: 1 },
  },
  required: ["collisionProbability", "support"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    entropyBits: { type: "number" },
    maximumBits: { type: "number" },
    gapBits: { type: "number" },
  },
  required: ["entropyBits", "maximumBits", "gapBits"],
} as const;
/** Calculate collision entropy uniform support gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { collisionProbability, support } = request;
  const compute = (): Output => {
    H.integer(support, 1);
    H.domain(
      collisionProbability > 0 &&
        collisionProbability <= 1 &&
        collisionProbability >= 1 / support - 1e-12,
    );
    const entropyBits = -Math.log2(collisionProbability),
      maximumBits = Math.log2(support);
    return { entropyBits, maximumBits, gapBits: maximumBits - entropyBits };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { collisionProbability: 0.5, support: 4 },
  output: { entropyBits: 1, maximumBits: 2, gapBits: 1 },
} satisfies ToolExample<Input, Output>;
export const collisionEntropyUniformSupportGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information/collision-entropy-uniform-support-gap",
    title: "Collision Entropy Uniform Support Gap Tool",
    description:
      "Calculate collision entropy uniform support gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        collisionProbability: {
          type: "number",
          exclusiveMinimum: 0,
          maximum: 1,
        },
        support: { type: "integer", minimum: 1 },
      },
      required: ["collisionProbability", "support"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        entropyBits: { type: "number" },
        maximumBits: { type: "number" },
        gapBits: { type: "number" },
      },
      required: ["entropyBits", "maximumBits", "gapBits"],
    },
    ports: {
      inputs: [
        {
          id: "collisionProbability",
          label: "Collision Probability",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "support",
          label: "Support",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "entropyBits",
          label: "Entropy Bits",
          valueType: { type: "number" },
        },
        {
          id: "maximumBits",
          label: "Maximum Bits",
          valueType: { type: "number" },
        },
        { id: "gapBits", label: "Gap Bits", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = collisionEntropyUniformSupportGapTool.execute;
export default collisionEntropyUniformSupportGapTool;
