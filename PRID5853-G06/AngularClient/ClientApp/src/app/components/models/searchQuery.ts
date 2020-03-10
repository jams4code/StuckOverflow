export enum filterEnum {
    ByVotes = 0,
    ByTime = 1,
    NotAnswered = 2
  }

  export class searchQuery {
    keywords: string;
    filter: filterEnum;

    constructor(keywords = '', filter = filterEnum.ByVotes){
        this.keywords = keywords;
        this.filter = filter;
    }
    addKeywords(keyword : string){
        this.keywords += keyword;
    }
    updFilter(filter : filterEnum){
        this.filter = filter;
    }
    updKeywords(keyword : string){
        this.keywords = keyword;
    }
}
