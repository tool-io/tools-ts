import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstTime: number;
  readonly secondTime: number;
  readonly firstConcentration: number;
  readonly secondConcentration: number;
  readonly logarithmic: boolean;
};
export type Output = { readonly area: number; readonly duration: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstTime: { type: "number" },
    secondTime: { type: "number" },
    firstConcentration: { type: "number" },
    secondConcentration: { type: "number" },
    logarithmic: { type: "boolean" },
  },
  required: [
    "firstTime",
    "secondTime",
    "firstConcentration",
    "secondConcentration",
    "logarithmic",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { area: { type: "number" }, duration: { type: "number" } },
  required: ["area", "duration"],
} as const;
/** One linear or logarithmic research AUC panel under an explicit convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstTime,
    secondTime,
    firstConcentration,
    secondConcentration,
    logarithmic,
  } = request;
  const compute = (): Output => {
    H.domain(
      secondTime >= firstTime &&
        firstConcentration >= 0 &&
        secondConcentration >= 0 &&
        (!logarithmic || (firstConcentration > 0 && secondConcentration > 0)),
    );
    return {
      area:
        logarithmic && firstConcentration !== secondConcentration
          ? ((secondTime - firstTime) *
              (secondConcentration - firstConcentration)) /
            (Math.log(secondConcentration) - Math.log(firstConcentration))
          : ((secondTime - firstTime) *
              (firstConcentration + secondConcentration)) /
            2,
      duration: secondTime - firstTime,
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
    logarithmic: false,
  },
  output: { area: 12, duration: 2 },
} satisfies ToolExample<Input, Output>;
export const pkAucOneTrapezoidPanelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacokinetics/pk-auc-one-trapezoid-panel",
    title: "PK AUC One Trapezoid Panel Tool",
    description:
      "One linear or logarithmic research AUC panel under an explicit convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstTime: { type: "number" },
        secondTime: { type: "number" },
        firstConcentration: { type: "number" },
        secondConcentration: { type: "number" },
        logarithmic: { type: "boolean" },
      },
      required: [
        "firstTime",
        "secondTime",
        "firstConcentration",
        "secondConcentration",
        "logarithmic",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { area: { type: "number" }, duration: { type: "number" } },
      required: ["area", "duration"],
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
        {
          id: "logarithmic",
          label: "Logarithmic",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "area", label: "Area", valueType: { type: "number" } },
        { id: "duration", label: "Duration", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = pkAucOneTrapezoidPanelTool.execute;
export default pkAucOneTrapezoidPanelTool;
