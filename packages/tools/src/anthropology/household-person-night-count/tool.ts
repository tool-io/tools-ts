import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly personCount: number;
  readonly nightCount: number;
};
export type Output = { readonly personNights: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    personCount: { type: "integer", minimum: 0 },
    nightCount: { type: "integer", minimum: 0 },
  },
  required: ["personCount", "nightCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { personNights: { type: "integer" } },
  required: ["personNights"],
} as const;
/** Count household person-nights for a constant explicitly supplied household size. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { personCount, nightCount } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(personCount) &&
        personCount >= 0 &&
        personCount <= Number.MAX_SAFE_INTEGER,
      "personCount",
    ),
      personCount);
    (H.domain(
      Number.isSafeInteger(nightCount) &&
        nightCount >= 0 &&
        nightCount <= Number.MAX_SAFE_INTEGER,
      "nightCount",
    ),
      nightCount);
    return { personNights: personCount * nightCount };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { personCount: 4, nightCount: 7 },
  output: { personNights: 28 },
} satisfies ToolExample<Input, Output>;
export const householdPersonNightCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anthropology/household-person-night-count",
    title: "Household Person Night Count Tool",
    description:
      "Count household person-nights for a constant explicitly supplied household size.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        personCount: { type: "integer", minimum: 0 },
        nightCount: { type: "integer", minimum: 0 },
      },
      required: ["personCount", "nightCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { personNights: { type: "integer" } },
      required: ["personNights"],
    },
    ports: {
      inputs: [
        {
          id: "personCount",
          label: "Person Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "nightCount",
          label: "Night Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "personNights",
          label: "Person Nights",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = householdPersonNightCountTool.execute;
export default householdPersonNightCountTool;
