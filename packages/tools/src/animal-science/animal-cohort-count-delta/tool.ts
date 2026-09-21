import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initial: number;
  readonly entries: number;
  readonly exits: number;
};
export type Output = { readonly finalCount: number; readonly delta: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initial: { type: "integer", minimum: 0 },
    entries: { type: "integer", minimum: 0 },
    exits: { type: "integer", minimum: 0 },
  },
  required: ["initial", "entries", "exits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { finalCount: { type: "integer" }, delta: { type: "integer" } },
  required: ["finalCount", "delta"],
} as const;
/** Calculate animal cohort count delta from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initial, entries, exits } = request;
  const compute = (): Output => {
    H.integer(initial, 0);
    H.integer(entries, 0);
    H.integer(exits, 0);
    const final = BigInt(initial) + BigInt(entries) - BigInt(exits);
    H.domain(final >= 0n);
    return {
      finalCount: Number(final),
      delta: Number(BigInt(entries) - BigInt(exits)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { initial: 100, entries: 12, exits: 7 },
  output: { finalCount: 105, delta: 5 },
} satisfies ToolExample<Input, Output>;
export const animalCohortCountDeltaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "animal-science/animal-cohort-count-delta",
    title: "Animal Cohort Count Delta Tool",
    description:
      "Calculate animal cohort count delta from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initial: { type: "integer", minimum: 0 },
        entries: { type: "integer", minimum: 0 },
        exits: { type: "integer", minimum: 0 },
      },
      required: ["initial", "entries", "exits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        finalCount: { type: "integer" },
        delta: { type: "integer" },
      },
      required: ["finalCount", "delta"],
    },
    ports: {
      inputs: [
        {
          id: "initial",
          label: "Initial",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "entries",
          label: "Entries",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "exits",
          label: "Exits",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "finalCount",
          label: "Final Count",
          valueType: { type: "integer" },
        },
        { id: "delta", label: "Delta", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = animalCohortCountDeltaTool.execute;
export default animalCohortCountDeltaTool;
