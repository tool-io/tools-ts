import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly index: number; readonly stepCount: number };
export type Output = {
  readonly oneBasedPosition: number;
  readonly first: boolean;
  readonly last: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    index: { type: "integer", minimum: 0 },
    stepCount: { type: "integer", minimum: 1 },
  },
  required: ["index", "stepCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oneBasedPosition: { type: "integer" },
    first: { type: "boolean" },
    last: { type: "boolean" },
  },
  required: ["oneBasedPosition", "first", "last"],
} as const;
/** Describe one indexed step in an explicitly supplied public ritual sequence without choosing or disclosing ritual content. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { index, stepCount } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(stepCount) &&
        stepCount >= 1 &&
        stepCount <= Number.MAX_SAFE_INTEGER,
      "stepCount",
    ),
      stepCount);
    (H.domain(
      Number.isSafeInteger(index) && index >= 0 && index <= stepCount - 1,
      "index",
    ),
      index);
    return {
      oneBasedPosition: index + 1,
      first: index === 0,
      last: index === stepCount - 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { index: 2, stepCount: 5 },
  output: { oneBasedPosition: 3, first: false, last: false },
} satisfies ToolExample<Input, Output>;
export const publicRitualSequencePositionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "religious-studies/public-ritual-sequence-position",
    title: "Public Ritual Sequence Position Tool",
    description:
      "Describe one indexed step in an explicitly supplied public ritual sequence without choosing or disclosing ritual content.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        index: { type: "integer", minimum: 0 },
        stepCount: { type: "integer", minimum: 1 },
      },
      required: ["index", "stepCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        oneBasedPosition: { type: "integer" },
        first: { type: "boolean" },
        last: { type: "boolean" },
      },
      required: ["oneBasedPosition", "first", "last"],
    },
    ports: {
      inputs: [
        {
          id: "index",
          label: "Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "stepCount",
          label: "Step Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "oneBasedPosition",
          label: "One Based Position",
          valueType: { type: "integer" },
        },
        { id: "first", label: "First", valueType: { type: "boolean" } },
        { id: "last", label: "Last", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = publicRitualSequencePositionTool.execute;
export default publicRitualSequencePositionTool;
