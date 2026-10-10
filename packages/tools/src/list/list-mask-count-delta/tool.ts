import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly beforeMask: readonly boolean[];
  readonly afterMask: readonly boolean[];
};
export type Output = {
  readonly selectedBefore: number;
  readonly selectedAfter: number;
  readonly delta: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    beforeMask: { type: "array", maxItems: 256, items: { type: "boolean" } },
    afterMask: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["beforeMask", "afterMask"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    selectedBefore: { type: "integer" },
    selectedAfter: { type: "integer" },
    delta: { type: "integer" },
  },
  required: ["selectedBefore", "selectedAfter", "delta"],
} as const;
/** Compare explicit Boolean list-mask selection counts after validating equal mask lengths. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { beforeMask, afterMask } = request;
  const compute = (): Output => {
    return (() => {
      H.domain(beforeMask.length === afterMask.length, "afterMask");
      const selectedBefore = beforeMask.filter(Boolean).length,
        selectedAfter = afterMask.filter(Boolean).length;
      return {
        selectedBefore,
        selectedAfter,
        delta: selectedAfter - selectedBefore,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { beforeMask: [true, false, false], afterMask: [true, true, false] },
  output: { selectedBefore: 1, selectedAfter: 2, delta: 1 },
} satisfies ToolExample<Input, Output>;
export const listMaskCountDeltaTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["list", "computer science"],
      keywords: ["list", "computer science"],
    },
    id: "list/list-mask-count-delta",
    title: "List Mask Count Delta",
    description:
      "Compare explicit Boolean list-mask selection counts after validating equal mask lengths.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        beforeMask: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        afterMask: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["beforeMask", "afterMask"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        selectedBefore: { type: "integer" },
        selectedAfter: { type: "integer" },
        delta: { type: "integer" },
      },
      required: ["selectedBefore", "selectedAfter", "delta"],
    },
    ports: {
      inputs: [
        {
          id: "beforeMask",
          label: "Before Mask",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "afterMask",
          label: "After Mask",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "selectedBefore",
          label: "Selected Before",
          valueType: { type: "integer" },
        },
        {
          id: "selectedAfter",
          label: "Selected After",
          valueType: { type: "integer" },
        },
        { id: "delta", label: "Delta", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = listMaskCountDeltaTool.execute;
export default listMaskCountDeltaTool;
