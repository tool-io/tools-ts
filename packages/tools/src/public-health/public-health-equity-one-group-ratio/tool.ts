import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly groupEvents: number;
  readonly groupPopulation: number;
  readonly referenceEvents: number;
  readonly referencePopulation: number;
  readonly rateBase: number;
};
export type Output = {
  readonly groupRate: number;
  readonly referenceRate: number;
  readonly ratio: number;
  readonly difference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    groupEvents: { type: "number", minimum: 0 },
    groupPopulation: { type: "number", exclusiveMinimum: 0 },
    referenceEvents: { type: "number", exclusiveMinimum: 0 },
    referencePopulation: { type: "number", exclusiveMinimum: 0 },
    rateBase: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "groupEvents",
    "groupPopulation",
    "referenceEvents",
    "referencePopulation",
    "rateBase",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    groupRate: { type: "number" },
    referenceRate: { type: "number" },
    ratio: { type: "number" },
    difference: { type: "number" },
  },
  required: ["groupRate", "referenceRate", "ratio", "difference"],
} as const;
/** Calculate public health equity one group ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    groupEvents,
    groupPopulation,
    referenceEvents,
    referencePopulation,
    rateBase,
  } = request;
  const compute = (): Output => {
    H.domain(groupEvents >= 0);
    H.positive(groupPopulation);
    H.positive(referenceEvents);
    H.positive(referencePopulation);
    H.positive(rateBase);
    return {
      groupRate: (groupEvents * rateBase) / groupPopulation,
      referenceRate: (referenceEvents * rateBase) / referencePopulation,
      ratio:
        (groupEvents * referencePopulation) /
        (groupPopulation * referenceEvents),
      difference:
        rateBase *
        (groupEvents / groupPopulation - referenceEvents / referencePopulation),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    groupEvents: 20,
    groupPopulation: 100,
    referenceEvents: 30,
    referencePopulation: 200,
    rateBase: 100,
  },
  output: {
    groupRate: 20,
    referenceRate: 15,
    ratio: 1.3333333333333333,
    difference: 5.000000000000002,
  },
} satisfies ToolExample<Input, Output>;
export const publicHealthEquityOneGroupRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-health/public-health-equity-one-group-ratio",
    title: "Public Health Equity One Group Ratio Tool",
    description:
      "Calculate public health equity one group ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        groupEvents: { type: "number", minimum: 0 },
        groupPopulation: { type: "number", exclusiveMinimum: 0 },
        referenceEvents: { type: "number", exclusiveMinimum: 0 },
        referencePopulation: { type: "number", exclusiveMinimum: 0 },
        rateBase: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "groupEvents",
        "groupPopulation",
        "referenceEvents",
        "referencePopulation",
        "rateBase",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        groupRate: { type: "number" },
        referenceRate: { type: "number" },
        ratio: { type: "number" },
        difference: { type: "number" },
      },
      required: ["groupRate", "referenceRate", "ratio", "difference"],
    },
    ports: {
      inputs: [
        {
          id: "groupEvents",
          label: "Group Events",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "groupPopulation",
          label: "Group Population",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceEvents",
          label: "Reference Events",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referencePopulation",
          label: "Reference Population",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rateBase",
          label: "Rate Base",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "groupRate", label: "Group Rate", valueType: { type: "number" } },
        {
          id: "referenceRate",
          label: "Reference Rate",
          valueType: { type: "number" },
        },
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
        {
          id: "difference",
          label: "Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicHealthEquityOneGroupRatioTool.execute;
export default publicHealthEquityOneGroupRatioTool;
