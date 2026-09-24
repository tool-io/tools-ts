import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly subjectIndex: number;
  readonly blockSize: number;
  readonly origin: number;
};
export type Output = {
  readonly block: number;
  readonly slot: number;
  readonly firstSubject: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    subjectIndex: { type: "integer" },
    blockSize: { type: "integer", minimum: 1 },
    origin: { type: "integer", minimum: 0, maximum: 1 },
  },
  required: ["subjectIndex", "blockSize", "origin"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    block: { type: "integer" },
    slot: { type: "integer" },
    firstSubject: { type: "integer" },
  },
  required: ["block", "slot", "firstSubject"],
} as const;
/** Locate a supplied sequence index in fixed blocks without generating assignments. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { subjectIndex, blockSize, origin } = request;
  const compute = (): Output => {
    H.integer(blockSize, 1);
    H.integer(origin, 0, 1);
    H.integer(subjectIndex, origin);
    const n = BigInt(subjectIndex) - BigInt(origin),
      size = BigInt(blockSize),
      block = Number(n / size),
      slot = Number(n % size);
    return {
      block,
      slot,
      firstSubject: Number((n / size) * size + BigInt(origin)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { subjectIndex: 12, blockSize: 4, origin: 1 },
  output: { block: 2, slot: 3, firstSubject: 9 },
} satisfies ToolExample<Input, Output>;
export const researchRandomizationBlockSlotIndexTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "clinical-research/research-randomization-block-slot-index",
      title: "Research Randomization Block Slot Index Tool",
      description:
        "Locate a supplied sequence index in fixed blocks without generating assignments.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          subjectIndex: { type: "integer" },
          blockSize: { type: "integer", minimum: 1 },
          origin: { type: "integer", minimum: 0, maximum: 1 },
        },
        required: ["subjectIndex", "blockSize", "origin"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          block: { type: "integer" },
          slot: { type: "integer" },
          firstSubject: { type: "integer" },
        },
        required: ["block", "slot", "firstSubject"],
      },
      ports: {
        inputs: [
          {
            id: "subjectIndex",
            label: "Subject Index",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "blockSize",
            label: "Block Size",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "origin",
            label: "Origin",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "block", label: "Block", valueType: { type: "integer" } },
          { id: "slot", label: "Slot", valueType: { type: "integer" } },
          {
            id: "firstSubject",
            label: "First Subject",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = researchRandomizationBlockSlotIndexTool.execute;
export default researchRandomizationBlockSlotIndexTool;
