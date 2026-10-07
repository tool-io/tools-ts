import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rightReaches: number;
  readonly leftReaches: number;
};
export type Output = {
  readonly lateralityIndex: number;
  readonly totalReaches: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rightReaches: { type: "integer", minimum: 0 },
    leftReaches: { type: "integer", minimum: 0 },
  },
  required: ["rightReaches", "leftReaches"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lateralityIndex: { type: "number" },
    totalReaches: { type: "integer" },
  },
  required: ["lateralityIndex", "totalReaches"],
} as const;
/** Compute the supplied right-minus-left reach count divided by total reaches without diagnosing handedness or development. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rightReaches, leftReaches } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(rightReaches) &&
        rightReaches >= 0 &&
        rightReaches <= Number.MAX_SAFE_INTEGER,
      "rightReaches",
    ),
      rightReaches);
    (H.domain(
      Number.isSafeInteger(leftReaches) &&
        leftReaches >= 0 &&
        leftReaches <= Number.MAX_SAFE_INTEGER,
      "leftReaches",
    ),
      leftReaches);
    H.domain(rightReaches + leftReaches > 0, "rightReaches");
    return {
      lateralityIndex:
        (rightReaches - leftReaches) / (rightReaches + leftReaches),
      totalReaches: Number(BigInt(rightReaches) + BigInt(leftReaches)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rightReaches: 6, leftReaches: 2 },
  output: { lateralityIndex: 0.5, totalReaches: 8 },
} satisfies ToolExample<Input, Output>;
export const infantReachingLateralityIndexTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["child-development", "child development", "psychology"],
      keywords: ["child development", "psychology"],
    },
    id: "child-development/infant-reaching-laterality-index",
    title: "Infant Reaching Laterality Index",
    description:
      "Compute the supplied right-minus-left reach count divided by total reaches without diagnosing handedness or development.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rightReaches: { type: "integer", minimum: 0 },
        leftReaches: { type: "integer", minimum: 0 },
      },
      required: ["rightReaches", "leftReaches"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lateralityIndex: { type: "number" },
        totalReaches: { type: "integer" },
      },
      required: ["lateralityIndex", "totalReaches"],
    },
    ports: {
      inputs: [
        {
          id: "rightReaches",
          label: "Right Reaches",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "leftReaches",
          label: "Left Reaches",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "lateralityIndex",
          label: "Laterality Index",
          valueType: { type: "number" },
        },
        {
          id: "totalReaches",
          label: "Total Reaches",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = infantReachingLateralityIndexTool.execute;
export default infantReachingLateralityIndexTool;
