import { symbolList } from "@bwip-js/generic";

export type CodeSymbologyFamily =
  "linear" | "matrix" | "medical" | "postal" | "qr" | "retail" | "stacked";

export type CodeSymbology = {
  readonly bcid: string;
  readonly defaultOptions: Readonly<Record<string, boolean | number | string>>;
  readonly exampleText: string;
  readonly family: CodeSymbologyFamily;
  readonly slug: string;
  readonly title: string;
};

const qrCodes = new Set([
  "d3aqr",
  "gs1dlqrcode",
  "gs1qrcode",
  "hibcqrcode",
  "microqrcode",
  "qrcode",
  "rectangularmicroqrcode",
  "swissqrcode",
]);

const matrixCodes = new Set([
  "azteccode",
  "azteccodecompact",
  "aztecrune",
  "codeone",
  "datamatrix",
  "datamatrixrectangular",
  "datamatrixrectangularextension",
  "dotcode",
  "gs1datamatrix",
  "gs1datamatrixrectangular",
  "gs1dldatamatrix",
  "gs1dotcode",
  "hanxin",
  "hibcazteccode",
  "hibcdatamatrix",
  "hibcdatamatrixrectangular",
  "maxicode",
  "ultracode",
]);

const stackedCodes = new Set([
  "codablockf",
  "code16k",
  "code49",
  "hibccodablockf",
  "hibcmicropdf417",
  "hibcpdf417",
  "micropdf417",
  "pdf417",
  "pdf417compact",
]);

const postalCodes = new Set([
  "auspost",
  "identcode",
  "japanpost",
  "kix",
  "leitcode",
  "mailmark",
  "onecode",
  "planet",
  "postnet",
  "royalmail",
]);

const medicalCodes = new Set([
  "code32",
  "hibcazteccode",
  "hibccodablockf",
  "hibccode128",
  "hibccode39",
  "hibcdatamatrix",
  "hibcdatamatrixrectangular",
  "hibcmicropdf417",
  "hibcpdf417",
  "hibcqrcode",
  "pharmacode",
  "pharmacode2",
  "pzn",
]);

const retailCodes = new Set([
  "databarexpanded",
  "databarexpandedcomposite",
  "databarexpandedstacked",
  "databarexpandedstackedcomposite",
  "databarlimited",
  "databarlimitedcomposite",
  "databaromni",
  "databaromnicomposite",
  "databarstacked",
  "databarstackedcomposite",
  "databarstackedomni",
  "databarstackedomnicomposite",
  "databartruncated",
  "databartruncatedcomposite",
  "ean13",
  "ean13composite",
  "ean14",
  "ean2",
  "ean5",
  "ean8",
  "ean8composite",
  "gs1-128",
  "gs1-128composite",
  "gs1-cc",
  "gs1northamericancoupon",
  "isbn",
  "ismn",
  "issn",
  "itf14",
  "mands",
  "sscc18",
  "upca",
  "upcacomposite",
  "upce",
  "upcecomposite",
]);

const slugify = (value: string): string =>
  value
    .toLocaleLowerCase("en-US")
    .replaceAll("&", " and ")
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/(?:^-|-$)/gu, "");

const parseDefaultOptions = (
  options: string,
): Readonly<Record<string, boolean | number | string>> =>
  Object.fromEntries(
    options
      .split(/\s+/u)
      .filter(Boolean)
      .map((entry) => {
        const separator = entry.indexOf("=");
        if (separator < 0) return [entry, true] as const;
        const key = entry.slice(0, separator);
        const rawValue = entry.slice(separator + 1);
        const numericValue = Number(rawValue);
        return [
          key,
          rawValue !== "" && Number.isFinite(numericValue)
            ? numericValue
            : rawValue,
        ] as const;
      }),
  );

const familyOf = (bcid: string): CodeSymbologyFamily => {
  if (qrCodes.has(bcid)) return "qr";
  if (medicalCodes.has(bcid)) return "medical";
  if (postalCodes.has(bcid)) return "postal";
  if (retailCodes.has(bcid)) return "retail";
  if (matrixCodes.has(bcid)) return "matrix";
  if (stackedCodes.has(bcid)) return "stacked";
  return "linear";
};

export const codeSymbologies: readonly CodeSymbology[] = Object.freeze(
  symbolList
    .map((symbol) => ({
      bcid: symbol.bcid,
      defaultOptions: parseDefaultOptions(symbol.opts),
      exampleText: symbol.text,
      family: familyOf(symbol.bcid),
      slug: slugify(symbol.desc),
      title: symbol.desc,
    }))
    .sort(
      (first, second) =>
        first.title.localeCompare(second.title, "en-US") ||
        first.bcid.localeCompare(second.bcid, "en-US"),
    ),
);

export const qrCodeSymbologies: readonly CodeSymbology[] = Object.freeze(
  codeSymbologies.filter(({ family }) => family === "qr"),
);

export const barcodeSymbologies: readonly CodeSymbology[] = Object.freeze(
  codeSymbologies.filter(({ family }) => family !== "qr"),
);

const byBcid = new Map(codeSymbologies.map((entry) => [entry.bcid, entry]));
const bySlug = new Map(codeSymbologies.map((entry) => [entry.slug, entry]));

export const findCodeSymbology = (id: string): CodeSymbology | undefined =>
  byBcid.get(id) ?? bySlug.get(id);
