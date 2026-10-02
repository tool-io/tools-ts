import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalItems: number;
  readonly answered: number;
  readonly declined: number;
  readonly notPresented: number;
};
export type Output = {
  readonly unexplainedMissing: number;
  readonly responseFraction: number;
  readonly declineFractionOfPresented: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalItems: { type: "integer", minimum: 1 },
    answered: { type: "integer", minimum: 0 },
    declined: { type: "integer", minimum: 0 },
    notPresented: { type: "integer", minimum: 0 },
  },
  required: ["totalItems", "answered", "declined", "notPresented"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unexplainedMissing: { type: "integer" },
    responseFraction: { type: "number" },
    declineFractionOfPresented: { type: "number" },
  },
  required: [
    "unexplainedMissing",
    "responseFraction",
    "declineFractionOfPresented",
  ],
} as const;
/** Separate explicit declined, unpresented and unexplained-missing research-form items rather than treating opt-out as an answer. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalItems, answered, declined, notPresented } = request;
  const compute = (): Output => {
    H.integer(totalItems, 1);
    H.integer(answered, 0);
    H.integer(declined, 0);
    H.integer(notPresented, 0, totalItems - 1);
    H.domain(answered + declined + notPresented <= totalItems);
    return {
      unexplainedMissing: totalItems - answered - declined - notPresented,
      responseFraction: answered / (totalItems - notPresented),
      declineFractionOfPresented: declined / (totalItems - notPresented),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalItems: 20, answered: 12, declined: 3, notPresented: 2 },
  output: {
    unexplainedMissing: 3,
    responseFraction: 0.6666666666666666,
    declineFractionOfPresented: 0.16666666666666666,
  },
} satisfies ToolExample<Input, Output>;
export const psychiatricFormOptOutVersusMissingTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "psychiatry/psychiatric-form-opt-out-versus-missing",
    title: "Psychiatric Form Opt Out Versus Missing Tool",
    description:
      "Separate explicit declined, unpresented and unexplained-missing research-form items rather than treating opt-out as an answer.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalItems: { type: "integer", minimum: 1 },
        answered: { type: "integer", minimum: 0 },
        declined: { type: "integer", minimum: 0 },
        notPresented: { type: "integer", minimum: 0 },
      },
      required: ["totalItems", "answered", "declined", "notPresented"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unexplainedMissing: { type: "integer" },
        responseFraction: { type: "number" },
        declineFractionOfPresented: { type: "number" },
      },
      required: [
        "unexplainedMissing",
        "responseFraction",
        "declineFractionOfPresented",
      ],
    },
    ports: {
      inputs: [
        {
          id: "totalItems",
          label: "Total Items",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "answered",
          label: "Answered",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "declined",
          label: "Declined",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "notPresented",
          label: "Not Presented",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "unexplainedMissing",
          label: "Unexplained Missing",
          valueType: { type: "integer" },
        },
        {
          id: "responseFraction",
          label: "Response Fraction",
          valueType: { type: "number" },
        },
        {
          id: "declineFractionOfPresented",
          label: "Decline Fraction Of Presented",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = psychiatricFormOptOutVersusMissingTool.execute;
export default psychiatricFormOptOutVersusMissingTool;
