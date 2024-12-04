import { Injectable } from '@angular/core';
import nlp from 'compromise';

@Injectable({
  providedIn: 'root',
})
export class NlpService {
  constructor() {}

  public processQuestion(question: string): string[] {
    const doc = nlp(question);
    const keywords = doc.nouns().out('array');
    return keywords;
  }
}
