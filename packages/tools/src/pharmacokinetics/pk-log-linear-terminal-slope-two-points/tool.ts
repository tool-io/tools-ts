import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstTime: number;
  readonly secondTime: number;
  readonly firstConcentration: number;
  readonly secondConcentration: number;
};
export type Output = {
  readonly slope: number;
  readonly eliminationRate: number;
  readonly halfLife: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstTime: { type: "number" },
    secondTime: { type: "number" },
    firstConcentration: { type: "number" },
    secondConcentration: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "firstTime",
    "secondTime",
    "firstConcentration",
    "secondConcentration",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    slope: { type: "number" },
    eliminationRate: { type: "number" },
    halfLife: { type: "number" },
  },
  required: ["slope", "eliminationRate", "halfLife"],
} as const;
/** Two-point research log slope; no terminal-phase selection or dosing inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstTime, secondTime, firstConcentration, secondConcentration } =
    request;
  const compute = (): Output => {
    H.domain(
      secondTime > firstTime &&
        firstConcentration > secondConcentration &&
        secondConcentration > 0,
    );
    return {
      slope:
        (Math.log(secondConcentration) - Math.log(firstConcentration)) /
        (secondTime - firstTime),
      eliminationRate:
        (Math.log(firstConcentration) - Math.log(secondConcentration)) /
        (secondTime - firstTime),
      halfLife:
        (Math.LN2 * (secondTime - firstTime)) /
        (Math.log(firstConcentration) - Math.log(secondConcentration)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstTime: 0,
    secondTime: 2,
    firstConcentration: 8,
    secondConcentration: 4,
  },
  output: {
    slope: -0.3465735902799726,
    eliminationRate: 0.3465735902799726,
    halfLife: 2.0000000000000004,
  },
} satisfies ToolExample<Input, Output>;
export const pkLogLinearTerminalSlopeTwoPointsTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacokinetics/pk-log-linear-terminal-slope-two-points",
    title: "PK Log Linear Terminal Slope Two Points Tool",
    description:
      "Two-point research log slope; no terminal-phase selection or dosing inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstTime: { type: "number" },
        secondTime: { type: "number" },
        firstConcentration: { type: "number" },
        secondConcentration: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "firstTime",
        "secondTime",
        "firstConcentration",
        "secondConcentration",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        slope: { type: "number" },
        eliminationRate: { type: "number" },
        halfLife: { type: "number" },
      },
      required: ["slope", "eliminationRate", "halfLife"],
    },
    ports: {
      inputs: [
        {
          id: "firstTime",
          label: "First Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondTime",
          label: "Second Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstConcentration",
          label: "First Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondConcentration",
          label: "Second Concentration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "slope", label: "Slope", valueType: { type: "number" } },
        {
          id: "eliminationRate",
          label: "Elimination Rate",
          valueType: { type: "number" },
        },
        { id: "halfLife", label: "Half Life", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = pkLogLinearTerminalSlopeTwoPointsTool.execute;
export default pkLogLinearTerminalSlopeTwoPointsTool;
