import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly availableFrom: number;
  readonly availableUntil: number;
  readonly requestedDay: number;
};
export type Output = {
  readonly beforeWindow: number;
  readonly afterWindow: number;
  readonly accessibleByDates: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableFrom: { type: "integer" },
    availableUntil: { type: "integer" },
    requestedDay: { type: "integer" },
  },
  required: ["availableFrom", "availableUntil", "requestedDay"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    beforeWindow: { type: "integer" },
    afterWindow: { type: "integer" },
    accessibleByDates: { type: "boolean" },
  },
  required: ["beforeWindow", "afterWindow", "accessibleByDates"],
} as const;
/** Compare supplied public-source access dates only; no permission is inferred from public availability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { availableFrom, availableUntil, requestedDay } = request;
  const compute = (): Output => {
    H.domain(availableUntil >= availableFrom);
    return {
      beforeWindow: Math.max(0, availableFrom - requestedDay),
      afterWindow: Math.max(0, requestedDay - availableUntil),
      accessibleByDates:
        requestedDay >= availableFrom && requestedDay <= availableUntil,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { availableFrom: 10, availableUntil: 20, requestedDay: 15 },
  output: { beforeWindow: 0, afterWindow: 0, accessibleByDates: true },
} satisfies ToolExample<Input, Output>;
export const publicSourceAccessWindowGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "indigenous-studies/public-source-access-window-gap",
    title: "Public Source Access Window Gap Tool",
    description:
      "Compare supplied public-source access dates only; no permission is inferred from public availability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableFrom: { type: "integer" },
        availableUntil: { type: "integer" },
        requestedDay: { type: "integer" },
      },
      required: ["availableFrom", "availableUntil", "requestedDay"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        beforeWindow: { type: "integer" },
        afterWindow: { type: "integer" },
        accessibleByDates: { type: "boolean" },
      },
      required: ["beforeWindow", "afterWindow", "accessibleByDates"],
    },
    ports: {
      inputs: [
        {
          id: "availableFrom",
          label: "Available From",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "availableUntil",
          label: "Available Until",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "requestedDay",
          label: "Requested Day",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "beforeWindow",
          label: "Before Window",
          valueType: { type: "integer" },
        },
        {
          id: "afterWindow",
          label: "After Window",
          valueType: { type: "integer" },
        },
        {
          id: "accessibleByDates",
          label: "Accessible By Dates",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicSourceAccessWindowGapTool.execute;
export default publicSourceAccessWindowGapTool;
