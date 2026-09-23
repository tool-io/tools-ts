import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly checkoutDay: number;
  readonly dueDay: number;
  readonly returnDay: number;
  readonly returned: boolean;
  readonly observationDay: number;
};
export type Output = {
  readonly elapsed: number;
  readonly lateDays: number;
  readonly returned: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    checkoutDay: { type: "integer" },
    dueDay: { type: "integer" },
    returnDay: { type: "integer" },
    returned: { type: "boolean" },
    observationDay: { type: "integer" },
  },
  required: [
    "checkoutDay",
    "dueDay",
    "returnDay",
    "returned",
    "observationDay",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsed: { type: "integer" },
    lateDays: { type: "integer" },
    returned: { type: "boolean" },
  },
  required: ["elapsed", "lateDays", "returned"],
} as const;
/** Calculate biosafety reusable equipment checkout lag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { checkoutDay, dueDay, returnDay, returned, observationDay } = request;
  const compute = (): Output => {
    H.domain(
      dueDay >= checkoutDay &&
        (returned ? returnDay : observationDay) >= checkoutDay,
    );
    return {
      elapsed: (returned ? returnDay : observationDay) - checkoutDay,
      lateDays: Math.max(0, (returned ? returnDay : observationDay) - dueDay),
      returned,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    checkoutDay: 100,
    dueDay: 110,
    returnDay: 112,
    returned: true,
    observationDay: 120,
  },
  output: { elapsed: 12, lateDays: 2, returned: true },
} satisfies ToolExample<Input, Output>;
export const biosafetyReusableEquipmentCheckoutLagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biosafety/biosafety-reusable-equipment-checkout-lag",
      title: "Biosafety Reusable Equipment Checkout Lag Tool",
      description:
        "Calculate biosafety reusable equipment checkout lag from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          checkoutDay: { type: "integer" },
          dueDay: { type: "integer" },
          returnDay: { type: "integer" },
          returned: { type: "boolean" },
          observationDay: { type: "integer" },
        },
        required: [
          "checkoutDay",
          "dueDay",
          "returnDay",
          "returned",
          "observationDay",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          elapsed: { type: "integer" },
          lateDays: { type: "integer" },
          returned: { type: "boolean" },
        },
        required: ["elapsed", "lateDays", "returned"],
      },
      ports: {
        inputs: [
          {
            id: "checkoutDay",
            label: "Checkout Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "dueDay",
            label: "Due Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "returnDay",
            label: "Return Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "returned",
            label: "Returned",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "observationDay",
            label: "Observation Day",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "elapsed", label: "Elapsed", valueType: { type: "integer" } },
          {
            id: "lateDays",
            label: "Late Days",
            valueType: { type: "integer" },
          },
          { id: "returned", label: "Returned", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = biosafetyReusableEquipmentCheckoutLagTool.execute;
export default biosafetyReusableEquipmentCheckoutLagTool;
