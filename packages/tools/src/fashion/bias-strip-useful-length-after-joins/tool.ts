import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stripLengths: readonly number[];
  readonly joinLossPerJoin: number;
};
export type Output = {
  readonly totalUnjoinedLength: number;
  readonly usefulLength: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stripLengths: { type: "array", maxItems: 256, items: { type: "number" } },
    joinLossPerJoin: { type: "number", minimum: 0 },
  },
  required: ["stripLengths", "joinLossPerJoin"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalUnjoinedLength: { type: "number" },
    usefulLength: { type: "number" },
  },
  required: ["totalUnjoinedLength", "usefulLength"],
} as const;
/** Subtract an explicit loss per serial join from supplied bias-strip lengths, retaining an overestimated-loss discrepancy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stripLengths, joinLossPerJoin } = request;
  const compute = (): Output => {
    H.domain(joinLossPerJoin >= 0, "joinLossPerJoin");
    return (() => {
      H.domain(
        stripLengths.every((value) => value >= 0),
        "stripLengths",
      );
      const totalUnjoinedLength = stripLengths.reduce((a, b) => a + b, 0);
      return {
        totalUnjoinedLength,
        usefulLength:
          totalUnjoinedLength -
          Math.max(0, stripLengths.length - 1) * joinLossPerJoin,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stripLengths: [100, 80, 60], joinLossPerJoin: 5 },
  output: { totalUnjoinedLength: 240, usefulLength: 230 },
} satisfies ToolExample<Input, Output>;
export const biasStripUsefulLengthAfterJoinsTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["fashion", "arts and design"],
      keywords: ["fashion", "arts and design"],
    },
    id: "fashion/bias-strip-useful-length-after-joins",
    title: "Bias Strip Useful Length After Joins",
    description:
      "Subtract an explicit loss per serial join from supplied bias-strip lengths, retaining an overestimated-loss discrepancy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stripLengths: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        joinLossPerJoin: { type: "number", minimum: 0 },
      },
      required: ["stripLengths", "joinLossPerJoin"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalUnjoinedLength: { type: "number" },
        usefulLength: { type: "number" },
      },
      required: ["totalUnjoinedLength", "usefulLength"],
    },
    ports: {
      inputs: [
        {
          id: "stripLengths",
          label: "Strip Lengths",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "joinLossPerJoin",
          label: "Join Loss Per Join",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "totalUnjoinedLength",
          label: "Total Unjoined Length",
          valueType: { type: "number" },
        },
        {
          id: "usefulLength",
          label: "Useful Length",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = biasStripUsefulLengthAfterJoinsTool.execute;
export default biasStripUsefulLengthAfterJoinsTool;
