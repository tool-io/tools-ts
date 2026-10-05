import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly menuSubtotal: number;
  readonly serviceChargeRateFraction: number;
};
export type Output = { readonly serviceCharge: number; readonly total: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    menuSubtotal: { type: "number", minimum: 0 },
    serviceChargeRateFraction: { type: "number", minimum: 0 },
  },
  required: ["menuSubtotal", "serviceChargeRateFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { serviceCharge: { type: "number" }, total: { type: "number" } },
  required: ["serviceCharge", "total"],
} as const;
/** Add an explicit service-charge line to a menu subtotal before any separately applicable taxes or rounding. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { menuSubtotal, serviceChargeRateFraction } = request;
  const compute = (): Output => {
    H.domain(
      menuSubtotal >= 0 && serviceChargeRateFraction >= 0,
      "menuSubtotal",
    );
    return {
      serviceCharge: menuSubtotal * serviceChargeRateFraction,
      total: menuSubtotal * (1 + serviceChargeRateFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { menuSubtotal: 80, serviceChargeRateFraction: 0.125 },
  output: { serviceCharge: 10, total: 90 },
} satisfies ToolExample<Input, Output>;
export const menuPriceServiceChargeLineTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospitality/menu-price-service-charge-line",
    title: "Menu Price Service Charge Line Tool",
    description:
      "Add an explicit service-charge line to a menu subtotal before any separately applicable taxes or rounding.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        menuSubtotal: { type: "number", minimum: 0 },
        serviceChargeRateFraction: { type: "number", minimum: 0 },
      },
      required: ["menuSubtotal", "serviceChargeRateFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        serviceCharge: { type: "number" },
        total: { type: "number" },
      },
      required: ["serviceCharge", "total"],
    },
    ports: {
      inputs: [
        {
          id: "menuSubtotal",
          label: "Menu Subtotal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "serviceChargeRateFraction",
          label: "Service Charge Rate Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "serviceCharge",
          label: "Service Charge",
          valueType: { type: "number" },
        },
        { id: "total", label: "Total", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = menuPriceServiceChargeLineTool.execute;
export default menuPriceServiceChargeLineTool;
