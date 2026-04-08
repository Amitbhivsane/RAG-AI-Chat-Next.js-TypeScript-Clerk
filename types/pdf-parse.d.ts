// types/pdf-parse.d.ts
declare module "pdf-parse" {
  interface PDFInfo {
    numpages: number;
    numrender: number;
    info: any;
    metadata: any;
    version: string;
  }

  interface PDFParseResult {
    numpages: number;
    numrender: number;
    info: any;
    metadata: any;
    text: string;
    version: string;
  }

  function pdf(dataBuffer: Buffer | Uint8Array): Promise<PDFParseResult>;

  export = pdf;
}