import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly priorHolder: string;
  readonly nextHolder: string;
  readonly handedTo: string;
  readonly handoffRecorded: boolean;
};
export type Output = { readonly matches: boolean; readonly gap: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    priorHolder: { type: "string", maxLength: 8192 },
    nextHolder: { type: "string", maxLength: 8192 },
    handedTo: { type: "string", maxLength: 8192 },
    handoffRecorded: { type: "boolean" },
  },
  required: ["priorHolder", "nextHolder", "handedTo", "handoffRecorded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { matches: { type: "boolean" }, gap: { type: "boolean" } },
  required: ["matches", "gap"],
} as const;
/** Check explicitly annotated scene-to-scene prop continuity without generating story events. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { priorHolder, nextHolder, handedTo, handoffRecorded } = request;
  const compute = (): Output => {
    const matches =
      priorHolder === nextHolder ||
      (handoffRecorded && handedTo === nextHolder);
    return { matches, gap: !matches };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    priorHolder: "A",
    nextHolder: "B",
    handedTo: "B",
    handoffRecorded: true,
  },
  output: { matches: true, gap: false },
} satisfies ToolExample<Input, Output>;
export const scenePropHandoffGapTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "creative-writing/scene-prop-handoff-gap",
      title: "Scene Prop Handoff Gap Tool",
      description:
        "Check explicitly annotated scene-to-scene prop continuity without generating story events.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          priorHolder: { type: "string", maxLength: 8192 },
          nextHolder: { type: "string", maxLength: 8192 },
          handedTo: { type: "string", maxLength: 8192 },
          handoffRecorded: { type: "boolean" },
        },
        required: ["priorHolder", "nextHolder", "handedTo", "handoffRecorded"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { matches: { type: "boolean" }, gap: { type: "boolean" } },
        required: ["matches", "gap"],
      },
      ports: {
        inputs: [
          {
            id: "priorHolder",
            label: "Prior Holder",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "nextHolder",
            label: "Next Holder",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "handedTo",
            label: "Handed To",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "handoffRecorded",
            label: "Handoff Recorded",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "matches", label: "Matches", valueType: { type: "boolean" } },
          { id: "gap", label: "Gap", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  },
);
export const run = scenePropHandoffGapTool.execute;
export default scenePropHandoffGapTool;
