import { Content } from "@google/genai";

export class Memory {
  private contents: Content[] = [];

  add(entry: Content) {
    this.contents.push(entry);
  }

  getContent() {
    return this.contents;
  }
 
  reset() {
    this.contents = []
  }

}
