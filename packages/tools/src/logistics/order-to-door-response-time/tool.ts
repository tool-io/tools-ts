import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OrderToDoorResponseTimeInput = {
  readonly deliveredAt: string;
  readonly orderPlacedAt: string;
  readonly targetHours?: number;
};

export type OrderToDoorResponseTimeOutput = {
  readonly elapsedHours: number;
  readonly slaMet: boolean;
};

const parseTimestamp = (value: string, field: string): number => {
  const match =
    typeof value === "string"
      ? /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/.exec(
          value,
        )
      : null;
  if (match === null)
    return simpleError(
      field,
      `${field} must be an ISO 8601 timestamp with a UTC designator or numeric offset.`,
      "timestamp_invalid",
    );
  const [year = 0, month = 0, day = 0, hour = 0, minute = 0, second = 0] = match
    .slice(1, 7)
    .map((part) => Number(part ?? 0));
  const calendarProbe = new Date(0);
  calendarProbe.setUTCFullYear(year, month - 1, day);
  calendarProbe.setUTCHours(hour, minute, second, 0);
  if (
    calendarProbe.getUTCFullYear() !== year ||
    calendarProbe.getUTCMonth() !== month - 1 ||
    calendarProbe.getUTCDate() !== day ||
    calendarProbe.getUTCHours() !== hour ||
    calendarProbe.getUTCMinutes() !== minute ||
    calendarProbe.getUTCSeconds() !== second
  )
    return simpleError(
      field,
      `${field} contains an invalid calendar date or clock time.`,
      "timestamp_invalid",
    );
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed))
    return simpleError(
      field,
      `${field} must be a valid ISO 8601 timestamp.`,
      "timestamp_invalid",
    );
  return parsed;
};

export const calculateOrderToDoorResponseTime = (
  input: OrderToDoorResponseTimeInput,
): OrderToDoorResponseTimeOutput => {
  const targetHours = input.targetHours ?? 24;
  if (!Number.isFinite(targetHours) || targetHours < 0)
    return simpleError(
      "targetHours",
      "The delivery target must be finite and non-negative.",
      "invalid_target",
    );
  const startMs = parseTimestamp(input.orderPlacedAt, "orderPlacedAt");
  const endMs = parseTimestamp(input.deliveredAt, "deliveredAt");
  if (endMs < startMs)
    return simpleError(
      "deliveredAt",
      "deliveredAt must not precede orderPlacedAt.",
      "reversed_timestamps",
    );
  const elapsedHours = (endMs - startMs) / 3_600_000;
  if (!Number.isFinite(elapsedHours))
    return simpleError(
      "deliveredAt",
      "The elapsed duration is outside the representable range.",
      "duration_out_of_range",
    );
  return { elapsedHours, slaMet: elapsedHours <= targetHours };
};

export const orderToDoorResponseTimeExample = {
  input: {
    deliveredAt: "2026-05-05T17:45:00Z",
    orderPlacedAt: "2026-05-04T09:15:00Z",
    targetHours: 24,
  },
  output: { elapsedHours: 32.5, slaMet: false },
} satisfies ToolExample<
  OrderToDoorResponseTimeInput,
  OrderToDoorResponseTimeOutput
>;

export const orderToDoorResponseTimeTool = createSimpleTool({
  id: "logistics/order-to-door-response-time",
  title: "Order to Door Response Time",
  description:
    "Measure elapsed hours between order placement and doorstep delivery and check the result against a delivery-promise target in hours.",
  inputs: [
    {
      description: "Doorstep delivery timestamp (ISO 8601).",
      id: "deliveredAt",
      kind: "string",
      label: "Delivered at",
    },
    {
      description: "Order placement timestamp (ISO 8601).",
      id: "orderPlacedAt",
      kind: "string",
      label: "Ordered at",
    },
    {
      default: 24,
      description: "Delivery promise in hours.",
      id: "targetHours",
      kind: "number",
      label: "Target hours",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Elapsed time from order to door in hours.",
      id: "elapsedHours",
      kind: "number",
      label: "Elapsed hours",
    },
    {
      description: "True when delivery met the target.",
      id: "slaMet",
      kind: "boolean",
      label: "SLA met",
    },
  ],
  calculate: (input) =>
    calculateOrderToDoorResponseTime({
      deliveredAt: input.deliveredAt as string,
      orderPlacedAt: input.orderPlacedAt as string,
      targetHours: input.targetHours as number | undefined,
    }),
});

export const runOrderToDoorResponseTime = orderToDoorResponseTimeTool.execute;
export default orderToDoorResponseTimeTool;
