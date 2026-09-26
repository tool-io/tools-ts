import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly feed: number;
  readonly permeate: number;
  readonly recycleReject: number;
};
export type Output = {
  readonly grossReject: number;
  readonly netReject: number;
  readonly recovery: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    feed: { type: "number", exclusiveMinimum: 0 },
    permeate: { type: "number", minimum: 0 },
    recycleReject: { type: "number", minimum: 0 },
  },
  required: ["feed", "permeate", "recycleReject"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossReject: { type: "number" },
    netReject: { type: "number" },
    recovery: { type: "number" },
  },
  required: ["grossReject", "netReject", "recovery"],
} as const;
/** Calculate membrane recovery reject base from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { feed, permeate, recycleReject } = request;
  const compute = (): Output => {
    H.positive(feed);
    H.domain(
      permeate >= 0 &&
        permeate <= feed &&
        recycleReject >= 0 &&
        recycleReject <= feed - permeate,
    );
    return {
      grossReject: feed - permeate,
      netReject: feed - permeate - recycleReject,
      recovery: permeate / feed,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { feed: 100, permeate: 60, recycleReject: 10 },
  output: { grossReject: 40, netReject: 30, recovery: 0.6 },
} satisfies ToolExample<Input, Output>;
export const membraneRecoveryRejectBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-engineering/membrane-recovery-reject-base",
    title: "Membrane Recovery Reject Base Tool",
    description:
      "Calculate membrane recovery reject base from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        feed: { type: "number", exclusiveMinimum: 0 },
        permeate: { type: "number", minimum: 0 },
        recycleReject: { type: "number", minimum: 0 },
      },
      required: ["feed", "permeate", "recycleReject"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossReject: { type: "number" },
        netReject: { type: "number" },
        recovery: { type: "number" },
      },
      required: ["grossReject", "netReject", "recovery"],
    },
    ports: {
      inputs: [
        {
          id: "feed",
          label: "Feed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "permeate",
          label: "Permeate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recycleReject",
          label: "Recycle Reject",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "grossReject",
          label: "Gross Reject",
          valueType: { type: "number" },
        },
        { id: "netReject", label: "Net Reject", valueType: { type: "number" } },
        { id: "recovery", label: "Recovery", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = membraneRecoveryRejectBaseTool.execute;
export default membraneRecoveryRejectBaseTool;
