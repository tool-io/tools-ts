import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly neededAt: number;
  readonly orderAt: number;
  readonly leadTime: number;
};
export type Output = { readonly arrivalAt: number; readonly float: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    neededAt: { type: "number" },
    orderAt: { type: "number" },
    leadTime: { type: "number", minimum: 0 },
  },
  required: ["neededAt", "orderAt", "leadTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { arrivalAt: { type: "number" }, float: { type: "number" } },
  required: ["arrivalAt", "float"],
} as const;
/** Calculate procurement leadtime float term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { neededAt, orderAt, leadTime } = request;
  const compute = (): Output => {
    H.domain(leadTime >= 0);
    return {
      arrivalAt: orderAt + leadTime,
      float: neededAt - orderAt - leadTime,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { neededAt: 30, orderAt: 10, leadTime: 15 },
  output: { arrivalAt: 25, float: 5 },
} satisfies ToolExample<Input, Output>;
export const procurementLeadtimeFloatTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "construction-management/procurement-leadtime-float-term",
    title: "Procurement Leadtime Float Term Tool",
    description:
      "Calculate procurement leadtime float term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        neededAt: { type: "number" },
        orderAt: { type: "number" },
        leadTime: { type: "number", minimum: 0 },
      },
      required: ["neededAt", "orderAt", "leadTime"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { arrivalAt: { type: "number" }, float: { type: "number" } },
      required: ["arrivalAt", "float"],
    },
    ports: {
      inputs: [
        {
          id: "neededAt",
          label: "Needed At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "orderAt",
          label: "Order At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "leadTime",
          label: "Lead Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "arrivalAt", label: "Arrival At", valueType: { type: "number" } },
        { id: "float", label: "Float", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = procurementLeadtimeFloatTermTool.execute;
export default procurementLeadtimeFloatTermTool;
