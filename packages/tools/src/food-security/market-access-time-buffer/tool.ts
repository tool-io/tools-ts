import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly availableTime: number;
  readonly outboundTravel: number;
  readonly returnTravel: number;
  readonly transactionTime: number;
};
export type Output = { readonly requiredTime: number; readonly buffer: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableTime: { type: "number" },
    outboundTravel: { type: "number" },
    returnTravel: { type: "number" },
    transactionTime: { type: "number" },
  },
  required: [
    "availableTime",
    "outboundTravel",
    "returnTravel",
    "transactionTime",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { requiredTime: { type: "number" }, buffer: { type: "number" } },
  required: ["requiredTime", "buffer"],
} as const;
/** Calculate market access time buffer from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { availableTime, outboundTravel, returnTravel, transactionTime } =
    request;
  const compute = (): Output => {
    H.domain(
      [availableTime, outboundTravel, returnTravel, transactionTime].every(
        (x) => x >= 0,
      ),
    );
    return {
      requiredTime: outboundTravel + returnTravel + transactionTime,
      buffer: availableTime - outboundTravel - returnTravel - transactionTime,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    availableTime: 100,
    outboundTravel: 20,
    returnTravel: 30,
    transactionTime: 10,
  },
  output: { requiredTime: 60, buffer: 40 },
} satisfies ToolExample<Input, Output>;
export const marketAccessTimeBufferTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-security/market-access-time-buffer",
    title: "Market Access Time Buffer Tool",
    description:
      "Calculate market access time buffer from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableTime: { type: "number" },
        outboundTravel: { type: "number" },
        returnTravel: { type: "number" },
        transactionTime: { type: "number" },
      },
      required: [
        "availableTime",
        "outboundTravel",
        "returnTravel",
        "transactionTime",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredTime: { type: "number" },
        buffer: { type: "number" },
      },
      required: ["requiredTime", "buffer"],
    },
    ports: {
      inputs: [
        {
          id: "availableTime",
          label: "Available Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outboundTravel",
          label: "Outbound Travel",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "returnTravel",
          label: "Return Travel",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "transactionTime",
          label: "Transaction Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "requiredTime",
          label: "Required Time",
          valueType: { type: "number" },
        },
        { id: "buffer", label: "Buffer", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = marketAccessTimeBufferTool.execute;
export default marketAccessTimeBufferTool;
