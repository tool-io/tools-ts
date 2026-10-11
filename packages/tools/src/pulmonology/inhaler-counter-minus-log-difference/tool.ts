import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly deviceCounterUses: number;
  readonly loggedUses: number;
};
export type Output = { readonly counterMinusLog: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deviceCounterUses: { type: "integer", minimum: 0 },
    loggedUses: { type: "integer", minimum: 0 },
  },
  required: ["deviceCounterUses", "loggedUses"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { counterMinusLog: { type: "integer" } },
  required: ["counterMinusLog"],
} as const;
/** Compare explicit device-counter and diary counts without estimating adherence or recommending inhaler use. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { deviceCounterUses, loggedUses } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(deviceCounterUses) &&
        deviceCounterUses >= 0 &&
        deviceCounterUses <= Number.MAX_SAFE_INTEGER,
      "deviceCounterUses",
    ),
      deviceCounterUses);
    (H.domain(
      Number.isSafeInteger(loggedUses) &&
        loggedUses >= 0 &&
        loggedUses <= Number.MAX_SAFE_INTEGER,
      "loggedUses",
    ),
      loggedUses);
    return { counterMinusLog: deviceCounterUses - loggedUses };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { deviceCounterUses: 25, loggedUses: 22 },
  output: { counterMinusLog: 3 },
} satisfies ToolExample<Input, Output>;
export const inhalerCounterMinusLogDifferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pulmonology", "health and medicine"],
      keywords: ["pulmonology", "health and medicine"],
    },
    id: "pulmonology/inhaler-counter-minus-log-difference",
    title: "Inhaler Counter Minus Log Difference",
    description:
      "Compare explicit device-counter and diary counts without estimating adherence or recommending inhaler use.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deviceCounterUses: { type: "integer", minimum: 0 },
        loggedUses: { type: "integer", minimum: 0 },
      },
      required: ["deviceCounterUses", "loggedUses"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { counterMinusLog: { type: "integer" } },
      required: ["counterMinusLog"],
    },
    ports: {
      inputs: [
        {
          id: "deviceCounterUses",
          label: "Device Counter Uses",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "loggedUses",
          label: "Logged Uses",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "counterMinusLog",
          label: "Counter Minus Log",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = inhalerCounterMinusLogDifferenceTool.execute;
export default inhalerCounterMinusLogDifferenceTool;
