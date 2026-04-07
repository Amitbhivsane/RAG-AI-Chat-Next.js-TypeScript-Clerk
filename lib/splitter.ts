// lib/splitter.ts
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

/**
 * splitter: PDF किंवा text documents चे छोटे chunks मध्ये divide करण्यासाठी वापरलं जातं.
 * chunkSize: प्रत्येक chunk मध्ये किती characters असतील
 * chunkOverlap: दोन consecutive chunks मध्ये किती characters overlap होतील
 */
export const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,      // प्रत्येक chunk मध्ये 500 characters
  chunkOverlap: 100,   // consecutive chunks मध्ये 100 characters overlap
});