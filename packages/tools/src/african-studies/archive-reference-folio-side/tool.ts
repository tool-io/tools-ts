import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reference: string;
  readonly rectoToken: string;
  readonly versoToken: string;
};
export type Output = {
  readonly folioToken: string;
  readonly side: string;
  readonly recognized: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reference: { type: "string", maxLength: 8192 },
    rectoToken: { type: "string", maxLength: 8192 },
    versoToken: { type: "string", maxLength: 8192 },
  },
  required: ["reference", "rectoToken", "versoToken"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    folioToken: { type: "string", maxLength: 8192 },
    side: { type: "string", maxLength: 8192 },
    recognized: { type: "boolean" },
  },
  required: ["folioToken", "side", "recognized"],
} as const;
/** Inspect explicit archival folio-side suffixes without interpreting a collection-specific reference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reference, rectoToken, versoToken } = request;
  const compute = (): Output => {
    H.domain(
      rectoToken.length > 0 &&
        versoToken.length > 0 &&
        rectoToken !== versoToken,
    );
    const r = reference.endsWith(rectoToken),
      v = reference.endsWith(versoToken);
    H.domain(!(r && v));
    const suffix = r ? rectoToken : v ? versoToken : "";
    return {
      folioToken: suffix ? reference.slice(0, -suffix.length) : reference,
      side: r ? "recto" : v ? "verso" : "unspecified",
      recognized: r || v,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reference: "f12v", rectoToken: "r", versoToken: "v" },
  output: { folioToken: "f12", side: "verso", recognized: true },
} satisfies ToolExample<Input, Output>;
export const archiveReferenceFolioSideTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "african-studies/archive-reference-folio-side",
    title: "Archive Reference Folio Side Tool",
    description:
      "Inspect explicit archival folio-side suffixes without interpreting a collection-specific reference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reference: { type: "string", maxLength: 8192 },
        rectoToken: { type: "string", maxLength: 8192 },
        versoToken: { type: "string", maxLength: 8192 },
      },
      required: ["reference", "rectoToken", "versoToken"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        folioToken: { type: "string", maxLength: 8192 },
        side: { type: "string", maxLength: 8192 },
        recognized: { type: "boolean" },
      },
      required: ["folioToken", "side", "recognized"],
    },
    ports: {
      inputs: [
        {
          id: "reference",
          label: "Reference",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "rectoToken",
          label: "Recto Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "versoToken",
          label: "Verso Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "folioToken",
          label: "Folio Token",
          valueType: { type: "string" },
        },
        { id: "side", label: "Side", valueType: { type: "string" } },
        {
          id: "recognized",
          label: "Recognized",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = archiveReferenceFolioSideTool.execute;
export default archiveReferenceFolioSideTool;
