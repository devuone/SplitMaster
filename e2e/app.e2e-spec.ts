import { SplitMasterPage } from './app.po';

describe('split-master App', function() {
  let page: SplitMasterPage;

  beforeEach(() => {
    page = new SplitMasterPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
