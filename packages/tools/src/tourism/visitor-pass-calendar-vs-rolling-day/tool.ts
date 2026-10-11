import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly purchaseEpochSeconds: number;
  readonly validityDays: number;
};
export type Output = {
  readonly utcCalendarExpiryExclusiveSeconds: number;
  readonly rollingExpiryExclusiveSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    purchaseEpochSeconds: { type: "number" },
    validityDays: { type: "integer", minimum: 1 },
  },
  required: ["purchaseEpochSeconds", "validityDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    utcCalendarExpiryExclusiveSeconds: { type: "number" },
    rollingExpiryExclusiveSeconds: { type: "number" },
  },
  required: [
    "utcCalendarExpiryExclusiveSeconds",
    "rollingExpiryExclusiveSeconds",
  ],
} as const;
/** Compare explicit UTC calendar-day and rolling 24-hour pass expiry conventions without applying local timezone or ticket conditions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { purchaseEpochSeconds, validityDays } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(validityDays) &&
        validityDays >= 1 &&
        validityDays <= Number.MAX_SAFE_INTEGER,
      "validityDays",
    ),
      validityDays);
    return (() => {
      const d = new Date(purchaseEpochSeconds * 1000);
      H.domain(Number.isFinite(d.getTime()), "purchaseEpochSeconds");
      d.setUTCHours(0, 0, 0, 0);
      d.setUTCDate(d.getUTCDate() + validityDays);
      H.domain(Number.isFinite(d.getTime()), "validityDays");
      return {
        utcCalendarExpiryExclusiveSeconds: d.getTime() / 1000,
        rollingExpiryExclusiveSeconds:
          purchaseEpochSeconds + validityDays * 86400,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { purchaseEpochSeconds: 43200, validityDays: 2 },
  output: {
    utcCalendarExpiryExclusiveSeconds: 172800,
    rollingExpiryExclusiveSeconds: 216000,
  },
} satisfies ToolExample<Input, Output>;
export const visitorPassCalendarVsRollingDayTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["tourism", "business and finance"],
      keywords: ["tourism", "business and finance"],
    },
    id: "tourism/visitor-pass-calendar-vs-rolling-day",
    title: "Visitor Pass Calendar Vs Rolling Day",
    description:
      "Compare explicit UTC calendar-day and rolling 24-hour pass expiry conventions without applying local timezone or ticket conditions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        purchaseEpochSeconds: { type: "number" },
        validityDays: { type: "integer", minimum: 1 },
      },
      required: ["purchaseEpochSeconds", "validityDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        utcCalendarExpiryExclusiveSeconds: { type: "number" },
        rollingExpiryExclusiveSeconds: { type: "number" },
      },
      required: [
        "utcCalendarExpiryExclusiveSeconds",
        "rollingExpiryExclusiveSeconds",
      ],
    },
    ports: {
      inputs: [
        {
          id: "purchaseEpochSeconds",
          label: "Purchase Epoch Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "validityDays",
          label: "Validity Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "utcCalendarExpiryExclusiveSeconds",
          label: "Utc Calendar Expiry Exclusive Seconds",
          valueType: { type: "number" },
        },
        {
          id: "rollingExpiryExclusiveSeconds",
          label: "Rolling Expiry Exclusive Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = visitorPassCalendarVsRollingDayTool.execute;
export default visitorPassCalendarVsRollingDayTool;
