import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly original: number;
  readonly revised: number;
  readonly duplicatesRemoved: number;
  readonly lateAdded: number;
};
export type Output = {
  readonly publishedDelta: number;
  readonly unexplainedDelta: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    original: { type: "integer", minimum: 0 },
    revised: { type: "integer", minimum: 0 },
    duplicatesRemoved: { type: "integer", minimum: 0 },
    lateAdded: { type: "integer", minimum: 0 },
  },
  required: ["original", "revised", "duplicatesRemoved", "lateAdded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    publishedDelta: { type: "integer" },
    unexplainedDelta: { type: "integer" },
  },
  required: ["publishedDelta", "unexplainedDelta"],
} as const;
/** Calculate migration flow revision delta from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { original, revised, duplicatesRemoved, lateAdded } = request;
  const compute = (): Output => {
    H.integer(original, 0);
    H.integer(revised, 0);
    H.integer(duplicatesRemoved, 0);
    H.integer(lateAdded, 0);
    return {
      publishedDelta: revised - original,
      unexplainedDelta: revised - original + duplicatesRemoved - lateAdded,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { original: 100, revised: 110, duplicatesRemoved: 5, lateAdded: 15 },
  output: { publishedDelta: 10, unexplainedDelta: 0 },
} satisfies ToolExample<Input, Output>;
export const migrationFlowRevisionDeltaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "global-studies/migration-flow-revision-delta",
    title: "Migration Flow Revision Delta Tool",
    description:
      "Calculate migration flow revision delta from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        original: { type: "integer", minimum: 0 },
        revised: { type: "integer", minimum: 0 },
        duplicatesRemoved: { type: "integer", minimum: 0 },
        lateAdded: { type: "integer", minimum: 0 },
      },
      required: ["original", "revised", "duplicatesRemoved", "lateAdded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        publishedDelta: { type: "integer" },
        unexplainedDelta: { type: "integer" },
      },
      required: ["publishedDelta", "unexplainedDelta"],
    },
    ports: {
      inputs: [
        {
          id: "original",
          label: "Original",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "revised",
          label: "Revised",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "duplicatesRemoved",
          label: "Duplicates Removed",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "lateAdded",
          label: "Late Added",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "publishedDelta",
          label: "Published Delta",
          valueType: { type: "integer" },
        },
        {
          id: "unexplainedDelta",
          label: "Unexplained Delta",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = migrationFlowRevisionDeltaTool.execute;
export default migrationFlowRevisionDeltaTool;
