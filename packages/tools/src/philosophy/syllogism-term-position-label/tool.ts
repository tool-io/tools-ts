import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly position: string; readonly figure: number };
export type Output = {
  readonly subjectRole: string;
  readonly predicateRole: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    position: {
      type: "string",
      maxLength: 8192,
      enum: ["major", "minor", "conclusion"],
    },
    figure: { type: "integer", minimum: 1, maximum: 4 },
  },
  required: ["position", "figure"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    subjectRole: { type: "string", maxLength: 8192 },
    predicateRole: { type: "string", maxLength: 8192 },
  },
  required: ["subjectRole", "predicateRole"],
} as const;
/** Locate the major, minor and middle terms in a categorical syllogism premise or conclusion using an explicit classical figure from 1 to 4. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { position, figure } = request;
  const compute = (): Output => {
    H.domain(["major", "minor", "conclusion"].includes(position), "position");
    (H.domain(
      Number.isSafeInteger(figure) && figure >= 1 && figure <= 4,
      "figure",
    ),
      figure);
    if (position === "conclusion")
      return { subjectRole: "minor", predicateRole: "major" };
    if (position === "major")
      return figure === 1 || figure === 3
        ? { subjectRole: "middle", predicateRole: "major" }
        : { subjectRole: "major", predicateRole: "middle" };
    return figure === 1 || figure === 2
      ? { subjectRole: "minor", predicateRole: "middle" }
      : { subjectRole: "middle", predicateRole: "minor" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { position: "major", figure: 2 },
  output: { subjectRole: "major", predicateRole: "middle" },
} satisfies ToolExample<Input, Output>;
export const syllogismTermPositionLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "philosophy/syllogism-term-position-label",
    title: "Syllogism Term Position Label Tool",
    description:
      "Locate the major, minor and middle terms in a categorical syllogism premise or conclusion using an explicit classical figure from 1 to 4.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        position: {
          type: "string",
          maxLength: 8192,
          enum: ["major", "minor", "conclusion"],
        },
        figure: { type: "integer", minimum: 1, maximum: 4 },
      },
      required: ["position", "figure"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        subjectRole: { type: "string", maxLength: 8192 },
        predicateRole: { type: "string", maxLength: 8192 },
      },
      required: ["subjectRole", "predicateRole"],
    },
    ports: {
      inputs: [
        {
          id: "position",
          label: "Position",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "figure",
          label: "Figure",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "subjectRole",
          label: "Subject Role",
          valueType: { type: "string" },
        },
        {
          id: "predicateRole",
          label: "Predicate Role",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = syllogismTermPositionLabelTool.execute;
export default syllogismTermPositionLabelTool;
