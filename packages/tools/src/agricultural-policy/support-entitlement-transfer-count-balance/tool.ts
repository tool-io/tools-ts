import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly opening: number;
  readonly received: number;
  readonly transferred: number;
  readonly retired: number;
};
export type Output = { readonly closing: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    opening: { type: "integer", minimum: 0 },
    received: { type: "integer", minimum: 0 },
    transferred: { type: "integer", minimum: 0 },
    retired: { type: "integer", minimum: 0 },
  },
  required: ["opening", "received", "transferred", "retired"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { closing: { type: "integer" } },
  required: ["closing"],
} as const;
/** Calculate support entitlement transfer count balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { opening, received, transferred, retired } = request;
  const compute = (): Output => {
    H.integer(opening, 0);
    H.integer(received, 0);
    H.integer(transferred, 0);
    H.integer(retired, 0);
    H.domain(transferred + retired <= opening + received);
    return { closing: opening + received - transferred - retired };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { opening: 10, received: 4, transferred: 3, retired: 1 },
  output: { closing: 10 },
} satisfies ToolExample<Input, Output>;
export const supportEntitlementTransferCountBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agricultural-policy/support-entitlement-transfer-count-balance",
      title: "Support Entitlement Transfer Count Balance Tool",
      description:
        "Calculate support entitlement transfer count balance from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          opening: { type: "integer", minimum: 0 },
          received: { type: "integer", minimum: 0 },
          transferred: { type: "integer", minimum: 0 },
          retired: { type: "integer", minimum: 0 },
        },
        required: ["opening", "received", "transferred", "retired"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { closing: { type: "integer" } },
        required: ["closing"],
      },
      ports: {
        inputs: [
          {
            id: "opening",
            label: "Opening",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "received",
            label: "Received",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "transferred",
            label: "Transferred",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "retired",
            label: "Retired",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "closing", label: "Closing", valueType: { type: "integer" } },
        ],
      },
    },
    calculate,
  });
export const run = supportEntitlementTransferCountBalanceTool.execute;
export default supportEntitlementTransferCountBalanceTool;
