import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstTime: number;
  readonly secondTime: number;
  readonly firstSignal: number;
  readonly secondSignal: number;
  readonly baseline: number;
};
export type Output = {
  readonly rawArea: number;
  readonly baselineArea: number;
  readonly correctedArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstTime: { type: "number" },
    secondTime: { type: "number" },
    firstSignal: { type: "number" },
    secondSignal: { type: "number" },
    baseline: { type: "number" },
  },
  required: [
    "firstTime",
    "secondTime",
    "firstSignal",
    "secondSignal",
    "baseline",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawArea: { type: "number" },
    baselineArea: { type: "number" },
    correctedArea: { type: "number" },
  },
  required: ["rawArea", "baselineArea", "correctedArea"],
} as const;
/** One signed trapezoid above a supplied constant baseline, without integrating an unobserved full immune-response curve. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstTime, secondTime, firstSignal, secondSignal, baseline } =
    request;
  const compute = (): Output => {
    H.domain(secondTime >= firstTime);
    return {
      rawArea: ((secondTime - firstTime) * (firstSignal + secondSignal)) / 2,
      baselineArea: (secondTime - firstTime) * baseline,
      correctedArea:
        (secondTime - firstTime) *
        ((firstSignal + secondSignal) / 2 - baseline),
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
    firstSignal: 3,
    secondSignal: 7,
    baseline: 2,
  },
  output: { rawArea: 10, baselineArea: 4, correctedArea: 6 },
} satisfies ToolExample<Input, Output>;
export const immuneResponseBaselineAreaOnePanelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "immunology/immune-response-baseline-area-one-panel",
    title: "Immune Response Baseline Area One Panel Tool",
    description:
      "One signed trapezoid above a supplied constant baseline, without integrating an unobserved full immune-response curve.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstTime: { type: "number" },
        secondTime: { type: "number" },
        firstSignal: { type: "number" },
        secondSignal: { type: "number" },
        baseline: { type: "number" },
      },
      required: [
        "firstTime",
        "secondTime",
        "firstSignal",
        "secondSignal",
        "baseline",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rawArea: { type: "number" },
        baselineArea: { type: "number" },
        correctedArea: { type: "number" },
      },
      required: ["rawArea", "baselineArea", "correctedArea"],
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
          id: "firstSignal",
          label: "First Signal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondSignal",
          label: "Second Signal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "baseline",
          label: "Baseline",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "rawArea", label: "Raw Area", valueType: { type: "number" } },
        {
          id: "baselineArea",
          label: "Baseline Area",
          valueType: { type: "number" },
        },
        {
          id: "correctedArea",
          label: "Corrected Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = immuneResponseBaselineAreaOnePanelTool.execute;
export default immuneResponseBaselineAreaOnePanelTool;
