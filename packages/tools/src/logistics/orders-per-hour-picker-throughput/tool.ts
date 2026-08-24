import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OrdersPerHourPickerThroughputInput = {
  readonly ordersPicked: number;
  readonly pickerHours: number;
};

export type OrdersPerHourPickerThroughputOutput = {
  readonly ordersPerHour: number;
};

export const calculateOrdersPerHourPickerThroughput = (
  input: OrdersPerHourPickerThroughputInput,
): OrdersPerHourPickerThroughputOutput => {
  if (!Number.isFinite(input.pickerHours) || input.pickerHours <= 0)
    return simpleError(
      "pickerHours",
      "Picker hours must be finite and greater than zero.",
      "invalid_hours",
    );
  if (!Number.isSafeInteger(input.ordersPicked) || input.ordersPicked < 0)
    return simpleError(
      "ordersPicked",
      "Orders picked must be a non-negative safe integer.",
      "invalid_orders",
    );
  if (input.ordersPicked === 0) return { ordersPerHour: 0 };
  const ordersPerHour = input.ordersPicked / input.pickerHours;
  if (!Number.isFinite(ordersPerHour))
    return simpleError(
      "pickerHours",
      "Orders per hour is too large to represent.",
      "result_out_of_range",
    );
  return { ordersPerHour };
};

export const ordersPerHourPickerThroughputExample = {
  input: { ordersPicked: 132, pickerHours: 6 },
  output: { ordersPerHour: 22 },
} satisfies ToolExample<
  OrdersPerHourPickerThroughputInput,
  OrdersPerHourPickerThroughputOutput
>;

export const ordersPerHourPickerThroughputTool = createSimpleTool({
  id: "logistics/orders-per-hour-picker-throughput",
  title: "Orders Per Hour Picker Throughput Calculator",
  description:
    "Compute picker throughput in orders per hour from orders picked and total picker labor hours.",
  inputs: [
    {
      description: "Orders picked in the period.",
      id: "ordersPicked",
      kind: "integer",
      label: "Orders picked",
      minimum: 0,
    },
    {
      description: "Total picker labor hours worked in the same period.",
      id: "pickerHours",
      kind: "number",
      label: "Picker hours",
      minimum: Number.MIN_VALUE,
      unit: "h",
    },
  ],
  outputs: [
    {
      description: "Orders picked per picker labor hour.",
      id: "ordersPerHour",
      kind: "number",
      label: "Orders per hour",
      minimum: 0,
      unit: "orders/h",
    },
  ],
  calculate: (input) =>
    calculateOrdersPerHourPickerThroughput({
      ordersPicked: input.ordersPicked as number,
      pickerHours: input.pickerHours as number,
    }),
});

export const runOrdersPerHourPickerThroughput =
  ordersPerHourPickerThroughputTool.execute;
export default ordersPerHourPickerThroughputTool;
