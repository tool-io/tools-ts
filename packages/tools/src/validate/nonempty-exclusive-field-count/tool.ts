import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly values: readonly string[];
  readonly trimForPresence: boolean;
};
export type Output = {
  readonly populatedCount: number;
  readonly exactlyOne: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    values: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    trimForPresence: { type: "boolean" },
  },
  required: ["values", "trimForPresence"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    populatedCount: { type: "integer" },
    exactlyOne: { type: "boolean" },
  },
  required: ["populatedCount", "exactlyOne"],
} as const;
/** Calculate nonempty exclusive field count from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { values, trimForPresence } = request;
  const compute = (): Output => {
    const populatedCount = values.filter(
      (x) => (trimForPresence ? x.trim() : x).length > 0,
    ).length;
    return { populatedCount, exactlyOne: populatedCount === 1 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { values: ["", " A ", ""], trimForPresence: true },
  output: { populatedCount: 1, exactlyOne: true },
} satisfies ToolExample<Input, Output>;
export const nonemptyExclusiveFieldCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "validate/nonempty-exclusive-field-count",
    title: "Nonempty Exclusive Field Count Tool",
    description:
      "Calculate nonempty exclusive field count from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        values: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        trimForPresence: { type: "boolean" },
      },
      required: ["values", "trimForPresence"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        populatedCount: { type: "integer" },
        exactlyOne: { type: "boolean" },
      },
      required: ["populatedCount", "exactlyOne"],
    },
    ports: {
      inputs: [
        {
          id: "values",
          label: "Values",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "trimForPresence",
          label: "Trim For Presence",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "populatedCount",
          label: "Populated Count",
          valueType: { type: "integer" },
        },
        {
          id: "exactlyOne",
          label: "Exactly One",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = nonemptyExclusiveFieldCountTool.execute;
export default nonemptyExclusiveFieldCountTool;
