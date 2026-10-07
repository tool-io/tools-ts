import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly beforeForceNewtons: number;
  readonly afterForceNewtons: number;
  readonly beforeDisplacementMillimeters: number;
  readonly afterDisplacementMillimeters: number;
};
export type Output = {
  readonly forceChangeNewtons: number;
  readonly displacementChangeMillimeters: number;
  readonly secantStiffnessNewtonsPerMillimeter: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    beforeForceNewtons: { type: "number" },
    afterForceNewtons: { type: "number" },
    beforeDisplacementMillimeters: { type: "number" },
    afterDisplacementMillimeters: { type: "number" },
  },
  required: [
    "beforeForceNewtons",
    "afterForceNewtons",
    "beforeDisplacementMillimeters",
    "afterDisplacementMillimeters",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    forceChangeNewtons: { type: "number" },
    displacementChangeMillimeters: { type: "number" },
    secantStiffnessNewtonsPerMillimeter: { type: "number" },
  },
  required: [
    "forceChangeNewtons",
    "displacementChangeMillimeters",
    "secantStiffnessNewtonsPerMillimeter",
  ],
} as const;
/** Describe a measured prosthetic bench-test load/displacement increment and secant stiffness without assessing clinical fitness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    beforeForceNewtons,
    afterForceNewtons,
    beforeDisplacementMillimeters,
    afterDisplacementMillimeters,
  } = request;
  const compute = (): Output => {
    H.domain(
      afterDisplacementMillimeters !== beforeDisplacementMillimeters,
      "afterDisplacementMillimeters",
    );
    return {
      forceChangeNewtons: afterForceNewtons - beforeForceNewtons,
      displacementChangeMillimeters:
        afterDisplacementMillimeters - beforeDisplacementMillimeters,
      secantStiffnessNewtonsPerMillimeter:
        (afterForceNewtons - beforeForceNewtons) /
        (afterDisplacementMillimeters - beforeDisplacementMillimeters),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    beforeForceNewtons: 10,
    afterForceNewtons: 110,
    beforeDisplacementMillimeters: 1,
    afterDisplacementMillimeters: 3,
  },
  output: {
    forceChangeNewtons: 100,
    displacementChangeMillimeters: 2,
    secantStiffnessNewtonsPerMillimeter: 50,
  },
} satisfies ToolExample<Input, Output>;
export const prostheticBenchLoadDisplacementPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["bioengineering", "engineering"],
        keywords: ["bioengineering", "engineering"],
      },
      id: "bioengineering/prosthetic-bench-load-displacement-pair",
      title: "Prosthetic Bench Load Displacement Pair",
      description:
        "Describe a measured prosthetic bench-test load/displacement increment and secant stiffness without assessing clinical fitness.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          beforeForceNewtons: { type: "number" },
          afterForceNewtons: { type: "number" },
          beforeDisplacementMillimeters: { type: "number" },
          afterDisplacementMillimeters: { type: "number" },
        },
        required: [
          "beforeForceNewtons",
          "afterForceNewtons",
          "beforeDisplacementMillimeters",
          "afterDisplacementMillimeters",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          forceChangeNewtons: { type: "number" },
          displacementChangeMillimeters: { type: "number" },
          secantStiffnessNewtonsPerMillimeter: { type: "number" },
        },
        required: [
          "forceChangeNewtons",
          "displacementChangeMillimeters",
          "secantStiffnessNewtonsPerMillimeter",
        ],
      },
      ports: {
        inputs: [
          {
            id: "beforeForceNewtons",
            label: "Before Force Newtons",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "afterForceNewtons",
            label: "After Force Newtons",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "beforeDisplacementMillimeters",
            label: "Before Displacement Millimeters",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "afterDisplacementMillimeters",
            label: "After Displacement Millimeters",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "forceChangeNewtons",
            label: "Force Change Newtons",
            valueType: { type: "number" },
          },
          {
            id: "displacementChangeMillimeters",
            label: "Displacement Change Millimeters",
            valueType: { type: "number" },
          },
          {
            id: "secantStiffnessNewtonsPerMillimeter",
            label: "Secant Stiffness Newtons Per Millimeter",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = prostheticBenchLoadDisplacementPairTool.execute;
export default prostheticBenchLoadDisplacementPairTool;
