import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly installedDay: number;
  readonly replacedDay: number;
  readonly observedDay: number;
  readonly replacementKnown: boolean;
};
export type Output = { readonly ageDays: number; readonly anchorDay: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    installedDay: { type: "integer" },
    replacedDay: { type: "integer" },
    observedDay: { type: "integer" },
    replacementKnown: { type: "boolean" },
  },
  required: ["installedDay", "replacedDay", "observedDay", "replacementKnown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ageDays: { type: "integer" }, anchorDay: { type: "integer" } },
  required: ["ageDays", "anchorDay"],
} as const;
/** Age of a supplied lure inventory record, without a lure efficacy or replacement recommendation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { installedDay, replacedDay, observedDay, replacementKnown } = request;
  const compute = (): Output => {
    H.domain(
      observedDay >= installedDay &&
        (!replacementKnown ||
          (replacedDay >= installedDay && replacedDay <= observedDay)),
    );
    return {
      ageDays: observedDay - (replacementKnown ? replacedDay : installedDay),
      anchorDay: replacementKnown ? replacedDay : installedDay,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    installedDay: 10,
    replacedDay: 20,
    observedDay: 25,
    replacementKnown: true,
  },
  output: { ageDays: 5, anchorDay: 20 },
} satisfies ToolExample<Input, Output>;
export const trapLureAgeResetTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entomology/trap-lure-age-reset-token",
    title: "Trap Lure Age Reset Token Tool",
    description:
      "Age of a supplied lure inventory record, without a lure efficacy or replacement recommendation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        installedDay: { type: "integer" },
        replacedDay: { type: "integer" },
        observedDay: { type: "integer" },
        replacementKnown: { type: "boolean" },
      },
      required: [
        "installedDay",
        "replacedDay",
        "observedDay",
        "replacementKnown",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ageDays: { type: "integer" },
        anchorDay: { type: "integer" },
      },
      required: ["ageDays", "anchorDay"],
    },
    ports: {
      inputs: [
        {
          id: "installedDay",
          label: "Installed Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "replacedDay",
          label: "Replaced Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "observedDay",
          label: "Observed Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "replacementKnown",
          label: "Replacement Known",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "ageDays", label: "Age Days", valueType: { type: "integer" } },
        {
          id: "anchorDay",
          label: "Anchor Day",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = trapLureAgeResetTokenTool.execute;
export default trapLureAgeResetTokenTool;
