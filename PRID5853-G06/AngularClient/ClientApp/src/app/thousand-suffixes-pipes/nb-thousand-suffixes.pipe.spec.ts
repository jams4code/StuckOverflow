import { NbThousandSuffixesPipe } from './nb-thousand-suffixes.pipe';

describe('NbThousandSuffixesPipe', () => {
  it('create an instance', () => {
    const pipe = new NbThousandSuffixesPipe();
    expect(pipe).toBeTruthy();
  });
});
