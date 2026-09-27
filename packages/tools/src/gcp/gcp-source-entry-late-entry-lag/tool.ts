import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventDay: number;
  readonly enteredDay: number;
  readonly correctionDay: number;
  readonly corrected: boolean;
  readonly suppliedMaximum: number;
};
export type Output = {
  readonly entryLag: number;
  readonly correctionLag: number;
  readonly late: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventDay: { type: "integer" },
    enteredDay: { type: "integer" },
    correctionDay: { type: "integer" },
    corrected: { type: "boolean" },
    suppliedMaximum: { type: "integer", minimum: 0 },
  },
  required: [
    "eventDay",
    "enteredDay",
    "correctionDay",
    "corrected",
    "suppliedMaximum",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    entryLag: { type: "integer" },
    correctionLag: { type: "integer" },
    late: { type: "boolean" },
  },
  required: ["entryLag", "correctionLag", "late"],
} as const;
/** Calculate gcp source entry late entry lag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventDay, enteredDay, correctionDay, corrected, suppliedMaximum } =
    request;
  const compute = (): Output => {
    H.integer(suppliedMaximum, 0);
    H.domain(
      enteredDay >= eventDay && (!corrected || correctionDay >= enteredDay),
    );
    return {
      entryLag: enteredDay - eventDay,
      correctionLag: corrected ? correctionDay - enteredDay : 0,
      late: enteredDay - eventDay > suppliedMaximum,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    eventDay: 100,
    enteredDay: 103,
    correctionDay: 110,
    corrected: true,
    suppliedMaximum: 2,
  },
  output: { entryLag: 3, correctionLag: 7, late: true },
} satisfies ToolExample<Input, Output>;
export const gcpSourceEntryLateEntryLagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gcp/gcp-source-entry-late-entry-lag",
    title: "GCP Source Entry Late Entry Lag Tool",
    description:
      "Calculate gcp source entry late entry lag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventDay: { type: "integer" },
        enteredDay: { type: "integer" },
        correctionDay: { type: "integer" },
        corrected: { type: "boolean" },
        suppliedMaximum: { type: "integer", minimum: 0 },
      },
      required: [
        "eventDay",
        "enteredDay",
        "correctionDay",
        "corrected",
        "suppliedMaximum",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        entryLag: { type: "integer" },
        correctionLag: { type: "integer" },
        late: { type: "boolean" },
      },
      required: ["entryLag", "correctionLag", "late"],
    },
    ports: {
      inputs: [
        {
          id: "eventDay",
          label: "Event Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "enteredDay",
          label: "Entered Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "correctionDay",
          label: "Correction Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "corrected",
          label: "Corrected",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "suppliedMaximum",
          label: "Supplied Maximum",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "entryLag", label: "Entry Lag", valueType: { type: "integer" } },
        {
          id: "correctionLag",
          label: "Correction Lag",
          valueType: { type: "integer" },
        },
        { id: "late", label: "Late", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = gcpSourceEntryLateEntryLagTool.execute;
export default gcpSourceEntryLateEntryLagTool;
