
import { BIBLE_BOOKS } from '../constants';
import { DayPlan, ReadingItem } from '../types';

export function generate180DayPlan(): DayPlan[] {
  const plan: DayPlan[] = [];
  const otBooks = BIBLE_BOOKS.filter(b => b.testament === 'Old');
  const ntBooks = BIBLE_BOOKS.filter(b => b.testament === 'New');

  let otCurrentBookIdx = 0;
  let otCurrentChapter = 1;
  let ntCurrentBookIdx = 0;
  let ntCurrentChapter = 1;

  const TOTAL_DAYS = 180;
  
  // Total OT chapters: ~929
  // Total NT chapters: ~260
  // Per day: OT: ~5.16, NT: ~1.44
  
  for (let d = 1; d <= TOTAL_DAYS; d++) {
    const readings: ReadingItem[] = [];

    // Old Testament Portion (~5 chapters)
    let otChaptersToRead = d === TOTAL_DAYS ? 999 : 5; // Finish it all on last day if leftovers
    while (otChaptersToRead > 0 && otCurrentBookIdx < otBooks.length) {
      const book = otBooks[otCurrentBookIdx];
      const chaptersLeftInBook = book.chapters - otCurrentChapter + 1;
      const chaptersCanRead = Math.min(otChaptersToRead, chaptersLeftInBook);
      
      readings.push({
        book: book.name,
        startChapter: otCurrentChapter,
        endChapter: otCurrentChapter + chaptersCanRead - 1
      });

      otChaptersToRead -= chaptersCanRead;
      otCurrentChapter += chaptersCanRead;

      if (otCurrentChapter > book.chapters) {
        otCurrentBookIdx++;
        otCurrentChapter = 1;
      }
    }

    // New Testament Portion (~1-2 chapters)
    let ntChaptersToRead = d === TOTAL_DAYS ? 999 : (d % 3 === 0 ? 2 : 1);
    while (ntChaptersToRead > 0 && ntCurrentBookIdx < ntBooks.length) {
      const book = ntBooks[ntCurrentBookIdx];
      const chaptersLeftInBook = book.chapters - ntCurrentChapter + 1;
      const chaptersCanRead = Math.min(ntChaptersToRead, chaptersLeftInBook);
      
      readings.push({
        book: book.name,
        startChapter: ntCurrentChapter,
        endChapter: ntCurrentChapter + chaptersCanRead - 1
      });

      ntChaptersToRead -= chaptersCanRead;
      ntCurrentChapter += chaptersCanRead;

      if (ntCurrentChapter > book.chapters) {
        ntCurrentBookIdx++;
        ntCurrentChapter = 1;
      }
    }

    plan.push({
      day: d,
      readings,
      isCompleted: false
    });
  }

  return plan;
}
