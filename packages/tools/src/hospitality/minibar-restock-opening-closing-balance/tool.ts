import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly opening: number;
  readonly restocked: number;
  readonly closing: number;
  readonly complimentary: number;
};
export type Output = { readonly used: number; readonly chargeable: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    opening: { type: "integer", minimum: 0 },
    restocked: { type: "integer", minimum: 0 },
    closing: { type: "integer", minimum: 0 },
    complimentary: { type: "integer", minimum: 0 },
  },
  required: ["opening", "restocked", "closing", "complimentary"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { used: { type: "integer" }, chargeable: { type: "integer" } },
  required: ["used", "chargeable"],
} as const;
/** Calculate minibar restock opening closing balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { opening, restocked, closing, complimentary } = request;
  const compute = (): Output => {
    H.integer(opening, 0);
    H.integer(restocked, 0);
    H.integer(closing, 0, opening + restocked);
    H.integer(complimentary, 0, opening + restocked - closing);
    return {
      used: opening + restocked - closing,
      chargeable: opening + restocked - closing - complimentary,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { opening: 10, restocked: 4, closing: 8, complimentary: 1 },
  output: { used: 6, chargeable: 5 },
} satisfies ToolExample<Input, Output>;
export const minibarRestockOpeningClosingBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "hospitality/minibar-restock-opening-closing-balance",
      title: "Minibar Restock Opening Closing Balance Tool",
      description:
        "Calculate minibar restock opening closing balance from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          opening: { type: "integer", minimum: 0 },
          restocked: { type: "integer", minimum: 0 },
          closing: { type: "integer", minimum: 0 },
          complimentary: { type: "integer", minimum: 0 },
        },
        required: ["opening", "restocked", "closing", "complimentary"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          used: { type: "integer" },
          chargeable: { type: "integer" },
        },
        required: ["used", "chargeable"],
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
            id: "restocked",
            label: "Restocked",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "closing",
            label: "Closing",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "complimentary",
            label: "Complimentary",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "used", label: "Used", valueType: { type: "integer" } },
          {
            id: "chargeable",
            label: "Chargeable",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = minibarRestockOpeningClosingBalanceTool.execute;
export default minibarRestockOpeningClosingBalanceTool;
