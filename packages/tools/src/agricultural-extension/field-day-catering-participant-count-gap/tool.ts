import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly registered: number;
  readonly attended: number;
  readonly staff: number;
  readonly portions: number;
  readonly reserveFraction: number;
};
export type Output = { readonly needed: number; readonly margin: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    registered: { type: "integer", minimum: 0 },
    attended: { type: "integer", minimum: 0 },
    staff: { type: "integer", minimum: 0 },
    portions: { type: "integer", minimum: 0 },
    reserveFraction: { type: "number", minimum: 0 },
  },
  required: ["registered", "attended", "staff", "portions", "reserveFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { needed: { type: "integer" }, margin: { type: "integer" } },
  required: ["needed", "margin"],
} as const;
/** Calculate field day catering participant count gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { registered, attended, staff, portions, reserveFraction } = request;
  const compute = (): Output => {
    H.integer(registered, 0);
    H.integer(attended, 0, registered);
    H.integer(staff, 0);
    H.integer(portions, 0);
    H.domain(reserveFraction >= 0);
    return {
      needed: Math.ceil((attended + staff) * (1 + reserveFraction)),
      margin: portions - Math.ceil((attended + staff) * (1 + reserveFraction)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    registered: 100,
    attended: 80,
    staff: 10,
    portions: 110,
    reserveFraction: 0.1,
  },
  output: { needed: 100, margin: 10 },
} satisfies ToolExample<Input, Output>;
export const fieldDayCateringParticipantCountGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agricultural-extension/field-day-catering-participant-count-gap",
      title: "Field Day Catering Participant Count Gap Tool",
      description:
        "Calculate field day catering participant count gap from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          registered: { type: "integer", minimum: 0 },
          attended: { type: "integer", minimum: 0 },
          staff: { type: "integer", minimum: 0 },
          portions: { type: "integer", minimum: 0 },
          reserveFraction: { type: "number", minimum: 0 },
        },
        required: [
          "registered",
          "attended",
          "staff",
          "portions",
          "reserveFraction",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          needed: { type: "integer" },
          margin: { type: "integer" },
        },
        required: ["needed", "margin"],
      },
      ports: {
        inputs: [
          {
            id: "registered",
            label: "Registered",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "attended",
            label: "Attended",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "staff",
            label: "Staff",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "portions",
            label: "Portions",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "reserveFraction",
            label: "Reserve Fraction",
            required: true,
            valueType: { type: "number", unit: "1" },
          },
        ],
        outputs: [
          { id: "needed", label: "Needed", valueType: { type: "integer" } },
          { id: "margin", label: "Margin", valueType: { type: "integer" } },
        ],
      },
    },
    calculate,
  });
export const run = fieldDayCateringParticipantCountGapTool.execute;
export default fieldDayCateringParticipantCountGapTool;
