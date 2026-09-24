import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialTemperature: number;
  readonly finalTemperature: number;
  readonly bathTemperature: number;
  readonly timeConstant: number;
};
export type Output = { readonly logRatio: number; readonly elapsed: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialTemperature: { type: "number" },
    finalTemperature: { type: "number" },
    bathTemperature: { type: "number", minimum: 0 },
    timeConstant: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "initialTemperature",
    "finalTemperature",
    "bathTemperature",
    "timeConstant",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { logRatio: { type: "number" }, elapsed: { type: "number" } },
  required: ["logRatio", "elapsed"],
} as const;
/** Constant time-constant exponential cooling toward a fixed bath; actual cryogenic heat capacity/conductance variation is not inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    initialTemperature,
    finalTemperature,
    bathTemperature,
    timeConstant,
  } = request;
  const compute = (): Output => {
    H.domain(bathTemperature >= 0);
    H.domain(
      initialTemperature >= finalTemperature &&
        finalTemperature > bathTemperature,
    );
    H.positive(timeConstant);
    return {
      logRatio: Math.log(
        (initialTemperature - bathTemperature) /
          (finalTemperature - bathTemperature),
      ),
      elapsed:
        timeConstant *
        Math.log(
          (initialTemperature - bathTemperature) /
            (finalTemperature - bathTemperature),
        ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    initialTemperature: 100,
    finalTemperature: 40,
    bathTemperature: 20,
    timeConstant: 10,
  },
  output: { logRatio: 1.3862943611198906, elapsed: 13.862943611198906 },
} satisfies ToolExample<Input, Output>;
export const cooldownLogTemperatureRatioTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cryogenics/cooldown-log-temperature-ratio-term",
    title: "Cooldown Log Temperature Ratio Term Tool",
    description:
      "Constant time-constant exponential cooling toward a fixed bath; actual cryogenic heat capacity/conductance variation is not inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialTemperature: { type: "number" },
        finalTemperature: { type: "number" },
        bathTemperature: { type: "number", minimum: 0 },
        timeConstant: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "initialTemperature",
        "finalTemperature",
        "bathTemperature",
        "timeConstant",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { logRatio: { type: "number" }, elapsed: { type: "number" } },
      required: ["logRatio", "elapsed"],
    },
    ports: {
      inputs: [
        {
          id: "initialTemperature",
          label: "Initial Temperature",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "finalTemperature",
          label: "Final Temperature",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bathTemperature",
          label: "Bath Temperature",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "timeConstant",
          label: "Time Constant",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "logRatio", label: "Log Ratio", valueType: { type: "number" } },
        { id: "elapsed", label: "Elapsed", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cooldownLogTemperatureRatioTermTool.execute;
export default cooldownLogTemperatureRatioTermTool;
