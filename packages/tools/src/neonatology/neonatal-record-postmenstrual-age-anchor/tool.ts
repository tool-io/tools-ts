import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly gestationAtBirthDays: number;
  readonly chronologicalAgeDays: number;
  readonly recordedDays: number;
};
export type Output = {
  readonly postmenstrualDays: number;
  readonly discrepancyDays: number;
  readonly weeks: number;
  readonly days: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gestationAtBirthDays: { type: "integer", minimum: 0 },
    chronologicalAgeDays: { type: "integer", minimum: 0 },
    recordedDays: { type: "integer", minimum: 0 },
  },
  required: ["gestationAtBirthDays", "chronologicalAgeDays", "recordedDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    postmenstrualDays: { type: "integer" },
    discrepancyDays: { type: "integer" },
    weeks: { type: "integer" },
    days: { type: "integer" },
  },
  required: ["postmenstrualDays", "discrepancyDays", "weeks", "days"],
} as const;
/** Reconcile supplied postmenstrual and chronological research day anchors. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { gestationAtBirthDays, chronologicalAgeDays, recordedDays } = request;
  const compute = (): Output => {
    H.integer(gestationAtBirthDays, 0);
    H.integer(chronologicalAgeDays, 0);
    H.integer(recordedDays, 0);
    return {
      postmenstrualDays: gestationAtBirthDays + chronologicalAgeDays,
      discrepancyDays:
        recordedDays - gestationAtBirthDays - chronologicalAgeDays,
      weeks: Math.floor((gestationAtBirthDays + chronologicalAgeDays) / 7),
      days: (gestationAtBirthDays + chronologicalAgeDays) % 7,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    gestationAtBirthDays: 224,
    chronologicalAgeDays: 10,
    recordedDays: 235,
  },
  output: { postmenstrualDays: 234, discrepancyDays: 1, weeks: 33, days: 3 },
} satisfies ToolExample<Input, Output>;
export const neonatalRecordPostmenstrualAgeAnchorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "neonatology/neonatal-record-postmenstrual-age-anchor",
      title: "Neonatal Record Postmenstrual Age Anchor Tool",
      description:
        "Reconcile supplied postmenstrual and chronological research day anchors.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          gestationAtBirthDays: { type: "integer", minimum: 0 },
          chronologicalAgeDays: { type: "integer", minimum: 0 },
          recordedDays: { type: "integer", minimum: 0 },
        },
        required: [
          "gestationAtBirthDays",
          "chronologicalAgeDays",
          "recordedDays",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          postmenstrualDays: { type: "integer" },
          discrepancyDays: { type: "integer" },
          weeks: { type: "integer" },
          days: { type: "integer" },
        },
        required: ["postmenstrualDays", "discrepancyDays", "weeks", "days"],
      },
      ports: {
        inputs: [
          {
            id: "gestationAtBirthDays",
            label: "Gestation At Birth Days",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "chronologicalAgeDays",
            label: "Chronological Age Days",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "recordedDays",
            label: "Recorded Days",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "postmenstrualDays",
            label: "Postmenstrual Days",
            valueType: { type: "integer" },
          },
          {
            id: "discrepancyDays",
            label: "Discrepancy Days",
            valueType: { type: "integer" },
          },
          { id: "weeks", label: "Weeks", valueType: { type: "integer" } },
          { id: "days", label: "Days", valueType: { type: "integer" } },
        ],
      },
    },
    calculate,
  });
export const run = neonatalRecordPostmenstrualAgeAnchorTool.execute;
export default neonatalRecordPostmenstrualAgeAnchorTool;
