import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstTemperature: number;
  readonly secondTemperature: number;
};
export type Output = { readonly secondMinusFirst: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstTemperature: { type: "number" },
    secondTemperature: { type: "number" },
  },
  required: ["firstTemperature", "secondTemperature"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { secondMinusFirst: { type: "number" } },
  required: ["secondMinusFirst"],
} as const;
/** Compare explicit same-scale incubator temperature-channel readings without setting temperatures or assessing suitability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstTemperature, secondTemperature } = request;
  const compute = (): Output => {
    return { secondMinusFirst: secondTemperature - firstTemperature };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstTemperature: 36.5, secondTemperature: 36.8 },
  output: { secondMinusFirst: 0.29999999999999716 },
} satisfies ToolExample<Input, Output>;
export const incubatorTemperatureChannelDeltaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["neonatology", "health and medicine"],
      keywords: ["neonatology", "health and medicine"],
    },
    id: "neonatology/incubator-temperature-channel-delta",
    title: "Incubator Temperature Channel Delta",
    description:
      "Compare explicit same-scale incubator temperature-channel readings without setting temperatures or assessing suitability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstTemperature: { type: "number" },
        secondTemperature: { type: "number" },
      },
      required: ["firstTemperature", "secondTemperature"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { secondMinusFirst: { type: "number" } },
      required: ["secondMinusFirst"],
    },
    ports: {
      inputs: [
        {
          id: "firstTemperature",
          label: "First Temperature",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondTemperature",
          label: "Second Temperature",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "secondMinusFirst",
          label: "Second Minus First",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = incubatorTemperatureChannelDeltaTool.execute;
export default incubatorTemperatureChannelDeltaTool;
