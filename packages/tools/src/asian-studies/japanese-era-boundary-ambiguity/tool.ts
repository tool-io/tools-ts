import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eraStartGregorianYear: number;
  readonly eraYear: number;
  readonly monthDayKnown: boolean;
  readonly boundaryWithinYear: boolean;
};
export type Output = {
  readonly gregorianYear: number;
  readonly needsBoundaryCheck: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eraStartGregorianYear: { type: "integer", minimum: 1, maximum: 9999 },
    eraYear: { type: "integer", minimum: 1, maximum: 9999 },
    monthDayKnown: { type: "boolean" },
    boundaryWithinYear: { type: "boolean" },
  },
  required: [
    "eraStartGregorianYear",
    "eraYear",
    "monthDayKnown",
    "boundaryWithinYear",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gregorianYear: { type: "integer" },
    needsBoundaryCheck: { type: "boolean" },
  },
  required: ["gregorianYear", "needsBoundaryCheck"],
} as const;
/** Year-only era arithmetic from a supplied start year, explicitly flagging an unresolved first-year boundary. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eraStartGregorianYear, eraYear, monthDayKnown, boundaryWithinYear } =
    request;
  const compute = (): Output => {
    H.integer(eraStartGregorianYear, 1, 9999);
    H.integer(eraYear, 1, 9999);
    return {
      gregorianYear: eraStartGregorianYear + eraYear - 1,
      needsBoundaryCheck: eraYear === 1 && boundaryWithinYear && !monthDayKnown,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    eraStartGregorianYear: 2019,
    eraYear: 1,
    monthDayKnown: false,
    boundaryWithinYear: true,
  },
  output: { gregorianYear: 2019, needsBoundaryCheck: true },
} satisfies ToolExample<Input, Output>;
export const japaneseEraBoundaryAmbiguityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "asian-studies/japanese-era-boundary-ambiguity",
    title: "Japanese Era Boundary Ambiguity Tool",
    description:
      "Year-only era arithmetic from a supplied start year, explicitly flagging an unresolved first-year boundary.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eraStartGregorianYear: { type: "integer", minimum: 1, maximum: 9999 },
        eraYear: { type: "integer", minimum: 1, maximum: 9999 },
        monthDayKnown: { type: "boolean" },
        boundaryWithinYear: { type: "boolean" },
      },
      required: [
        "eraStartGregorianYear",
        "eraYear",
        "monthDayKnown",
        "boundaryWithinYear",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gregorianYear: { type: "integer" },
        needsBoundaryCheck: { type: "boolean" },
      },
      required: ["gregorianYear", "needsBoundaryCheck"],
    },
    ports: {
      inputs: [
        {
          id: "eraStartGregorianYear",
          label: "Era Start Gregorian Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "eraYear",
          label: "Era Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "monthDayKnown",
          label: "Month Day Known",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "boundaryWithinYear",
          label: "Boundary Within Year",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "gregorianYear",
          label: "Gregorian Year",
          valueType: { type: "integer" },
        },
        {
          id: "needsBoundaryCheck",
          label: "Needs Boundary Check",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = japaneseEraBoundaryAmbiguityTool.execute;
export default japaneseEraBoundaryAmbiguityTool;
