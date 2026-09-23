import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly collectedDuration: number;
  readonly eligibleDuration: number;
};
export type Output = { readonly share: number; readonly defined: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    collectedDuration: { type: "number", minimum: 0 },
    eligibleDuration: { type: "number", minimum: 0 },
  },
  required: ["collectedDuration", "eligibleDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" }, defined: { type: "boolean" } },
  required: ["share", "defined"],
} as const;
/** Calculate collection window time share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { collectedDuration, eligibleDuration } = request;
  const compute = (): Output => {
    H.domain(
      eligibleDuration >= 0 &&
        collectedDuration >= 0 &&
        collectedDuration <= eligibleDuration,
    );
    return {
      share: eligibleDuration > 0 ? collectedDuration / eligibleDuration : 0,
      defined: eligibleDuration > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { collectedDuration: 15, eligibleDuration: 20 },
  output: { share: 0.75, defined: true },
} satisfies ToolExample<Input, Output>;
export const collectionWindowTimeShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biomonitoring/collection-window-time-share",
    title: "Collection Window Time Share Tool",
    description:
      "Calculate collection window time share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        collectedDuration: { type: "number", minimum: 0 },
        eligibleDuration: { type: "number", minimum: 0 },
      },
      required: ["collectedDuration", "eligibleDuration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" }, defined: { type: "boolean" } },
      required: ["share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "collectedDuration",
          label: "Collected Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "eligibleDuration",
          label: "Eligible Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = collectionWindowTimeShareTool.execute;
export default collectionWindowTimeShareTool;
