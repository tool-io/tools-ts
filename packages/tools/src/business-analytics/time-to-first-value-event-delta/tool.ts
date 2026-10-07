import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly activationTime: number;
  readonly firstValueEventTime: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activationTime: { type: "number" },
    firstValueEventTime: { type: "number" },
  },
  required: ["activationTime", "firstValueEventTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract explicit activation from first-value-event elapsed timestamp using a common monotonic time basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { activationTime, firstValueEventTime } = request;
  const compute = (): Output => {
    return { signedGap: firstValueEventTime - activationTime };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { activationTime: 12, firstValueEventTime: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const timeToFirstValueEventDeltaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "business-analytics",
        "business analytics",
        "business and finance",
      ],
      keywords: ["business analytics", "business and finance"],
    },
    id: "business-analytics/time-to-first-value-event-delta",
    title: "Time To First Value Event Delta",
    description:
      "Subtract explicit activation from first-value-event elapsed timestamp using a common monotonic time basis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        activationTime: { type: "number" },
        firstValueEventTime: { type: "number" },
      },
      required: ["activationTime", "firstValueEventTime"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "activationTime",
          label: "Activation Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstValueEventTime",
          label: "First Value Event Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = timeToFirstValueEventDeltaTool.execute;
export default timeToFirstValueEventDeltaTool;
