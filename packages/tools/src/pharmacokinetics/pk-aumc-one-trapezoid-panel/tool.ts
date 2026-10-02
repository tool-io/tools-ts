import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstTime: number;
  readonly secondTime: number;
  readonly firstConcentration: number;
  readonly secondConcentration: number;
};
export type Output = {
  readonly momentArea: number;
  readonly concentrationArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstTime: { type: "number", minimum: 0 },
    secondTime: { type: "number" },
    firstConcentration: { type: "number", minimum: 0 },
    secondConcentration: { type: "number", minimum: 0 },
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
    momentArea: { type: "number" },
    concentrationArea: { type: "number" },
  },
  required: ["momentArea", "concentrationArea"],
} as const;
/** Calculate pk aumc one trapezoid panel from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstTime, secondTime, firstConcentration, secondConcentration } =
    request;
  const compute = (): Output => {
    H.domain(
      firstTime >= 0 &&
        secondTime >= firstTime &&
        firstConcentration >= 0 &&
        secondConcentration >= 0,
    );
    return {
      momentArea:
        ((secondTime - firstTime) *
          (firstTime * firstConcentration + secondTime * secondConcentration)) /
        2,
      concentrationArea:
        ((secondTime - firstTime) *
          (firstConcentration + secondConcentration)) /
        2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstTime: 1,
    secondTime: 3,
    firstConcentration: 8,
    secondConcentration: 4,
  },
  output: { momentArea: 20, concentrationArea: 12 },
} satisfies ToolExample<Input, Output>;
export const pkAumcOneTrapezoidPanelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacokinetics/pk-aumc-one-trapezoid-panel",
    title: "PK AUMC One Trapezoid Panel Tool",
    description:
      "Calculate pk aumc one trapezoid panel from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstTime: { type: "number", minimum: 0 },
        secondTime: { type: "number" },
        firstConcentration: { type: "number", minimum: 0 },
        secondConcentration: { type: "number", minimum: 0 },
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
        momentArea: { type: "number" },
        concentrationArea: { type: "number" },
      },
      required: ["momentArea", "concentrationArea"],
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
        {
          id: "momentArea",
          label: "Moment Area",
          valueType: { type: "number" },
        },
        {
          id: "concentrationArea",
          label: "Concentration Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pkAumcOneTrapezoidPanelTool.execute;
export default pkAumcOneTrapezoidPanelTool;
