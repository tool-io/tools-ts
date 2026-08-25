import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type IncotermsResponsibilityMatrixLookupInput = {
  readonly term:
    | "CFR"
    | "CIF"
    | "CIP"
    | "CPT"
    | "DAP"
    | "DDP"
    | "DPU"
    | "EXW"
    | "FAS"
    | "FCA"
    | "FOB";
};

export type IncotermsResponsibilityMatrixLookupOutput = {
  readonly exportClearance: "buyer" | "seller";
  readonly importClearance: "buyer" | "seller";
  readonly insuranceObligation: "not_mandated" | "seller_required";
  readonly mainCarriagePayer: "buyer" | "seller";
  readonly riskTransferPoint: string;
};

type IncotermRow = {
  exportClearance: "buyer" | "seller";
  importClearance: "buyer" | "seller";
  insuranceObligation: "not_mandated" | "seller_required";
  mainCarriagePayer: "buyer" | "seller";
  riskTransferPoint: string;
};

const MATRIX: Record<
  IncotermsResponsibilityMatrixLookupInput["term"],
  IncotermRow
> = {
  CFR: {
    exportClearance: "seller",
    importClearance: "buyer",
    insuranceObligation: "not_mandated",
    mainCarriagePayer: "seller",
    riskTransferPoint: "on board the vessel at the port of shipment",
  },
  CIF: {
    exportClearance: "seller",
    importClearance: "buyer",
    insuranceObligation: "seller_required",
    mainCarriagePayer: "seller",
    riskTransferPoint: "on board the vessel at the port of shipment",
  },
  CIP: {
    exportClearance: "seller",
    importClearance: "buyer",
    insuranceObligation: "seller_required",
    mainCarriagePayer: "seller",
    riskTransferPoint:
      "on handover to the first carrier at the agreed shipment place",
  },
  CPT: {
    exportClearance: "seller",
    importClearance: "buyer",
    insuranceObligation: "not_mandated",
    mainCarriagePayer: "seller",
    riskTransferPoint:
      "on handover to the first carrier at the agreed shipment place",
  },
  DAP: {
    exportClearance: "seller",
    importClearance: "buyer",
    insuranceObligation: "not_mandated",
    mainCarriagePayer: "seller",
    riskTransferPoint: "at the named destination place, ready for unloading",
  },
  DDP: {
    exportClearance: "seller",
    importClearance: "seller",
    insuranceObligation: "not_mandated",
    mainCarriagePayer: "seller",
    riskTransferPoint: "at the named destination place, ready for unloading",
  },
  DPU: {
    exportClearance: "seller",
    importClearance: "buyer",
    insuranceObligation: "not_mandated",
    mainCarriagePayer: "seller",
    riskTransferPoint: "at the named destination place after unloading",
  },
  EXW: {
    exportClearance: "buyer",
    importClearance: "buyer",
    insuranceObligation: "not_mandated",
    mainCarriagePayer: "buyer",
    riskTransferPoint: "at the seller's premises on handover to the buyer",
  },
  FAS: {
    exportClearance: "seller",
    importClearance: "buyer",
    insuranceObligation: "not_mandated",
    mainCarriagePayer: "buyer",
    riskTransferPoint: "alongside the vessel at the port of shipment",
  },
  FCA: {
    exportClearance: "seller",
    importClearance: "buyer",
    insuranceObligation: "not_mandated",
    mainCarriagePayer: "buyer",
    riskTransferPoint: "on handover to the buyer's carrier at the agreed place",
  },
  FOB: {
    exportClearance: "seller",
    importClearance: "buyer",
    insuranceObligation: "not_mandated",
    mainCarriagePayer: "buyer",
    riskTransferPoint: "on board the vessel at the port of shipment",
  },
};

export const calculateIncotermsResponsibilityMatrixLookup = (
  input: IncotermsResponsibilityMatrixLookupInput,
): IncotermsResponsibilityMatrixLookupOutput => {
  const row = MATRIX[input.term];
  if (row === undefined)
    return simpleError(
      "term",
      "The term must be one of the eleven Incoterms 2020 rules.",
      "invalid_term",
    );
  return { ...row };
};

export const incotermsResponsibilityMatrixLookupExample = {
  input: { term: "DDP" },
  output: {
    exportClearance: "seller",
    importClearance: "seller",
    insuranceObligation: "not_mandated",
    mainCarriagePayer: "seller",
    riskTransferPoint: "at the named destination place, ready for unloading",
  },
} satisfies ToolExample<
  IncotermsResponsibilityMatrixLookupInput,
  IncotermsResponsibilityMatrixLookupOutput
>;

export const incotermsResponsibilityMatrixLookupTool = createSimpleTool({
  id: "logistics/incoterms-responsibility-matrix-lookup",
  title: "Incoterms Responsibility Matrix Lookup",
  description:
    "Return the ICC Incoterms 2020 split of export clearance, import clearance, main-carriage payment, risk transfer point and mandatory insurance between seller and buyer for any of the eleven terms.",
  inputs: [
    {
      description: "Incoterms 2020 rule.",
      enum: [
        "EXW",
        "FCA",
        "FAS",
        "FOB",
        "CFR",
        "CIF",
        "CPT",
        "CIP",
        "DAP",
        "DPU",
        "DDP",
      ],
      id: "term",
      kind: "string",
      label: "Term",
    },
  ],
  outputs: [
    {
      description: "Party responsible for export clearance.",
      enum: ["seller", "buyer"],
      id: "exportClearance",
      kind: "string",
      label: "Export clearance",
    },
    {
      description: "Party responsible for import clearance.",
      enum: ["seller", "buyer"],
      id: "importClearance",
      kind: "string",
      label: "Import clearance",
    },
    {
      description: "Insurance obligation under the rule.",
      enum: ["not_mandated", "seller_required"],
      id: "insuranceObligation",
      kind: "string",
      label: "Insurance",
    },
    {
      description: "Party paying for main carriage.",
      enum: ["seller", "buyer"],
      id: "mainCarriagePayer",
      kind: "string",
      label: "Main carriage",
    },
    {
      description: "Where risk transfers from seller to buyer.",
      id: "riskTransferPoint",
      kind: "string",
      label: "Risk transfer",
    },
  ],
  calculate: (input) =>
    calculateIncotermsResponsibilityMatrixLookup({
      term: input.term as IncotermsResponsibilityMatrixLookupInput["term"],
    }),
});

export const runIncotermsResponsibilityMatrixLookup =
  incotermsResponsibilityMatrixLookupTool.execute;
export default incotermsResponsibilityMatrixLookupTool;
