import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly targetCatch: number;
  readonly bycatch: number;
  readonly unidentifiedCatch: number;
  readonly includeUnidentified: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly bycatchShare: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    targetCatch: { type: "integer", minimum: 0 },
    bycatch: { type: "integer", minimum: 0 },
    unidentifiedCatch: { type: "integer", minimum: 0 },
    includeUnidentified: { type: "boolean" },
  },
  required: [
    "targetCatch",
    "bycatch",
    "unidentifiedCatch",
    "includeUnidentified",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    bycatchShare: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["denominator", "bycatchShare", "defined"],
} as const;
/** Calculate the explicitly counted bycatch share using a caller-selected unidentified-catch denominator policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { targetCatch, bycatch, unidentifiedCatch, includeUnidentified } =
    request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(targetCatch) &&
        targetCatch >= 0 &&
        targetCatch <= Number.MAX_SAFE_INTEGER,
      "targetCatch",
    ),
      targetCatch);
    (H.domain(
      Number.isSafeInteger(bycatch) &&
        bycatch >= 0 &&
        bycatch <= Number.MAX_SAFE_INTEGER,
      "bycatch",
    ),
      bycatch);
    (H.domain(
      Number.isSafeInteger(unidentifiedCatch) &&
        unidentifiedCatch >= 0 &&
        unidentifiedCatch <= Number.MAX_SAFE_INTEGER,
      "unidentifiedCatch",
    ),
      unidentifiedCatch);
    return (() => {
      const denominator =
        targetCatch + bycatch + (includeUnidentified ? unidentifiedCatch : 0);
      return {
        denominator,
        bycatchShare: denominator > 0 ? bycatch / denominator : 0,
        defined: denominator > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    targetCatch: 70,
    bycatch: 20,
    unidentifiedCatch: 10,
    includeUnidentified: true,
  },
  output: { denominator: 100, bycatchShare: 0.2, defined: true },
} satisfies ToolExample<Input, Output>;
export const trapCatchByCatchShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["entomology", "biology"],
      keywords: ["entomology", "biology"],
    },
    id: "entomology/trap-catch-by-catch-share",
    title: "Trap Catch By Catch Share",
    description:
      "Calculate the explicitly counted bycatch share using a caller-selected unidentified-catch denominator policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        targetCatch: { type: "integer", minimum: 0 },
        bycatch: { type: "integer", minimum: 0 },
        unidentifiedCatch: { type: "integer", minimum: 0 },
        includeUnidentified: { type: "boolean" },
      },
      required: [
        "targetCatch",
        "bycatch",
        "unidentifiedCatch",
        "includeUnidentified",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "integer" },
        bycatchShare: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["denominator", "bycatchShare", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "targetCatch",
          label: "Target Catch",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "bycatch",
          label: "Bycatch",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unidentifiedCatch",
          label: "Unidentified Catch",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "includeUnidentified",
          label: "Include Unidentified",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "integer" },
        },
        {
          id: "bycatchShare",
          label: "Bycatch Share",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = trapCatchByCatchShareTool.execute;
export default trapCatchByCatchShareTool;
