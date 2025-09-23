import { Content, ContentUnion } from "@google/genai";

export class Memory {
  private contents: Content[] = [];

  add(entry: Content) {
    this.contents.push(entry);
  }

  getContent(): Content[] {
    return this.contents;
  }

}
